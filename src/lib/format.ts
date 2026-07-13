import type { CategoriaProducto } from '../types';

const currencyFormatter = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'UYU',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

// 'YYYY-MM-DD' -> 'DD/MM' para ejes de graficos
export function formatShortDate(day: string): string {
  return `${day.slice(8, 10)}/${day.slice(5, 7)}`;
}

export const CATEGORIA_LABELS: Record<CategoriaProducto, string> = {
  juegos: 'Juegos',
  accesorios: 'Accesorios',
  consolas: 'Consolas',
  digital: 'Digital',
};
