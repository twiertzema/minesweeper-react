/**
 * Enum for cell states
 * @enum {number}
 */
export const CELL_STATE = {
  /** Initial state of all [Cells](Cell). Defined as the absence of all other state. */
  DEFAULT: 0,
  /** The user has placed a flag on this {@link Cell}. Flagged [Cells](Cell) are not revealed when the user clicks on them. */
  FLAGGED: 1,
  /** The user has revealed this {@link Cell}. Once a {@link Cell} is revealed, the user can no longer interact with a cell. */
  REVEALED: 2,
  /** The user has marked this {@link Cell} with a question mark indicating that they are unsure whether or not this {@link Cell} contains a mine. */
  QUESTIONED: 4
};

/**
 * A 9×9 board with 10 mines.
 * @type {Config}
 */
export const CONFIG_EASY = { x: 9, y: 9, mines: 10 };

/**
 * A 16×16 board with 40 mines.
 * @type {Config}
 */
export const CONFIG_INTERMEDIATE = { x: 16, y: 16, mines: 40 };

/**
 * A 30×16 board with 99 mines.
 * @type {Config}
 */
export const CONFIG_EXPERT = { x: 30, y: 16, mines: 99 };

/**
 * A 0×0 board with 0 mines. The initial state of a board before a different configuration is loaded.
 * @type {Config}
 */
export const CONFIG_DEFAULT = { x: 0, y: 0, mines: 0 };
