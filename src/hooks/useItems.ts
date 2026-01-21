import { useEffect, useState } from "react";
import { db } from "@/db";
import type { Item } from "@/db";
import { onItemsChanged } from "@/state/appEvents";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await db.items.toArray();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = onItemsChanged(load);
    return unsub;
  }, []);

  return { items, loading, reload: load };
}
