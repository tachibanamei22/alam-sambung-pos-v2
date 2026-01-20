import { useEffect, useState } from "react";
import { db } from "../db";
import type { Item } from "../db";

type CartItem = {
  item: Item;
  qty: number;
};

export default function Checkout() {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await db.items.toArray();
    setItems(data);
  };

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        if (existing.qty >= item.stock) return prev;
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      if (item.stock <= 0) return prev;
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (itemId: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.item.id === itemId ? { ...c, qty } : c
      )
    );
  };

  const total = cart.reduce(
    (sum, c) => sum + c.item.price * c.qty,
    0
  );

  const completeSale = async () => {
    if (cart.length === 0) return;

    // Final stock validation
    for (const c of cart) {
      const latest = await db.items.get(c.item.id!);
      if (!latest || c.qty > latest.stock) {
        alert(`Not enough stock for ${c.item.name}`);
        return;
      }
    }

    const saleId = await db.sales.add({
      total,
      createdAt: new Date(),
    });

    for (const c of cart) {
      await db.saleItems.add({
        saleId,
        itemId: c.item.id!,
        itemName: c.item.name, // snapshot
        price: c.item.price,
        qty: c.qty,
      });

      await db.items.update(c.item.id!, {
        stock: c.item.stock - c.qty,
      });
    }

    setCart([]);
    loadItems();
    alert("Sale completed");
  };

  return (
    <div>
      <h2>Checkout</h2>

      {/* Item Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            disabled={item.stock <= 0}
            onClick={() => addToCart(item)}
            style={{
              padding: 16,
              background: item.stock <= 0 ? "#374151" : "#1f2933",
              color: "white",
              border: "none",
            }}
          >
            {item.name}
            <br />
            Rp {item.price}
            <br />
            Stock: {item.stock}
          </button>
        ))}
      </div>

      <h3>Cart</h3>

      {cart.map((c) => (
        <div
          key={c.item.id}
          style={{
            border: "1px solid #374151",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <strong>{c.item.name}</strong>
          <div>Rp {c.item.price} × {c.qty}</div>

          <div
  style={{
    display: "grid",
    gridTemplateColumns: "48px 1fr 48px",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    maxWidth: 200,
  }}
>
  <button
    onClick={() => updateQty(c.item.id!, c.qty - 1)}
    style={{
      height: 48,
      borderRadius: 12,
      background: "#374151",
      color: "white",
      border: "none",
      fontSize: 22,
      fontWeight: "bold",
    }}
  >
    −
  </button>

  <div
    style={{
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
    }}
  >
    {c.qty}
  </div>

  <button
    onClick={() => {
      if (c.qty < c.item.stock) {
        updateQty(c.item.id!, c.qty + 1);
      }
    }}
    style={{
      height: 48,
      borderRadius: 12,
      background: "#2563eb",
      color: "white",
      border: "none",
      fontSize: 22,
      fontWeight: "bold",
    }}
  >
    +
  </button>
</div>

        </div>
      ))}

      <button
        onClick={completeSale}
        style={{
          width: "100%",
          padding: 20,
          fontSize: 22,
          background: "#16a34a",
          color: "white",
          border: "none",
        }}
      >
        Complete Sale — Rp {total}
      </button>
    </div>
  );
}
