import { describe, expect, it } from "vitest";
import { cartTotal, itemCount, readCart, subtotal, writeCart } from "./cart";
import { products } from "./catalog";
import type { CartItem } from "../types/catalog";

function memoryStorage(initial?: string): Storage {
  let value = initial ?? null;
  return {
    get length() { return value === null ? 0 : 1; },
    clear() { value = null; },
    getItem() { return value; },
    key() { return value === null ? null : "la-esmeralda-cart-v1"; },
    removeItem() { value = null; },
    setItem(_key, next) { value = next; },
  };
}

describe("carrito", () => {
  it("cuenta unidades y calcula subtotales y total de varios productos", () => {
    const items: CartItem[] = [{ productId: "sofa-nogal", quantity: 2 }, { productId: "jarron-arcilla", quantity: 1 }];
    expect(itemCount(items)).toBe(3);
    expect(subtotal(products[0], 2)).toBe(6580000);
    expect(cartTotal(items, products)).toBe(6725000);
  });

  it("persiste y restaura el formato versionado", () => {
    const storage = memoryStorage();
    const items = [{ productId: "sofa-nogal", quantity: 2 }];
    expect(writeCart(storage, items)).toBeUndefined();
    expect(readCart(storage, products)).toEqual({ items });
  });

  it("informa JSON dañado y filtra cantidades o productos inválidos/no disponibles", () => {
    expect(readCart(memoryStorage("{no-json"), products).warning).toContain("dañado");
    const storage = memoryStorage(JSON.stringify({ version: 1, items: [
      { productId: "sofa-nogal", quantity: 1 },
      { productId: "sofa-cala", quantity: 1 },
      { productId: "inventado", quantity: 3 },
      { productId: "mesa-centro-arena", quantity: -2 },
    ] }));
    const result = readCart(storage, products);
    expect(result.items).toEqual([{ productId: "sofa-nogal", quantity: 1 }]);
    expect(result.warning).toContain("catálogo cambió");
  });

  it("rechaza cantidades no enteras o menores de uno", () => {
    expect(() => subtotal(products[0], 0)).toThrow(RangeError);
    expect(() => subtotal(products[0], 1.5)).toThrow(RangeError);
  });
});
