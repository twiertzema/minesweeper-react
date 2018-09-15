/**
 * Enum for cell states
 * @enum {number}
 */
export const CELL_STATE = {
  DEFAULT: 0,
  FLAGGED: 1,
  REVEALED: 2,
  QUESTIONED: 4
};

/** @type Config */
export const CONFIG_DEFAULT = { x: 0, y: 0, mines: 0 };

/** @type Config */
export const CONFIG_EASY = { x: 9, y: 9, mines: 10 };

/** @type Config */
export const CONFIG_INTERMEDIATE = { x: 16, y: 16, mines: 40 };

/** @type Config */
export const CONFIG_EXPERT = { x: 30, y: 16, mines: 99 };
