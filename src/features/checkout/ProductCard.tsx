import type { Item } from "@/db";

type Props = {
  item: Item;
  onAdd: (item: Item) => void;
};

export default function ProductCard({ item, onAdd }: Props) {
  return (
    <div className="rounded-xl bg-white/5 p-3 space-y-2">
      <img src={item.image} className="w-full h-40 object-cover rounded-lg" />

      <div>
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm opacity-70">Rp {item.price}</div>
      </div>
      <button
        disabled={item.stock === 0}
        onClick={() => onAdd(item)}
        className={`w-full py-2 rounded-lg ${
          item.stock === 0
            ? "bg-slate-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {item.stock === 0 ? "Out of Stock" : "Add"}
      </button>

      <div className="text-xs opacity-60 mt-1">Stock: {item.stock}</div>
    </div>
  );
}
