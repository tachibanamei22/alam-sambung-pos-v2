import ProductCard from "./ProductCard";
import type { Item } from "@/db";

type Props = {
  items: Item[];
  loading: boolean;
  onAdd: (item: Item) => void;
};

export default function ProductGrid({ items, loading, onAdd }: Props) {
  if (loading) {
    return <div className="text-white/60">Loading products…</div>;
  }

  if (items.length === 0) {
    return <div className="text-white/60">No products available</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}
