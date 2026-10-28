import { store } from "../config/store";

const formatter = new Intl.NumberFormat(store.locale, {
  style: "currency",
  currency: store.currency,
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("El precio debe ser un número finito no negativo.");
  }
  return formatter.format(value);
}
