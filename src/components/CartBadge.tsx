import { products } from "../lib/catalog";
import { sitePath } from "../lib/paths";
import { useCart } from "./CartControls";

export default function CartBadge() {
  const { count } = useCart(products);
  return <a className="cart-link" href={sitePath("/carrito/")} aria-label={`Carrito, ${count} unidades`}>
    <span>Carrito</span><span className="cart-count" aria-live="polite">{count}</span>
  </a>;
}
