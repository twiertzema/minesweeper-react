import seedrandom from "seedrandom";
import { render, RenderOptions } from "@testing-library/react";

import {getBoard, placeMines} from '../src/lib/utils'
import { MinesweeperBoard, MinesweeperConfig } from "../types/types";

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, {
    // wrapper: AllTheProviders,
    ...options
  });

const __originalRandom = Math.random;
export const seedRandom = (seed: any = "minesweeper-react") =>
  (global.Math.random = seedrandom(seed));
export const restoreRandom = () => (global.Math.random = __originalRandom);

/**
 * Pretty-prints a {@link MinesweeperBoard}.
 * @param board 
 * @param state - If `true`, prints the cells' state instead of mine count.
 */
export function printBoard (board: MinesweeperBoard, state: boolean = false) {
  let string = "";

  board.forEach((row, j) => {
    string += "[";

    row.forEach((cell, i) => {
      const maybeComma = i < row.length - 1 ? "," : "";

      if (state) {
        string += `${cell.state}${maybeComma}`;
      } else {
        string += `${cell.hasMine ? "x" : cell.mineCount}${maybeComma}`;
      }
    });

    string += `]${j < board.length - 1 ? "," : ""}\n`;
  });

  console.log(string);
};

/**
 * Convenience function to automatically generate and place mines on a board.
 */
export function getSeededBoard (config: MinesweeperConfig) {
  return placeMines(config, getBoard(config), 0, 0);
}

export * from "@testing-library/react";

export { customRender as render };
