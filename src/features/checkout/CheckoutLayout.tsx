import { useState } from "react";
import { useCheckoutStore } from "@/hooks/useCheckoutStore";
import { useItems } from "@/hooks/useItems";
import CreatorTabs from "./CreatorTabs";
import ProductGrid from "./ProductGrid";
import CartPanel from "./CartPanel";
// import { db } from "@/db";
import { useEffect } from "react";

export default function CheckoutLayout() {
  const { cart, addItem, removeItem, total, completeSale } = useCheckoutStore();
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const [cartPulse, setCartPulse] = useState(false);

  const { items, loading } = useItems();
  const [activeCreator, setActiveCreator] = useState("All");
  const [showCart, setShowCart] = useState(false);

  const creators = Array.from(
    new Set(items.map((i) => i.creator).filter(Boolean)),
  ) as string[];

  const filteredItems =
    activeCreator === "All"
      ? items
      : items.filter((i) => i.creator === activeCreator);

  useEffect(() => {
    if (cartCount > 0) {
      setCartPulse(true);
      const t = setTimeout(() => setCartPulse(false), 300);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  return (
    <div className="h-full flex flex-col bg-[#020617] text-white">
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
        <div className="font-semibold">Checkout</div>

        <button
          onClick={() => setShowCart(true)}
          className="relative bg-blue-600 px-4 py-2 rounded-lg font-medium"
        >
          Cart
          {cartCount > 0 && (
            <span
              className={`
        absolute -top-2 -right-2 min-w-[22px] h-[22px]
        flex items-center justify-center text-xs font-bold
        bg-red-600 text-white rounded-full
        transition-transform
        ${cartPulse ? "scale-125" : "scale-100"}
      `}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <CreatorTabs
            creators={creators}
            active={activeCreator}
            onChange={setActiveCreator}
          />

          <ProductGrid
            items={filteredItems}
            loading={loading}
            onAdd={addItem}
          />
        </div>

        {/* Desktop Cart */}
        <div className="hidden lg:block w-[360px] border-l border-white/10">
          <CartPanel
            cart={cart}
            onRemove={removeItem}
            onCheckout={completeSale}
            total={total}
          />
        </div>
        {showCart && (
          <div className="fixed inset-0 bg-black/60 z-50 flex">
            <div className="ml-auto w-[90%] max-w-sm bg-[#020617] h-full flex flex-col">
              <div className="p-4 flex justify-between border-b border-white/10">
                <div className="font-semibold">Cart</div>
                <button onClick={() => setShowCart(false)}>✕</button>
              </div>

              <CartPanel
                cart={cart}
                onRemove={removeItem}
                onCheckout={completeSale}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
