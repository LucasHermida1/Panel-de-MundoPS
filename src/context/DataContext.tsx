import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { pedidos as pedidosIniciales } from '../data/pedidos';
import { productos as productosIniciales } from '../data/productos';
import { canTransition } from '../lib/orderStatus';
import type { EstadoPedido, Pedido, Producto } from '../types';

interface DataContextValue {
  productos: Producto[];
  pedidos: Pedido[];
  saveProducto: (producto: Producto) => void;
  cambiarEstadoPedido: (pedidoId: string, nuevoEstado: EstadoPedido) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);

  // Alta o edicion segun exista el id
  const saveProducto = useCallback((producto: Producto) => {
    setProductos((prev) => {
      const exists = prev.some((p) => p.id === producto.id);
      return exists ? prev.map((p) => (p.id === producto.id ? producto : p)) : [...prev, producto];
    });
  }, []);

  const cambiarEstadoPedido = useCallback((pedidoId: string, nuevoEstado: EstadoPedido) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId && canTransition(p.estado, nuevoEstado)
          ? { ...p, estado: nuevoEstado }
          : p,
      ),
    );
  }, []);

  return (
    <DataContext.Provider value={{ productos, pedidos, saveProducto, cambiarEstadoPedido }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (ctx === null) {
    throw new Error('useData debe usarse dentro de un DataProvider');
  }
  return ctx;
}
