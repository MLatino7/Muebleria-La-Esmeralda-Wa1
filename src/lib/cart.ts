import type { CartItem, Product } from "../types/catalog";

const STORAGE_KEY = "la-esmeralda-cart-v1";

export interface CartReadResult {
  items: CartItem[];
  warning?: string;
}

export function readCart(storage: Storage, productList: Product[]): CartReadResult {
  let serialized: string | null;
  try {
    serialized = storage.getItem(STORAGE_KEY);
  } catch {
    return { items: [], warning: "No fue posible acceder al almacenamiento local de este navegador." };
  }
  if (!serialized) return { items: [] };

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object" || !("version" in parsed) || !("items" in parsed) ||
      parsed.version !== 1 || !Array.isArray(parsed.items)) {
      return { items: [], warning: "El carrito guardado tenía un formato inválido y no pudo restaurarse." };
    }
    const validProducts = new Map(productList.filter((product) => product.available && Number.isFinite(product.price) && product.price >= 0).map((product) => [product.id, product]));
    const items: CartItem[] = [];
    let changed = false;
    for (const item of parsed.items) {
      if (!item || typeof item !== "object" || !("productId" in item) || !("quantity" in item) ||
        typeof item.productId !== "string" || typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 ||
        !validProducts.has(item.productId)) {
        changed = true;
        continue;
      }
      const current = items.find((entry) => entry.productId === item.productId);
      if (current) {
        current.quantity = Math.min(99, current.quantity + item.quantity);
        changed = true;
      } else {
        items.push({ productId: item.productId, quantity: Math.min(99, item.quantity) });
      }
    }
    return {
      items,
      ...(changed ? { warning: "El catálogo cambió; se revisó el carrito y se retiraron productos no disponibles o datos inválidos." } : {}),
    };
  } catch {
    return { items: [], warning: "El carrito guardado estaba dañado y se inició uno nuevo." };
  }
}

export function writeCart(storage: Storage, items: CartItem[]): string | undefined {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items }));
    return undefined;
  } catch {
    return "No fue posible guardar el carrito en este navegador. Puede continuar, pero no se conservará al recargar.";
  }
}

export function itemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function subtotal(product: Product, quantity: number): number {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isFinite(product.price) || product.price < 0) {
    throw new RangeError("Cantidad o precio inválido.");
  }
  const result = product.price * quantity;
  if (!Number.isFinite(result) || !Number.isSafeInteger(result)) throw new RangeError("El subtotal excede un valor seguro.");
  return result;
}

export function cartTotal(items: CartItem[], productList: Product[]): number {
  const byId = new Map(productList.map((product) => [product.id, product]));
  const total = items.reduce((sum, item) => {
    const product = byId.get(item.productId);
    if (!product) throw new Error(`Producto del carrito no encontrado: ${item.productId}`);
    return sum + subtotal(product, item.quantity);
  }, 0);
  if (!Number.isFinite(total) || !Number.isSafeInteger(total)) throw new RangeError("El total excede un valor seguro.");
  return total;
}
