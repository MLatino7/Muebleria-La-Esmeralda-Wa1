import { useCallback, useEffect, useState } from "react";
import type { CartItem, Product } from "../types/catalog";
import { readCart, writeCart, itemCount } from "../lib/cart";

const CART_EVENT = "esmeralda-cart-updated";

function safeRead(products: Product[]) {
  try {
    return readCart(window.localStorage, products);
  } catch {
    return { items: [], warning: "No fue posible acceder al almacenamiento local de este navegador." };
  }
}

function safeWrite(items: CartItem[]) {
  try {
    return writeCart(window.localStorage, items);
  } catch {
    return "No fue posible guardar el carrito en este navegador. Puede continuar, pero no se conservará al recargar.";
  }
}

export function useCart(products: Product[]) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  const sync = useCallback(() => {
    const result = safeRead(products);
    setItems(result.items);
    if (result.warning) setNotice(result.warning);
    setReady(true);
  }, [products]);

  useEffect(() => {
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const commit = useCallback((next: CartItem[]) => {
    setItems(next);
    const warning = safeWrite(next);
    if (warning) setNotice(warning);
    window.dispatchEvent(new Event(CART_EVENT));
  }, []);

  const add = useCallback((product: Product, quantity = 1) => {
    if (!product.available || !Number.isSafeInteger(quantity) || quantity < 1) {
      setNotice("Este producto no está disponible para añadir al carrito.");
      return false;
    }
    const current = safeRead(products).items;
    const existing = current.find((item) => item.productId === product.id);
    const next = existing
      ? current.map((item) => item.productId === product.id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item)
      : [...current, { productId: product.id, quantity: Math.min(99, quantity) }];
    commit(next);
    setNotice(`${product.name} se añadió al carrito.`);
    return true;
  }, [commit, products]);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
      setNotice("La cantidad debe ser un número entero entre 1 y 99.");
      return;
    }
    commit(items.map((item) => item.productId === productId ? { ...item, quantity } : item));
  }, [commit, items]);

  const remove = useCallback((productId: string) => commit(items.filter((item) => item.productId !== productId)), [commit, items]);
  const clear = useCallback(() => {
    if (window.confirm("¿Quieres vaciar el carrito?")) commit([]);
  }, [commit]);

  return { items, ready, notice, setNotice, add, setQuantity, remove, clear, count: itemCount(items) };
}
