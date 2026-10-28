import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "../types/catalog";
import { filterProducts } from "../lib/catalog";
import { formatCOP } from "../lib/currency";
import { sitePath } from "../lib/paths";
import AddToCart from "./AddToCart";

export default function ProductGrid({ products, categories, initialQuery = "", initialCategory = "" }: {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "name-asc" | "">("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("q")) setQuery(params.get("q") ?? "");
    if (params.has("categoria")) setCategoryId(params.get("categoria") ?? "");
  }, []);
  const shown = useMemo(() => filterProducts(products, {
    query, categoryId,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort || undefined, featuredOnly, availableOnly,
  }), [products, query, categoryId, minPrice, maxPrice, sort, featuredOnly, availableOnly]);

  function reset() {
    setQuery(""); setCategoryId(""); setMinPrice(""); setMaxPrice("");
    setSort(""); setFeaturedOnly(false); setAvailableOnly(false);
  }

  return <div className="catalog-layout">
    <form className="filters" onSubmit={(event) => event.preventDefault()}>
      <h2>Filtrar productos</h2>
      <label>Buscar<input type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Nombre o descripción" /></label>
      <label>Categoría<select value={categoryId} onChange={(event) => setCategoryId(event.currentTarget.value)}>
        <option value="">Todas las categorías</option>
        {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
      </select></label>
      <fieldset><legend>Rango de precio (COP)</legend>
        <label>Mínimo<input type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.currentTarget.value)} /></label>
        <label>Máximo<input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.currentTarget.value)} /></label>
      </fieldset>
      <label>Ordenar<select value={sort} onChange={(event) => setSort(event.currentTarget.value as typeof sort)}>
        <option value="">Recomendados</option><option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option><option value="name-asc">Nombre: A–Z</option>
      </select></label>
      <label className="check-label"><input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.currentTarget.checked)} /> Destacados</label>
      <label className="check-label"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.currentTarget.checked)} /> Disponibilidad demostrativa</label>
      <button className="button button-outline" type="button" onClick={reset}>Limpiar filtros</button>
    </form>
    <section aria-live="polite" aria-label="Resultados del catálogo">
      <p className="results-count">{shown.length} {shown.length === 1 ? "producto" : "productos"}</p>
      {shown.length ? <div className="product-grid">
        {shown.map((product) => <article className="product-card" key={product.id}>
          <a className="product-image" href={sitePath(`/producto/${product.slug}/`)}>
            <img src={product.images[0]} alt={product.alt} loading="lazy" width="720" height="880" />
            {product.featured && <span className="product-tag">Destacado</span>}
          </a>
          <div className="product-info">
            <p className="eyebrow">{categories.find((category) => category.id === product.categoryId)?.name}</p>
            <h3><a href={sitePath(`/producto/${product.slug}/`)}>{product.name}</a></h3>
            <p>{product.shortDescription}</p>
            <strong>{formatCOP(product.price)}</strong>
            {!product.available && <span className="availability">Disponibilidad por confirmar</span>}
            <AddToCart product={product} />
          </div>
        </article>)}
      </div> : <div className="empty-state"><h2>No encontramos coincidencias</h2><p>Prueba otros términos o limpia los filtros.</p><button className="button button-dark" onClick={reset}>Ver todos los productos</button></div>}
    </section>
  </div>;
}
