import { MinesweeperConfig } from "../types";

export enum CELL_STATE {
  /**
   * Initial state of all [Cells](Cell). Defined as the absence of all other state.
   */
  DEFAULT,
  /**
   * The user has placed a flag on this {@link MinesweeperCell}. Flagged [Cells](Cell)
   * are not revealed when the user clicks on them.
   */
  FLAGGED,
  /**
   * The user has revealed this {@link MinesweeperCell}. Once a {@link MinesweeperCell}
   * is revealed, the user can no longer interact with a cell.
   */
  REVEALED,
  /**
   * The user has marked this {@link MinesweeperCell} with a question mark
   * indicating that they are unsure whether or not this {@link MinesweeperCell}
   * contains a mine.
   */
  QUESTIONED,
}

/** A 9×9 board with 10 mines. */
export const CONFIG_EASY: MinesweeperConfig = { x: 9, y: 9, mines: 10 };

/** A 16×16 board with 40 mines. */
export const CONFIG_INTERMEDIATE: MinesweeperConfig = {
  x: 16,
  y: 16,
  mines: 40,
};

/** A 30×16 board with 99 mines. */
export const CONFIG_EXPERT: MinesweeperConfig = { x: 30, y: 16, mines: 99 };

/**
 * A 0×0 board with 0 mines. The initial state of a board before a different
 * configuration is loaded.
 */
export const CONFIG_DEFAULT: MinesweeperConfig = { x: 0, y: 0, mines: 0 };

/**
 * Enum respresenting the overall game state.
 */
export enum GAME_STATE {
  /** The default state of a board before it has been seeded with mines. */
  DEFAULT,
  /** The state of a board after it has been seeded with mines. */
  SEEDED,
  /** A state representing the player having lost. X( */
  LOSE,
  /** A state representing the player having won. B) */
  WIN,
}

// TODO: Move out of this file; this is Electron-specific.
/**
 * Enum representing the Electron IPC message channels.
 * @private
 */
export enum IPC_MESSAGE {
  NEW_GAME = "new-game",
}
