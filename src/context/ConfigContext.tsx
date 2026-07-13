import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { FALLBACK_BRAND_COLOR } from '../lib/color';
import { buildTheme } from '../theme';
import type { ComercioInfo } from '../types';

const DEFAULT_COMERCIO: ComercioInfo = {
  nombre: 'MundoPS',
  direccion: 'Av. 18 de Julio 1234, Montevideo',
  telefono: '099 123 456',
  horario: 'Lunes a sábado, 10:00 a 19:00',
};

interface ConfigContextValue {
  comercio: ComercioInfo;
  setComercio: (info: ComercioInfo) => void;
  brandColor: string;
  setBrandColor: (hex: string) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

// Este provider envuelve al MantineProvider: cuando cambia brandColor se
// reconstruye el theme y toda la app se re-renderiza con el color nuevo.
// Sin persistencia a proposito (ver README): en produccion iria al backend.
export function ConfigProvider({ children }: { children: ReactNode }) {
  const [comercio, setComercio] = useState<ComercioInfo>(DEFAULT_COMERCIO);
  const [brandColor, setBrandColor] = useState(FALLBACK_BRAND_COLOR);

  const theme = useMemo(() => buildTheme(brandColor), [brandColor]);

  return (
    <ConfigContext.Provider value={{ comercio, setComercio, brandColor, setBrandColor }}>
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </ConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (ctx === null) {
    throw new Error('useConfig debe usarse dentro de un ConfigProvider');
  }
  return ctx;
}
