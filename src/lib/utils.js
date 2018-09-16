import { CELL_STATE } from "./constants";

/** Indicates that the supplied configuration is not valid. */
export class InvalidConfigError extends Error {
  constructor(...params) {
    super("invalid confifg", ...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidConfigError);
    }
  }
}

/** Indicates that the supplied coordinates are out of bounds for the given board. */
export class OutOfBoundsError extends Error {
  constructor(...params) {
    super("out of bounds", ...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OutOfBoundsError);
    }
  }
}

/** @typedef {{x: number, y: number, mines: number}} Config */
/** @typedef {{state: number, hasMine: boolean, mineCount: number}} Cell */
/** @typedef {Cell[][]} Board */

/**
 * Verifies that the supplied configuration is valid.
 * @param {Config} config
 * @returns {boolean}
 */
export const isConfigValid = config => {
  return (
    config != null &&
    typeof config === "object" &&
    typeof config.x === "number" &&
    typeof config.y === "number" &&
    typeof config.mines === "number" &&
    !isNaN(config.x) &&
    !isNaN(config.y) &&
    !isNaN(config.mines) &&
    config.x >= 0 &&
    config.y >= 0 &&
    config.mines >= 0
  );
};

/**
 * @param {Config} config
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 * @throws {InvalidConfigError}
 */
export const isOutOfBounds = (config, x, y) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  return x < 0 || x >= config.x || y < 0 || y >= config.y;
};

/**
 * Generates a new blank board based on the provided config.
 * @param {Config} config
 * @returns {Board} New board.
 * @throws {InvalidConfigError}
 */
export const getBoard = config => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);

  const board = [];

  const { x: maxX, y: maxY } = config;

  // Rows
  for (let y = 0; y < maxY; y++) {
    // Columns
    let column = [];
    for (let x = 0; x < maxX; x++) {
      column.push({
        state: CELL_STATE.DEFAULT,
        hasMine: false,
        mineCount: 0
      });
    }
    board.push(column);
  }

  return board;
};

/**
 * @callback forEachCell
 * @param {Cell} cell
 * @param {number} x
 * @param {number} y
 */
/**
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @param {forEachCell} action
 * @throws {InvalidConfigError}
 * @throws {OutOfBoundsError}
 */
export const forEachAdjacentCell = (config, board, x, y, action) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const checkX = x + j;
      const checkY = y + i;

      if (i === 0 && j === 0) continue; // Skip the specified cell.
      if (isOutOfBounds(config, checkX, checkY)) continue;
      action(board[checkY][checkX], checkX, checkY);
    }
  }
};

/**
 * Modifies the given board by placing a mine at the specified coordinates
 * and incrementing the mineCount of adjacent cells.
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @returns {boolean} `true` if a modification took place; `false` otherwise.
 * @throws {InvalidConfigError}
 * @throws {OutOfBoundsError}
 */
export const placeMine = (config, board, x, y) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  const cell = board[y][x];

  // If it already has a mine, do nothing.
  if (cell.hasMine) return false;

  // console.log(`Placing mine at [${x}, ${y}]`);
  cell.hasMine = true;

  // Update the mineCount of adjacent cells.
  forEachAdjacentCell(config, board, x, y, cell => cell.mineCount++);

  return true;
};

/**
 * Randomly places mines on the given board, avoiding the specified seed coordinates.
 * @param {Config} config
 * @param {Board} board
 * @param {number} seedX
 * @param {number} seedY
 * @returns {Board} Modified `board` with randomly placed mines.
 * @throws {InvalidConfigError}
 * @throws {OutOfBoundsError}
 */
export const placeMines = (config, board, seedX, seedY) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, seedX, seedY))
    throw new OutOfBoundsError(seedX, seedY);

  const { x: maxX, y: maxY, mines } = config;

  let minesLeftToAssign = mines;
  while (minesLeftToAssign > 0) {
    let randX = Math.floor(Math.random() * maxX);
    let randY = Math.floor(Math.random() * maxY);

    if (randX === seedX && randY === seedY) continue;
    if (isOutOfBounds(config, randX, randY)) {
      // Should be impossible...
      console.warn("Tried to place mine out of bounds!", {
        config,
        board,
        seedX,
        seedY
      });
      continue;
    }
    if (placeMine(config, board, randX, randY)) minesLeftToAssign--;
  }

  return board;
};

/**
 * Modifies the given board by revealing all empty and empty-adjacent cells
 * connected to the given coordinates.
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @throws {InvalidConfigError}
 * @throws {OutOfBoundsError}
 */
export const cascadeCells = (config, board, x, y) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  // If the target is empty, begin the recursion.
  if (board[y][x].mineCount === 0) _cascadeCells(config, board, x, y);
};

/**
 * Internal recursion callback for {@link cascadeCells}.
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @private
 */
const _cascadeCells = (config, board, x, y) => {
  forEachAdjacentCell(config, board, x, y, (cell, _x, _y) => {
    if (cell.state === CELL_STATE.REVEALED) return;
    cell.state = CELL_STATE.REVEALED;
    if (cell.mineCount === 0) _cascadeCells(config, board, _x, _y);
  });
};
