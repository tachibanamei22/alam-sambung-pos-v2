import { useState } from "react";
import type { CartItem } from "@/hooks/useCheckoutStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { successToast } from "@/lib/toast";

type Props = {
  cart: CartItem[];
  onRemove: (id: number) => void;
  onCheckout: () => void;
  total: number;
  hideFooter?: boolean;
};

export default function CartPanel({
  cart,
  onRemove,
  onCheckout,
  total,
  hideFooter,
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="font-semibold mb-4">Cart</h2>

      {/* Cart items */}
      <div className="flex-1 space-y-3 overflow-auto">
        {cart.length === 0 && (
          <div className="opacity-50 text-sm">No items yet</div>
        )}

        {cart.map((c) => (
          <div key={c.item.id} className="flex items-center gap-3">
            <img
              src={c.item.image}
              className="w-10 h-10 rounded object-cover"
            />

            <div className="flex-1">
              <div>{c.item.name}</div>
              <div className="text-xs opacity-70">Rp {c.item.price}</div>
            </div>

            <button
              onClick={() => onRemove(c.item.id!)}
              className="px-2 text-lg"
            >
              −
            </button>

            <span>{c.qty}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!hideFooter && (
        <div className="pt-4 border-t border-white/10">
          <div className="mb-3">Total: Rp {total}</div>
          {success && (
            <div className="mb-3 p-3 rounded-lg bg-green-700/20 text-green-300 text-center text-sm">
              ✅ Sale completed successfully
            </div>
          )}

          <button
            disabled={cart.length === 0}
            onClick={() => setOpen(true)}
            className="w-full py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700"
          >
            Complete Sale
          </button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-[#020617] text-white border border-white/10">
              <DialogHeader>
                <DialogTitle>Confirm Sale</DialogTitle>
              </DialogHeader>

              <div className="py-4 text-sm">
                Complete this sale?
                <div className="mt-2 font-semibold">Total: Rp {total}</div>
              </div>

              {success && (
                <div className="mb-2 p-2 rounded bg-green-700/20 text-green-300 text-center text-sm">
                  ✅ Sale completed
                </div>
              )}

              <DialogFooter className="flex gap-2">
                <button
                  disabled={processing}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  disabled={processing}
                  onClick={async () => {
                    try {
                      setProcessing(true);
                      await onCheckout();
                      successToast("Sale completed");
                      setSuccess(true);
                      setTimeout(() => {
                        setSuccess(false);
                        setOpen(false);
                      }, 1200);
                    } finally {
                      setProcessing(false);
                    }
                  }}
                  className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700"
                >
                  {processing ? "Processing..." : "Confirm"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
