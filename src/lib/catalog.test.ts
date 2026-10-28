import { describe, expect, it } from "vitest";
import { categories, filterProducts, products, validateCatalog } from "./catalog";

describe("catálogo", () => {
  it("contiene cuatro productos demostrativos en cada categoría", () => {
    expect(categories).toHaveLength(6);
    for (const category of categories) {
      expect(products.filter((product) => product.categoryId === category.id)).toHaveLength(4);
    }
  });

  it("valida identificadores, precios, categorías e imágenes del catálogo", () => {
    expect(validateCatalog()).toEqual([]);
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
    expect(products.every((product) => product.price >= 0 && product.images.length > 0)).toBe(true);
  });

  it("filtra por texto, categoría, precio, destacados y disponibilidad", () => {
    expect(filterProducts(products, { query: "sofá" }).map((product) => product.id)).toContain("sofa-nogal");
    expect(filterProducts(products, { categoryId: "comedores" })).toHaveLength(4);
    expect(filterProducts(products, { minPrice: 100000, maxPrice: 200000 })).toHaveLength(1);
    expect(filterProducts(products, { featuredOnly: true }).every((product) => product.featured)).toBe(true);
    expect(filterProducts(products, { availableOnly: true }).every((product) => product.available)).toBe(true);
  });

  it("ordena por precio ascendente, descendente y nombre", () => {
    const asc = filterProducts(products, { sort: "price-asc" });
    const desc = filterProducts(products, { sort: "price-desc" });
    const alphabetic = filterProducts(products, { sort: "name-asc" });
    expect(asc[0].price).toBeLessThanOrEqual(asc.at(-1)!.price);
    expect(desc[0].price).toBeGreaterThanOrEqual(desc.at(-1)!.price);
    expect(alphabetic[0].name.localeCompare(alphabetic[1].name, "es-CO")).toBeLessThanOrEqual(0);
  });
});
