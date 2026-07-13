import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Azul inspirado en la marca PlayStation (#0070d1 como tono base).
// Mantine exige la escala completa de 10 tonos, de mas claro a mas oscuro.
const psBlue: MantineColorsTuple = [
  '#e5f3ff',
  '#cde2ff',
  '#9ac4f8',
  '#63a4f2',
  '#3789ed',
  '#1b78eb',
  '#0070d1',
  '#005fb8',
  '#0054a5',
  '#004892',
];

export const theme = createTheme({
  colors: { psBlue },
  primaryColor: 'psBlue',
  defaultRadius: 'md',
});
