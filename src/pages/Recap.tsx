import { useEffect, useState } from "react";
import { db } from "@/db";
import { getSalesWithItems } from "@/db";
import type { SaleItem } from "@/db";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Recap() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await getSalesWithItems();
    setSales(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  function exportCsv() {
    const rows = sales.flatMap((sale) =>
      sale.items.map(
        (i: SaleItem) =>
          `${sale.createdAt},${i.itemName},${i.qty},${i.price},${i.qty * i.price}`,
      ),
    );

    const csv = ["date,item,qty,price,total", ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sales.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function resetHistory() {
    const ok = confirm("Reset ALL sales history?");
    if (!ok) return;

    await db.sales.clear();
    await db.saleItems.clear();
    await load();
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#020617] text-white">
        Loading…
      </div>
    );
  }

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="h-full bg-[#020617] text-white overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Recap</h1>
          <div className="text-sm opacity-70">
            {sales.length} transactions · Rp {totalSales}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={exportCsv}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Export CSV
          </Button>

          <Button
            onClick={resetHistory}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {sales.map((sale) => (
          <Card
            key={sale.id}
            className="bg-slate-900/70 border border-white/20"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {new Date(sale.createdAt).toLocaleString()}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {sale.items.map((i: SaleItem) => (
                <div
                  key={i.id}
                  className="flex justify-between text-sm text-white"
                >
                  <span>
                    {i.itemName} × {i.qty}
                  </span>
                  <span>Rp {i.qty * i.price}</span>
                </div>
              ))}

              <div className="pt-2 mt-2 border-t border-white/10 flex justify-between font-semibold text-white">
                <span>Total</span>
                <span>Rp {sale.total}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
