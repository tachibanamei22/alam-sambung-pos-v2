import Dexie from "dexie";
import type { Table } from "dexie";

export interface Item {
  id?: number;
  name: string;
  price: number;
  stock: number;
  image?: string; // base64
  createdAt: Date;
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
  price: number;    // snapshot
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
