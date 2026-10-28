import { describe, expect, it } from "vitest";
import { store } from "../config/store";
import { products } from "./catalog";
import { createQuoteMessage, createWhatsAppUrl } from "./whatsapp";

describe("cotización por WhatsApp", () => {
  it("construye un resumen dinámico con datos opcionales y totales", () => {
    const message = createQuoteMessage([
      { productId: "sofa-nogal", quantity: 2 },
      { productId: "jarron-arcilla", quantity: 1 },
    ], products, { name: "Ana Pérez", city: "Bogotá", comments: "Entregar en portería" }, "LE-TEST");
    expect(message).toContain("Referencia local: LE-TEST");
    expect(message).toContain("Sofá Nogal");
    expect(message).toContain("DEMO-SAL-001");
    expect(message).toContain("Cantidad: 2");
    expect(message).toContain("Total estimado de productos: $ 6.725.000 COP.");
    expect(message).toContain("Ciudad de entrega: Bogotá.");
    expect(message).toContain("Comentarios: Entregar en portería");
  });

  it("codifica caracteres especiales y usa exclusivamente el número configurado", () => {
    const url = createWhatsAppUrl("Cotización: mesa & sofá");
    expect(url.startsWith(`https://wa.me/${store.whatsappNumber}?text=`)).toBe(true);
    expect(url).toContain(encodeURIComponent("Cotización: mesa & sofá"));
    expect(store.whatsappNumber).toBe("573144255649");
  });

  it("no permite crear una solicitud sin productos", () => {
    expect(() => createQuoteMessage([], products, {}, "LE-TEST")).toThrow("carrito");
  });
});
