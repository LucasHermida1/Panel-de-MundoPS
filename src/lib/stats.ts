import type { CategoriaProducto, Pedido, Producto } from '../types';

// Todas las funciones de este modulo son puras: reciben datos y devuelven
// resultados sin tocar estado global ni depender de la fecha real del sistema.
// La fecha de referencia siempre entra por parametro, en formato 'YYYY-MM-DD'.

export function orderTotal(pedido: Pedido): number {
  return pedido.items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);
}

export function isCountableSale(pedido: Pedido): boolean {
  return pedido.estado !== 'cancelado';
}

// Los mock data son fijos, asi que "hoy" se deriva del pedido mas reciente
// en lugar de usar new Date(): los KPIs no quedan vacios si el proyecto
// se corre meses despues de generados los datos.
export function getLatestOrderDate(pedidos: Pedido[]): string {
  return pedidos.reduce((max, p) => {
    const day = p.fecha.slice(0, 10);
    return day > max ? day : max;
  }, '');
}

function isSameMonth(fechaIso: string, referenceDay: string): boolean {
  return fechaIso.slice(0, 7) === referenceDay.slice(0, 7);
}

export function monthlySalesTotal(pedidos: Pedido[], referenceDay: string): number {
  return pedidos
    .filter((p) => isCountableSale(p) && isSameMonth(p.fecha, referenceDay))
    .reduce((sum, p) => sum + orderTotal(p), 0);
}

export function monthlyOrderCount(pedidos: Pedido[], referenceDay: string): number {
  return pedidos.filter((p) => isCountableSale(p) && isSameMonth(p.fecha, referenceDay)).length;
}

export function averageTicket(pedidos: Pedido[], referenceDay: string): number {
  const count = monthlyOrderCount(pedidos, referenceDay);
  if (count === 0) {
    return 0;
  }
  return monthlySalesTotal(pedidos, referenceDay) / count;
}

export interface TopProduct {
  producto: Producto;
  unidades: number;
}

export function topSellingProduct(pedidos: Pedido[], productos: Producto[]): TopProduct | null {
  const unitsByProduct = new Map<string, number>();
  for (const pedido of pedidos) {
    if (!isCountableSale(pedido)) {
      continue;
    }
    for (const item of pedido.items) {
      unitsByProduct.set(
        item.productoId,
        (unitsByProduct.get(item.productoId) ?? 0) + item.cantidad,
      );
    }
  }

  let best: TopProduct | null = null;
  for (const producto of productos) {
    const unidades = unitsByProduct.get(producto.id) ?? 0;
    if (unidades > 0 && (best === null || unidades > best.unidades)) {
      best = { producto, unidades };
    }
  }
  return best;
}

export interface DailySales {
  fecha: string; // 'YYYY-MM-DD'
  total: number;
}

export function salesByDay(pedidos: Pedido[], days: number, referenceDay: string): DailySales[] {
  const totals = new Map<string, number>();
  for (const pedido of pedidos) {
    if (!isCountableSale(pedido)) {
      continue;
    }
    const day = pedido.fecha.slice(0, 10);
    totals.set(day, (totals.get(day) ?? 0) + orderTotal(pedido));
  }

  const [year, month, dayOfMonth] = referenceDay.split('-').map(Number);
  const reference = Date.UTC(year, month - 1, dayOfMonth);

  const result: DailySales[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const fecha = new Date(reference - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    result.push({ fecha, total: totals.get(fecha) ?? 0 });
  }
  return result;
}

export interface CategorySales {
  categoria: CategoriaProducto;
  total: number;
}

export function salesByCategory(pedidos: Pedido[], productos: Producto[]): CategorySales[] {
  const categoryByProduct = new Map(productos.map((p) => [p.id, p.categoria]));
  const totals = new Map<CategoriaProducto, number>();

  for (const pedido of pedidos) {
    if (!isCountableSale(pedido)) {
      continue;
    }
    for (const item of pedido.items) {
      const categoria = categoryByProduct.get(item.productoId);
      if (categoria === undefined) {
        continue;
      }
      totals.set(categoria, (totals.get(categoria) ?? 0) + item.cantidad * item.precioUnitario);
    }
  }

  const categorias: CategoriaProducto[] = ['juegos', 'accesorios', 'consolas', 'digital'];
  return categorias.map((categoria) => ({ categoria, total: totals.get(categoria) ?? 0 }));
}
