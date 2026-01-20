import { useEffect, useState } from "react";
import { db } from "../db";
import type { SaleItem, Sale } from "../db";

type SaleWithItems = {
  sale: Sale;
  items: SaleItem[];
};

export default function Recap() {
  const [sales, setSales] = useState<SaleWithItems[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadRecap();
  }, []);

  const loadRecap = async () => {
    const saleList = await db.sales.orderBy("createdAt").reverse().toArray();

    const recap: SaleWithItems[] = [];

    for (const sale of saleList) {
      const items = await db.saleItems
        .where("saleId")
        .equals(sale.id!)
        .toArray();

      recap.push({ sale, items });
    }

    setSales(recap);

    setTotal(saleList.reduce((sum, s) => sum + s.total, 0));
  };

  const resetEvent = async () => {
    const ok = confirm(
      "Reset event?\n\nAll sales history will be permanently deleted.\nItems will remain.",
    );
    if (!ok) return;

    await db.sales.clear();
    loadRecap(); // re-fetch recap data
  };

  const exportCSV = () => {
    const rows = [["Date", "Item", "Qty", "Price", "Total"]];

    sales.forEach(({ sale, items }) => {
      items.forEach((i) => {
        rows.push([
          sale.createdAt.toISOString(),
          i.itemName,
          String(i.qty),
          String(i.price),
          String(i.price * i.qty),
        ]);
      });
    });

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-recap.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Recap</h2>

      <h3>Total Sales: Rp {total}</h3>
      <p>Transactions: {sales.length}</p>

      <button
        onClick={exportCSV}
        style={{
          marginBottom: 16,
          marginRight: 16,
          padding: "10px 16px",
          borderRadius: 8,
          background: "#41db86ff",
          border: "1px solid #41db86ff",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Export CSV
      </button>

      <button
        onClick={resetEvent}
        style={{
          marginBottom: 16,
          padding: "10px 16px",
          borderRadius: 8,
          background: "#7f1d1d",
          border: "1px solid #7f1d1d",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Reset Recap
      </button>

      {sales.map(({ sale, items }) => (
        <div
          key={sale.id}
          style={{
            border: "1px solid #374151",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <strong>Rp {sale.total}</strong>
          <br />
          <small>{sale.createdAt.toLocaleString()}</small>

          <ul style={{ marginTop: 8 }}>
            {items.map((i, idx) => (
              <li key={idx}>
                {i.itemName} × {i.qty} — Rp {i.price * i.qty}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
