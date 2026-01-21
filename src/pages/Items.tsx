import { useEffect, useState } from "react";
import { db } from "@/db";
import type { Item } from "@/db";
import { ImagePlus } from "lucide-react";
import { useRef } from "react";

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);

  // add form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState<string | undefined>();

  // etc
  const [pulse, setPulse] = useState<{
    id: number | null;
    type: "up" | "down" | null;
  }>({ id: null, type: null });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setItems(await db.items.toArray());
  };

  const readImage = (file: File, cb: (img: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addItem = async () => {
    if (!name || !price || !stock) return;

    await db.items.add({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      image,
      createdAt: new Date(),
    });

    setName("");
    setPrice("");
    setStock("");
    setImage(undefined);
    refresh();
  };

  const changeStock = async (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.stock + delta < 0) return;

    await db.items.update(id, { stock: item.stock + delta });
    await refresh();

    setPulse({
      id,
      type: delta > 0 ? "up" : "down",
    });

    setTimeout(() => {
      setPulse({ id: null, type: null });
    }, 300);
  };

  const startEdit = (item: Item) => {
    setEditingId(item.id!);
    setEditName(item.name);
    setEditPrice(String(item.price));
    setEditImage(item.image);
  };

  const saveEdit = async (id: number) => {
    await db.items.update(id, {
      name: editName.trim(),
      price: Number(editPrice),
      image: editImage,
    });
    cancelEdit();
    refresh();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditImage(undefined);
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete item? Sales history will remain.")) return;
    await db.items.delete(id);
    refresh();
  };

  return (
    <div className="h-full bg-[#020617] text-white p-4 overflow-auto">
      <h1 className="text-xl font-semibold mb-4">Items</h1>

      {/* ADD ITEM */}
      <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          className="col-span-2 px-3 py-2 rounded bg-[#020617] border border-white/10"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="px-3 py-2 rounded bg-[#020617] border border-white/10"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          className="px-3 py-2 rounded bg-[#020617] border border-white/10"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <div className="flex flex-col gap-2 md:col-span-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files && readImage(e.target.files[0], setImage)
            }
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-[#020617] border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            <ImagePlus size={18} />
            <span>Image</span>
          </button>

          {image && (
            <div className="w-full h-32 rounded-lg overflow-hidden bg-[#020617] border border-white/10">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            onClick={addItem}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>

      {/* ITEMS GRID */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 opacity-70">
          <div className="text-lg font-semibold mb-2">No items yet</div>
          <div className="text-sm">
            Add your first item using the form above.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f172a] border border-white/10 rounded-xl p-4"
            >
              {/* IMAGE */}
              {item.image ? (
                <div className="w-full h-40 rounded-lg mb-3 overflow-hidden bg-[#020617]">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-[#020617] rounded-lg mb-3 flex items-center justify-center text-sm opacity-60">
                  No Image
                </div>
              )}

              {editingId === item.id ? (
                <div className="space-y-3">
                  <input
                    className="w-full px-3 py-2 rounded bg-[#020617] border border-white/10"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded bg-[#020617] border border-white/10"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`edit-image-${item.id}`}
                    onChange={(e) =>
                      e.target.files &&
                      readImage(e.target.files[0], setEditImage)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`edit-image-${item.id}`)?.click()
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#020617] border border-white/10 rounded-lg hover:bg-white/10 transition"
                  >
                    <ImagePlus size={18} />
                    <span>Change Image</span>
                  </button>

                  {editImage && (
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-[#020617] border border-white/10">
                      <img
                        src={editImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 md:col-span-1">
                    <button
                      onClick={() => saveEdit(item.id!)}
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="bg-[#020617] border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* NAME + PRICE */}
                  <div className="mt-2 space-y-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-sm opacity-80">
                      Rp {item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* STOCK CONTROLS */}
                  <div className="mt-4 flex flex-col items-center gap-3">
                    {/* Single +/- */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => changeStock(item.id!, -1)}
                        className="w-9 h-9 flex items-center justify-center bg-[#020617] border border-white/10 rounded-lg hover:bg-white/10"
                      >
                        −
                      </button>

                      <span
                        className={`
                          min-w-[28px] text-center font-semibold transition-all duration-200
                          ${
                            pulse.id === item.id && pulse.type === "up"
                              ? "scale-125 text-green-400"
                              : ""
                          }
                          ${
                            pulse.id === item.id && pulse.type === "down"
                              ? "scale-125 text-red-400"
                              : ""
                          }
                        `}
                      >
                        {item.stock}
                      </span>

                      <button
                        onClick={() => changeStock(item.id!, 1)}
                        className="w-9 h-9 flex items-center justify-center bg-[#020617] border border-white/10 rounded-lg hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>

                    {/* Bulk buttons */}
                    <div className="flex gap-2 text-xs opacity-80">
                      <button
                        onClick={() => changeStock(item.id!, -5)}
                        className="px-2 py-1 rounded bg-[#020617] border border-white/10 hover:bg-white/10"
                      >
                        −5
                      </button>
                      <button
                        onClick={() => changeStock(item.id!, 5)}
                        className="px-2 py-1 rounded bg-[#020617] border border-white/10 hover:bg-white/10"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => changeStock(item.id!, 10)}
                        className="px-2 py-1 rounded bg-[#020617] border border-white/10 hover:bg-white/10"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 bg-blue-600 py-2 rounded-lg text-sm font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item.id!)}
                      className="flex-1 bg-red-600 py-2 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
