import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { PedidosPage } from './pages/PedidosPage';
import { ProductosPage } from './pages/ProductosPage';
import { ResumenPage } from './pages/ResumenPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ResumenPage />} />
        <Route path="/pedidos" element={<PedidosPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
      </Route>
    </Routes>
  );
}
