import { useEffect, useState } from "react";
import { db } from "../db";
import type { Item } from "../db";

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);

  // add form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | undefined>();

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState<string | undefined>();

  const btnBase: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
  };

  const btnIcon: React.CSSProperties = {
    ...btnBase,
    width: 32,
    height: 32,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: "#2563eb",
    borderColor: "#2563eb",
  };

  const btnDanger: React.CSSProperties = {
    ...btnBase,
    background: "#7f1d1d",
    borderColor: "#7f1d1d",
  };

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setItems(await db.items.toArray());
  };

  /* image helper */
  const readImage = (file: File, cb: (img: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* add item */
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

  /* stock update */
  const changeStock = async (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.stock + delta < 0) return;

    await db.items.update(id, { stock: item.stock + delta });
    refresh();
  };

  /* edit */
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
    <div style={{ padding: 16 }}>
      <h2>Items</h2>

      {/* ADD FORM */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && readImage(e.target.files[0], setImage)
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={addItem}>Add</button>
      </div>

      {/* ITEM CARDS */}
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: 16,
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            background: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          {/* IMAGE */}
          <div>
            {item.image ? (
              <img
                src={item.image}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  background: "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "#9ca3af",
                }}
              >
                No Image
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div style={{ flex: 1 }}>
            {editingId === item.id ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* IMAGE + UPLOAD */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {editImage ? (
                    <img
                      src={editImage}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 8,
                        background: "#1f2937",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      readImage(e.target.files[0], setEditImage)
                    }
                  />
                </div>

                {/* NAME */}
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Item name"
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #334155",
                    background: "#020617",
                    color: "white",
                  }}
                />

                {/* PRICE */}
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Price"
                  style={{
                    maxWidth: 180,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #334155",
                    background: "#020617",
                    color: "white",
                  }}
                />

                {/* ACTIONS */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={btnPrimary} onClick={() => saveEdit(item.id!)}>
                    Save
                  </button>

                  <button style={btnBase} onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <strong>{item.name}</strong>
                <div>Rp {item.price}</div>
                <div>Stock: {item.stock}</div>

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {/* STOCK CONTROLS */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 12, opacity: 0.7, minWidth: 50 }}>
                      Stock
                    </span>

                    <button
                      style={btnIcon}
                      onClick={() => changeStock(item.id!, -1)}
                    >
                      −
                    </button>

                    <strong style={{ minWidth: 24, textAlign: "center" }}>
                      {item.stock}
                    </strong>

                    <button
                      style={btnIcon}
                      onClick={() => changeStock(item.id!, 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnPrimary} onClick={() => startEdit(item)}>
                      Edit
                    </button>

                    <button
                      style={btnDanger}
                      onClick={() => deleteItem(item.id!)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
