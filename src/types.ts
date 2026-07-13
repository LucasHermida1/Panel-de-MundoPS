export type EstadoPedido = 'pendiente' | 'confirmado' | 'entregado' | 'cancelado';

export type CategoriaProducto = 'almacen' | 'cafeteria' | 'bebidas' | 'limpieza';

export interface Producto {
  id: string;
  nombre: string;
  categoria: CategoriaProducto;
  precio: number; // UYU
  precioOferta?: number; // si existe, debe ser < precio
  stock: number | null; // null = ilimitado
  descripcion?: string;
}

export interface ItemPedido {
  productoId: string;
  cantidad: number;
  precioUnitario: number; // precio al momento del pedido
}

export interface Pedido {
  id: string;
  numero: number;
  cliente: string;
  fecha: string; // ISO
  items: ItemPedido[];
  estado: EstadoPedido;
}
