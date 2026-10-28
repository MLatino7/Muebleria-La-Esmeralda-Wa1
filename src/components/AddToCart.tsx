import { useState } from "react";
import type { Product } from "../types/catalog";
import { products } from "../lib/catalog";
import { useCart } from "./CartControls";

export default function AddToCart({ product, showQuantity = false }: { product: Product; showQuantity?: boolean }) {
  const { add, notice, setNotice } = useCart(products);
  const [quantity, setQuantity] = useState(1);
  return <div className="add-control">
    {showQuantity && <label className="quantity-label">Cantidad
      <input type="number" min="1" max="99" step="1" value={quantity} onChange={(event) => {
        const value = Number(event.currentTarget.value);
        setQuantity(Number.isSafeInteger(value) ? Math.min(99, Math.max(1, value)) : 1);
      }} />
    </label>}
    <button className="button button-dark" type="button" disabled={!product.available} onClick={() => add(product, quantity)}>
      {product.available ? "Añadir al carrito" : "No disponible"}
    </button>
    <p className="sr-only" aria-live="polite">{notice}</p>
    {notice && <button className="notice-dismiss" type="button" aria-label="Cerrar aviso" onClick={() => setNotice("")}>×</button>}
  </div>;
}
