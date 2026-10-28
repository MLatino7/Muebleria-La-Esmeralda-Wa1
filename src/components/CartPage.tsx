import { useMemo, useState } from "react";
import { products } from "../lib/catalog";
import { cartTotal, subtotal } from "../lib/cart";
import { formatCOP } from "../lib/currency";
import { createQuoteMessage, createWhatsAppUrl } from "../lib/whatsapp";
import { sitePath } from "../lib/paths";
import { useCart } from "./CartControls";

export default function CartPage() {
  const { items, ready, notice, setNotice, setQuantity, remove, clear } = useCart(products);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");
  const details = useMemo(() => items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);
  const total = cartTotal(items, products);
  const quote = useMemo(() => {
    if (!items.length) return { url: "", error: "" };
    try { return { url: createWhatsAppUrl(createQuoteMessage(items, products, { name, city, comments })), error: "" }; }
    catch (error) { return { url: "", error: error instanceof Error ? error.message : "No fue posible preparar la cotización." }; }
  }, [items, name, city, comments]);
  const quoteUrl = quote.url;

  if (!ready) return <p role="status">Cargando carrito…</p>;
  if (!items.length) return <div className="empty-state cart-empty"><p className="eyebrow">Tu selección</p><h1>Tu carrito está vacío</h1>
    <p>Explora el catálogo y guarda aquí las piezas que quieras cotizar.</p><a className="button button-dark" href={sitePath("/catalogo/")}>Explorar catálogo</a>
    {notice && <p className="notice" role="status">{notice}</p>}</div>;

  return <div className="cart-layout">
    <section className="cart-items"><div className="cart-heading"><h1>Tu carrito</h1><button className="text-button" type="button" onClick={clear}>Vaciar carrito</button></div>
      {details.map(({ item, product }) => <article className="cart-item" key={item.productId}>
        <a href={sitePath(`/producto/${product.slug}/`)}><img src={product.images[0]} alt={product.alt} width="160" height="180" /></a>
            <div className="cart-item-copy"><p className="eyebrow">{product.sku}</p><h2><a href={sitePath(`/producto/${product.slug}/`)}>{product.name}</a></h2>
          <p>Precio unitario: {formatCOP(product.price)}</p><p><strong>Subtotal: {formatCOP(subtotal(product, item.quantity))}</strong></p>
          <label>Cantidad<input type="number" min="1" max="99" step="1" value={item.quantity} onChange={(event) => {
            const value = Number(event.currentTarget.value);
            if (Number.isSafeInteger(value)) setQuantity(product.id, value);
          }} /></label>
          <button type="button" className="text-button" onClick={() => remove(product.id)}>Eliminar</button>
          {!product.available && <p className="availability">Disponibilidad por confirmar al cotizar.</p>}
        </div>
      </article>)}
      {notice && <p className="notice" role="status">{notice}</p>}
    </section>
    <aside className="quote-panel"><h2>Resumen de cotización</h2><p>{items.reduce((sum, item) => sum + item.quantity, 0)} unidades</p>
      <p className="total-row"><span>Total estimado</span><strong>{formatCOP(total)}</strong></p>
      <p className="small-note">No incluye costos de envío. Precio y disponibilidad sujetos a confirmación.</p>
      <form className="quote-form" onSubmit={(event) => event.preventDefault()}>
        <label>Nombre (opcional)<input value={name} onChange={(event) => setName(event.currentTarget.value)} maxLength={100} /></label>
        <label>Ciudad de entrega (opcional)<input value={city} onChange={(event) => setCity(event.currentTarget.value)} maxLength={100} /></label>
        <label>Comentarios (opcional)<textarea value={comments} onChange={(event) => setComments(event.currentTarget.value)} maxLength={500} rows={3} /></label>
      </form>
      <a className={`button button-dark quote-link ${!quoteUrl ? "disabled" : ""}`} href={quoteUrl || undefined} aria-disabled={!quoteUrl} target="_blank" rel="noopener noreferrer"
        onClick={(event) => {
          if (!quoteUrl) { event.preventDefault(); setMessage("Agrega un producto disponible para solicitar una cotización."); }
          else setMessage("El mensaje está preparado en WhatsApp. Debes enviarlo manualmente; la solicitud no se confirma ni se guarda automáticamente.");
        }}>
        Solicitar cotización por WhatsApp
      </a>
      <p className="small-note">Al continuar, WhatsApp se abrirá con el texto preparado. Revísalo y envíalo manualmente; no se confirma ni se reserva el pedido.</p>
      {(message || quote.error) && <p className="notice" role="status">{message || quote.error}</p>}
    </aside>
  </div>;
}
