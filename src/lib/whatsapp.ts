import { store } from "../config/store";
import { formatCOP } from "./currency";
import { subtotal } from "./cart";
import type { CartItem, Product } from "../types/catalog";

export interface CustomerDetails {
  name?: string;
  city?: string;
  comments?: string;
}

export function createQuoteMessage(items: CartItem[], products: Product[], customer: CustomerDetails = {}, requestId = createRequestId()): string {
  if (items.length === 0) throw new Error("Agrega al menos un producto al carrito antes de solicitar una cotización.");
  const byId = new Map(products.map((product) => [product.id, product]));
  const lines = [
    `Hola, quisiera solicitar una cotización a ${store.name}.`,
    `Referencia local: ${requestId}.`,
    "",
    "Productos seleccionados:",
  ];
  items.forEach((item, index) => {
    const product = byId.get(item.productId);
    if (!product || !product.available) throw new Error(`El producto ${item.productId} no está disponible para cotizar.`);
    lines.push(
      `${index + 1}. ${product.name}.`,
      `Referencia: ${product.sku}.`,
      `Cantidad: ${item.quantity}.`,
      `Precio unitario: ${formatCOP(product.price)} COP.`,
      `Subtotal: ${formatCOP(subtotal(product, item.quantity))} COP.`,
    );
  });
  const total = items.reduce((sum, item) => {
    const product = byId.get(item.productId);
    if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
    return sum + subtotal(product, item.quantity);
  }, 0);
  lines.push(`Total estimado de productos: ${formatCOP(total)} COP.`);
  if (customer.name?.trim()) lines.push(`Nombre: ${customer.name.trim()}.`);
  if (customer.city?.trim()) lines.push(`Ciudad de entrega: ${customer.city.trim()}.`);
  if (customer.comments?.trim()) lines.push(`Comentarios: ${customer.comments.trim()}`);
  lines.push("", "¿Podrían confirmar disponibilidad, costo de envío y tiempo de entrega?");
  return lines.join("\n");
}

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function createRequestId(): string {
  const date = new Date();
  const stamp = date.toISOString().replace(/\D/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LE-${stamp}-${random}`;
}
