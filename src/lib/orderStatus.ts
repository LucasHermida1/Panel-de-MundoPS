import type { EstadoPedido } from '../types';

// Regla de negocio: transiciones validas de estado de un pedido.
// pendiente -> confirmado -> entregado; cancelable mientras no este entregado.
export function nextEstados(estado: EstadoPedido): EstadoPedido[] {
  switch (estado) {
    case 'pendiente':
      return ['confirmado', 'cancelado'];
    case 'confirmado':
      return ['entregado', 'cancelado'];
    case 'entregado':
      return [];
    case 'cancelado':
      return [];
  }
}

export function canTransition(from: EstadoPedido, to: EstadoPedido): boolean {
  return nextEstados(from).includes(to);
}
