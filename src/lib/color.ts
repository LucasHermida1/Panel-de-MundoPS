import type { MantineColorsTuple } from '@mantine/core';

// Mantine espera una escala de 10 tonos por color. Esta funcion pura la
// genera desde un solo hex mezclando el color base con blanco (tonos
// claros) y negro (tonos oscuros), suficiente para theming en vivo sin
// sumar una dependencia de manipulacion de color.

function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (match === null) {
    return null;
  }
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mixChannel(channel: number, target: number, weight: number): number {
  return Math.round(channel + (target - channel) * weight);
}

function mixToHex(rgb: [number, number, number], target: number, weight: number): string {
  const [r, g, b] = rgb.map((channel) => mixChannel(channel, target, weight));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export const FALLBACK_BRAND_COLOR = '#0070d1';

export function makeColorScale(hex: string): MantineColorsTuple {
  const rgb = hexToRgb(hex) ?? hexToRgb(FALLBACK_BRAND_COLOR)!;
  return [
    mixToHex(rgb, 255, 0.92),
    mixToHex(rgb, 255, 0.82),
    mixToHex(rgb, 255, 0.66),
    mixToHex(rgb, 255, 0.5),
    mixToHex(rgb, 255, 0.32),
    mixToHex(rgb, 255, 0.16),
    mixToHex(rgb, 255, 0),
    mixToHex(rgb, 0, 0.12),
    mixToHex(rgb, 0, 0.24),
    mixToHex(rgb, 0, 0.35),
  ];
}
