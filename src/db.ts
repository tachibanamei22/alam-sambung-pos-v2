import Dexie from "dexie";
import type { Table } from "dexie";

export interface Item {
  id?: number;
  name: string;
  price: number;
  stock: number;
  image?: string; // base64
  createdAt: Date;
  creator?: string;
}

export interface Sale {
  id?: number;
  total: number;
  createdAt: Date;
}

export interface SaleItem {
  id?: number;
  saleId: number;
  itemId: number;
  itemName: string; // snapshot (IMPORTANT)
  price: number; // snapshot
  qty: number;
}

export class PosDB extends Dexie {
  items!: Table<Item>;
  sales!: Table<Sale>;
  saleItems!: Table<SaleItem>;

  constructor() {
    super("pos-db");
    this.version(1).stores({
      items: "++id, name",
      sales: "++id, createdAt",
      saleItems: "++id, saleId, itemId",
    });
  }
}

export const db = new PosDB();

// =====================
// DB HELPERS
// =====================

export async function getItems() {
  return db.items.toArray();
}

export async function addSale(
  total: number,
  items: {
    itemId: number;
    itemName: string;
    price: number;
    qty: number;
  }[],
) {
  const saleId = await db.sales.add({
    total,
    createdAt: new Date(),
  });

  await db.saleItems.bulkAdd(
    items.map((i) => ({
      saleId,
      itemId: i.itemId,
      itemName: i.itemName,
      price: i.price,
      qty: i.qty,
    })),
  );

  for (const i of items) {
    const item = await db.items.get(i.itemId);
    if (item) {
      await db.items.update(i.itemId, {
        stock: item.stock - i.qty,
      });
    }
  }

  return saleId;
}

export async function getSalesWithItems() {
  const sales = await db.sales.toArray();

  const result = [];
  for (const sale of sales) {
    const items = await db.saleItems.where("saleId").equals(sale.id!).toArray();

    result.push({
      ...sale,
      items,
    });
  }

  return result;
}
