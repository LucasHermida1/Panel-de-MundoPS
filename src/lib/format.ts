import type { CategoriaProducto, EstadoPedido } from '../types';

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

// 'YYYY-MM-DDTHH:mm...' -> 'DD/MM/YYYY HH:mm'
export function formatDateTime(fechaIso: string): string {
  const day = fechaIso.slice(0, 10);
  const time = fechaIso.slice(11, 16);
  return `${day.slice(8, 10)}/${day.slice(5, 7)}/${day.slice(0, 4)} ${time}`;
}

export const CATEGORIA_LABELS: Record<CategoriaProducto, string> = {
  juegos: 'Juegos',
  accesorios: 'Accesorios',
  consolas: 'Consolas',
  digital: 'Digital',
};

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

// Colores de Mantine para el Badge de cada estado
export const ESTADO_COLORS: Record<EstadoPedido, string> = {
  pendiente: 'yellow',
  confirmado: 'blue',
  entregado: 'teal',
  cancelado: 'red',
};
