// Reglas de negocio de productos, separadas de la UI para poder
// testearlas y reutilizarlas (cards, formulario, futuros reportes).

export const LOW_STOCK_THRESHOLD = 5;

export function isLowStock(stock: number | null): boolean {
  return stock !== null && stock < LOW_STOCK_THRESHOLD;
}

export function isValidOferta(precio: number, precioOferta: number): boolean {
  return precioOferta > 0 && precioOferta < precio;
}
