import categoriesData from "../data/categories.json";
import productsData from "../data/products.json";
import type { Category, Product } from "../types/catalog";

export const categories = categoriesData as Category[];
export const products = productsData as Product[];

export function validateCatalog(
  productList: Product[] = products,
  categoryList: Category[] = categories,
): string[] {
  const errors: string[] = [];
  const categoryIds = new Set(categoryList.map(({ id }) => id));
  if (categoryIds.size !== categoryList.length) errors.push("Hay identificadores de categoría duplicados.");
  for (const category of categoryList) {
    if (!category.id || !category.name || !category.description || !category.alt || !isValidImagePath(category.image)) {
      errors.push(`Categoría incompleta o con imagen inválida: ${category.id || "sin ID"}`);
    }
  }
  const productIds = new Set<string>();
  const slugs = new Set<string>();

  for (const product of productList) {
    if (!product.id || productIds.has(product.id)) errors.push(`Identificador inválido o duplicado: ${product.id}`);
    if (!product.slug || slugs.has(product.slug)) errors.push(`Slug inválido o duplicado: ${product.slug}`);
    if (!product.sku || !product.name || !product.shortDescription || !product.description || !product.alt ||
      typeof product.featured !== "boolean" || typeof product.available !== "boolean") {
      errors.push(`Faltan campos obligatorios en ${product.id || "producto sin ID"}`);
    }
    if (!Number.isFinite(product.price) || product.price < 0) errors.push(`Precio inválido en ${product.id}`);
    if (product.previousPrice !== undefined && (!Number.isFinite(product.previousPrice) || product.previousPrice < 0)) {
      errors.push(`Precio anterior inválido en ${product.id}`);
    }
    if (product.dimensions !== undefined && typeof product.dimensions !== "string") errors.push(`Dimensiones inválidas en ${product.id}`);
    if (product.materials !== undefined && (!Array.isArray(product.materials) || product.materials.some((value) => typeof value !== "string"))) {
      errors.push(`Materiales inválidos en ${product.id}`);
    }
    if (product.colors !== undefined && (!Array.isArray(product.colors) || product.colors.some((value) => typeof value !== "string"))) {
      errors.push(`Colores inválidos en ${product.id}`);
    }
    if (!categoryIds.has(product.categoryId)) errors.push(`Categoría inexistente en ${product.id}`);
    if (!Array.isArray(product.images) || product.images.length === 0 || product.images.some((image) => !isValidImagePath(image))) {
      errors.push(`Imágenes inválidas en ${product.id}`);
    }
    productIds.add(product.id);
    slugs.add(product.slug);
  }
  return errors;
}

function isValidImagePath(path: unknown): path is string {
  if (typeof path !== "string") return false;
  try {
    const url = new URL(path, "https://local.invalid");
    return url.protocol === "https:" || (url.origin === "https://local.invalid" && url.pathname.startsWith("/"));
  } catch {
    return false;
  }
}

export interface CatalogFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "name-asc";
  featuredOnly?: boolean;
  availableOnly?: boolean;
}

export function filterProducts(list: Product[], filters: CatalogFilters): Product[] {
  const query = filters.query?.trim().toLocaleLowerCase("es-CO");
  return list
    .filter((product) => !query || `${product.name} ${product.shortDescription} ${product.description}`.toLocaleLowerCase("es-CO").includes(query))
    .filter((product) => !filters.categoryId || product.categoryId === filters.categoryId)
    .filter((product) => filters.minPrice === undefined || product.price >= filters.minPrice)
    .filter((product) => filters.maxPrice === undefined || product.price <= filters.maxPrice)
    .filter((product) => !filters.featuredOnly || product.featured)
    .filter((product) => !filters.availableOnly || product.available)
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      if (filters.sort === "name-asc") return a.name.localeCompare(b.name, "es-CO");
      return 0;
    });
}

const catalogErrors = validateCatalog();
if (catalogErrors.length > 0) throw new Error(`Catálogo inválido:\n${catalogErrors.join("\n")}`);
