import { Chart, registerables } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';
import { Canvas } from 'skia-canvas';
import type { ChartImage } from '../types/charts.js';

// Register all Chart.js components once
Chart.register(...registerables);

// Default chart dimensions
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 400;

/**
 * Render a Chart.js chart to a base64 PNG data URL.
 * Uses skia-canvas as the canvas backend (official Chart.js approach).
 */
export async function renderChart(
  config: ChartConfiguration,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT,
): Promise<string> {
  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Create chart with animation disabled and responsive off for server-side rendering
  new Chart(canvas as any, {
    ...config,
    options: {
      ...config.options,
      animation: false,
      responsive: false,
    },
  });

  const buffer = await canvas.toBuffer('png');
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

/**
 * Wrap a base64 data URL string into a ChartImage object.
 */
export function makeChartImage(base64: string, width: number, height: number): ChartImage {
  return { base64, width, height };
}
