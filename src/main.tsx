import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ConfigProvider } from './context/ConfigContext';
import { DataProvider } from './context/DataContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <DataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataProvider>
    </ConfigProvider>
  </StrictMode>,
);
