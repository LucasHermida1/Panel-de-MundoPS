import { createTheme, type MantineThemeOverride } from '@mantine/core';
import { makeColorScale } from './lib/color';

// El theme se construye desde el color de marca elegido en Configuracion.
// 'brand' es el nombre del color primario en toda la app.
export function buildTheme(brandColor: string): MantineThemeOverride {
  return createTheme({
    colors: { brand: makeColorScale(brandColor) },
    primaryColor: 'brand',
    defaultRadius: 'md',
  });
}
