import { useState } from "react";
import type { Product } from "../types/catalog";
import { store } from "../config/store";
import { formatCOP } from "../lib/currency";
import { createWhatsAppUrl } from "../lib/whatsapp";
import AddToCart from "./AddToCart";

export default function ProductDetail({ product }: { product: Product }) {
  const [image, setImage] = useState(product.images[0]);
  const message = `Hola, quisiera consultar el producto ${product.name} (referencia ${product.sku}) de ${store.name}. ¿Podrían confirmar disponibilidad, precio y detalles?`;
  return <div className="product-detail">
    <div className="detail-gallery">
      <img className="detail-main-image" src={image} alt={product.alt} width="1000" height="1100" />
      {product.images.length > 1 && <div className="gallery-thumbs">{product.images.map((src) =>
        <button type="button" key={src} onClick={() => setImage(src)} aria-label="Ver otra imagen">
          <img src={src} alt="" width="100" height="100" />
        </button>)}</div>}
    </div>
    <div className="detail-copy">
      <p className="eyebrow">{product.sku}</p><h1>{product.name}</h1>
      <p className="detail-price">{formatCOP(product.price)}</p>
      {product.previousPrice !== undefined && <p className="previous-price">Precio ilustrativo anterior: {formatCOP(product.previousPrice)}</p>}
      <p>{product.description}</p>
      <p className="demo-note">Precio y disponibilidad de demostración: solicita confirmación antes de comprar.</p>
      {product.materials && <p><strong>Materiales de referencia:</strong> {product.materials.join(", ")}</p>}
      {product.dimensions && <p><strong>Dimensiones de referencia:</strong> {product.dimensions}</p>}
      {product.colors && <p><strong>Colores o acabados:</strong> {product.colors.join(", ")}</p>}
      <AddToCart product={product} showQuantity />
      <a className="button button-outline whatsapp-button" href={createWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer">
        Consultar este producto por WhatsApp
      </a>
      <p className="small-note">WhatsApp abrirá un mensaje preparado; debes enviarlo manualmente. Esto no confirma una compra ni disponibilidad.</p>
    </div>
  </div>;
}
