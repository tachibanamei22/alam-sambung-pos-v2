import { Button } from "@/components/ui/button";

type CartItemRowProps = {
  name: string;
  price: number;
  image: string;
  qty: number;
  onAdd?: () => void;
  onRemove?: () => void;
};

export default function CartItemRow({
  name,
  price,
  image,
  qty,
  onAdd,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-md object-cover"
      />

      <div className="flex-1">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-slate-400">Rp {price}</div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="icon" onClick={onRemove}>
          −
        </Button>
        <span className="w-6 text-center text-sm">{qty}</span>
        <Button size="icon" onClick={onAdd}>
          +
        </Button>
      </div>
    </div>
  );
}
