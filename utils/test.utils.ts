import seedrandom from 'seedrandom'
import { render, RenderOptions } from "@testing-library/react";

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, {
    // wrapper: AllTheProviders,
    ...options
  });

const __originalRandom = Math.random;
export const seedRandom = (seed: any = "minesweeper-react") =>
  (global.Math.random = seedrandom(seed));
export const restoreRandom = () => (global.Math.random = __originalRandom);

export * from "@testing-library/react";

export { customRender as render };
