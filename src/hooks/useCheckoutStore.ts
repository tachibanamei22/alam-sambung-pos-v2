import { useState } from "react";
import type { Item } from "@/db";
import { db } from "@/db";
// import type { Sale, SaleItem } from "@/db";
import { emitItemsChanged } from "@/state/appEvents";

export type CartItem = {
  item: Item;
  qty: number;
};

export function useCheckoutStore() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = (item: Item) => {
    // Guard: item must have stock
    if (item.stock <= 0) return;

    setCart((prev) => {
      const found = prev.find((c) => c.item.id === item.id);

      // Guard: do not exceed stock
      if (found) {
        if (found.qty >= item.stock) return prev;
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }

      return [...prev, { item, qty: 1 }];
    });
  };

  const removeItem = (itemId: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);

  const completeSale = async () => {
    if (cart.length === 0) return;

    await db.transaction("rw", db.sales, db.saleItems, db.items, async () => {
      // 1. Create sale
      const saleId = await db.sales.add({
        total,
        createdAt: new Date(),
      });

      // 2. Create sale items
      for (const c of cart) {
        await db.saleItems.add({
          saleId,
          itemId: c.item.id!,
          itemName: c.item.name,
          price: c.item.price,
          qty: c.qty,
        });

        // 3. Update stock
        await db.items.update(c.item.id!, {
          stock: c.item.stock - c.qty,
        });
      }
    });

    // 4. Clear cart ONLY if transaction succeeded
    setCart([]);
    emitItemsChanged();
  };

  return {
    cart,
    addItem,
    removeItem,
    clearCart,
    total,
    completeSale,
  };
}
