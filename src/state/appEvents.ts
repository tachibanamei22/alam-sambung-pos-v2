let listeners: (() => void)[] = [];

export function emitItemsChanged() {
  listeners.forEach((fn) => fn());
}

export function onItemsChanged(fn: () => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
