import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ResumenPage } from './pages/ResumenPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ResumenPage />} />
        <Route path="/pedidos" element={<PlaceholderPage title="Pedidos" />} />
        <Route path="/productos" element={<PlaceholderPage title="Productos" />} />
        <Route path="/configuracion" element={<PlaceholderPage title="Configuración" />} />
      </Route>
    </Routes>
  );
}
