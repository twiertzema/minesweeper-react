import { CELL_STATE } from "./constants";

// TODO: Derive more information from boards instead of requiring config to always be passed in.

/**
 * Configuration object that defines a board's setup.
 *
 * @typedef {{x: number, y: number, mines: number}} MinesweeperConfig
 * @property {number} x Number of mines on the X axis. *Note:* Must be >= `0`.
 * @property {number} y Number of mines on the Y axis. *Note:* Must be >= `0`.
 * @property {number} mines Number of mines contained on the board.
 *  *Note:* Must adhere to the following rules:
 *  - Must be >= `0`.
 *  - Must be <= the product of `x` and `y`.
 */
/**
 * 2-dimensional {@link Array} representing a board in Minesweeper.
 *
 * **Note:** The first order of [Arrays](Array) represents the rows of the
 *  board, and the second order represents the columns. This means that the Y
 *  coordinate of a given {@link MinesweeperCell} is used as the index of the first order
 *  and the X coordinate is used as the index of the second order.
 *
 * @typedef {Array<Array<MinesweeperCell>>} MinesweeperBoard
 */
/**
 * Object representing a cell on the board. These comprise the makeup of the
 *  {@link MinesweeperBoard}.
 *
 * @typedef {{hasMine: boolean, mineCount: number, state: CELL_STATE}} MinesweeperCell
 * @property {boolean} hasMine Indicates whether or not this cell contains a
 *  mine. Default value is `false`.
 * @property {number} mineCount Indicates how many mines are adjacent to this
 *  cell. Default value is `0`.
 * @property {CELL_STATE} state Enum value indicating what state the cell is in.
 *  Default value is `CELL_STATE.DEFAULT`.
 */

/**
 * Verifies that the supplied {@link MinesweeperConfig} is valid.
 *
 * @function
 * @param {MinesweeperConfig} config
 * @returns {boolean}
 * @example
 * const myConfig = { x: 10, y: 15, mines: 100 };
 * const isMyConfigValid = isConfigValid(myConfig);
 * console.log(isMyConfigValid); // true
 *
 * console.log(isConfigValid(null)); // false
 * console.log(isConfigValid({ x: 5 })); // false
 * console.log(isConfigValid({ x: 5, y: 5 })); // false
 * console.log(isConfigValid({ x: 5, y: 5, mines: 1337 })); // false
 * console.log(isConfigValid({ x: "5", y: "5", mines: "13" })); // false
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
    config.mines >= 0 &&
    config.mines <= config.x * config.y
  );
};

/**
 * Determines if the supplied `x` and `y` coordinates are out of bounds for the
 *  given {@link MinesweeperConfig}.
 *
 * @function
 * @param {MinesweeperConfig} config
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 * @throws {InvalidConfigError} if `config` is not valid.
 * @example
 * const myConfig = { x: 10, y: 15, mines: 100 };
 * console.log(isOutOfBounds(myConfig, 4, 0)); // false
 *
 * console.log(isOutOfBounds(myConfig, 107, 3)); // true
 * console.log(isOutOfBounds(myConfig, 5, -1)); // true
 * console.log(isOutOfBounds(myConfig, 10, 10)); // true
 *
 * isOutOfBounds(invalidConfig, 10, -1); // throws InvalidConfigError
 */
export const isOutOfBounds = (config, x, y) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  return x < 0 || x >= config.x || y < 0 || y >= config.y;
};

/**
 * Generates the 2-dimensional {@link Array} representing the board using the
 *  provided {@link MinesweeperConfig}.
 *
 * **Note:** This does not place the mines on the board. For that, you must call
 *  {@link placeMines}.
 *
 * @function
 * @param {MinesweeperConfig} config
 * @returns {MinesweeperBoard} New blank board.
 * @throws {InvalidConfigError} if `config` is not valid.
 * @example
 * getBoard(CONFIG_EASY); // Returns a 9x9 2D Array of Cells in their default state.
 *
 * const myConfig = { x: 10, y: 15, mines: 100 };
 * getBoard(myConfig); // Returns a 10x10 2D Array of Cells in their default state.
 *
 * getBoard(invalidConfig); // throws InvalidConfigError
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
 * The format for the `action` parameter of {@link forEachAdjacentCell}.
 *
 * @callback forEachAdjacentCellCallback
 * @param {MinesweeperCell} cell The current {@link MinesweeperCell} in the iteration.
 * @param {number} x X coordinate of the cell.
 * @param {number} y Y coordinate of the cell.
 */
/**
 * Executes the `action` callback for every cell adjacent to the target `x` and
 *  `y` coordinates (excluding out-of-bounds coordinates).
 *
 * @function
 * @param {MinesweeperConfig} config {@link MinesweeperConfig} used to generate `board` (for reference).
 * @param {MinesweeperBoard} board {@link MinesweeperBoard} from which to retrive the [Cells](Cell).
 * @param {number} x X coordinate of the target {@link MinesweeperCell}.
 * @param {number} y Y coordinate of the target {@link MinesweeperCell}.
 * @param {forEachAdjacentCellCallback} action Callback function to be exectued
 *  for every (valid) adjacent cell.
 * @returns {void}
 * @throws {InvalidConfigError} if `config` is not valid.
 * @throws {OutOfBoundsError} if `x` and `y` indicate a cell that is out of
 *  bounds for `config`.
 * @example
 * const myConfig = { x: 10, y: 15, mines: 100 };
 * const myBoard = getBoard(myConfig);
 * forEachAdjacentCell(myConfig, myBoard, 0, 5, (cell, x, y) => {
 *   console.log({ x, y });
 * });
 * // Will output the following:
 * //  { x: 0, y: 4 }
 * //  { x: 0, y: 6 }
 * //  { x: 1, y: 4 }
 * //  { x: 1, y: 5 }
 * //  { x: 1, y: 6 }
 */
export const forEachAdjacentCell = (config, board, x, y, action) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  for (let j = -1; j < 2; j++) {
    for (let i = -1; i < 2; i++) {
      const checkX = x + i;
      const checkY = y + j;

      if (i === 0 && j === 0) continue; // Skip the specified cell.
      if (isOutOfBounds(config, checkX, checkY)) continue;
      action(board[checkY][checkX], checkX, checkY);
    }
  }
};

/**
 * Modifies the given {@link MinesweeperBoard} by setting `hasMine` to `true` for the
 *  {@link MinesweeperCell} at the specified `x` and `y` coordinates and increments
 *  `mineCount` for all adjacent cells.
 *
 * This function is used by {@link placeMines} to populate a board.
 *
 * If the specified {@link MinesweeperCell} already has a mine, this function does nothing
 *  and returns `false`.
 *
 * **Warning:** This is <u>not</u> a pure function.
 *
 * @function
 * @param {MinesweeperConfig} config {@link MinesweeperConfig} used to generate `board` (for reference).
 * @param {MinesweeperBoard} board {@link MinesweeperBoard} on which to place the mine.
 * @param {number} x X coordinate of the target {@link MinesweeperCell}.
 * @param {number} y Y coordinate of the target {@link MinesweeperCell}.
 * @returns {boolean} `true` if a modification took place; `false` otherwise.
 * @throws {InvalidConfigError} if `config` is not valid.
 * @throws {OutOfBoundsError} if `x` and `y` indicate a cell that is out of
 *  bounds for `config`.
 * @example
 * const myConfig = { x: 10, y: 15, mines: 100 };
 * const myBoard = getBoard(myConfig);
 * console.log(myBoard[7][4].hasMine) // false
 *
 * placeMine(myConfig, myBoard, 4, 7)
 * console.log(myBoard[7][4].hasMine) // true
 *
 * console.log(myBoard[6][3].mineCount) // 1
 * console.log(myBoard[7][3].mineCount) // 1
 * console.log(myBoard[8][3].mineCount) // 1
 * console.log(myBoard[6][4].mineCount) // 1
 * console.log(myBoard[8][4].mineCount) // 1
 * console.log(myBoard[6][5].mineCount) // 1
 * console.log(myBoard[7][5].mineCount) // 1
 * console.log(myBoard[8][5].mineCount) // 1
 *
 * placeMine(myConfig, myBoard, 4, 5)
 *
 * console.log(myBoard[4][3].mineCount) // 1
 * console.log(myBoard[5][3].mineCount) // 1
 * console.log(myBoard[6][3].mineCount) // 2
 * console.log(myBoard[4][4].mineCount) // 1
 * console.log(myBoard[6][4].mineCount) // 2
 * console.log(myBoard[4][5].mineCount) // 1
 * console.log(myBoard[5][5].mineCount) // 1
 * console.log(myBoard[6][5].mineCount) // 2
 *
 * placeMine(invalidConfig, [][], 0, 0) // throws InvalidConfigError
 * placeMine(myConfig, myBoard, 100, 3) // throws OutOfBoundsError
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

// TODO: Rename so as not to be so similar to `placeMine`.
/**
 * Randomly places mines on `board` (using {@link placeMine}), avoiding the
 *  {@link MinesweeperCell} specified by `seedX` and `seedY`.
 *
 * In practice, the board is not populated with mines until the user clicks the
 *  first cell. This means that the first cell the user clicks can never be a
 *  mine, and this is why {@link getBoard} and this function are separate.
 *
 * **Warning:** This is <u>not</u> a pure function.
 *
 * @function
 * @param {MinesweeperConfig} config {@link MinesweeperConfig} used to generate `board` (for reference).
 * @param {MinesweeperBoard} board {@link MinesweeperBoard} on which to place the mines.
 * @param {number} seedX X coordinate of the seed {@link MinesweeperCell}.
 * @param {number} seedY Y coordinate of the seed {@link MinesweeperCell}.
 * @returns {MinesweeperBoard} Modified `board` with randomly placed mines.
 * @throws {InvalidConfigError} if `config` is not valid.
 * @throws {OutOfBoundsError} if `seedX` and `seedY` indicate a cell that is out
 *  of bounds for `config`.
 * @example
 * const myConfig = { x: 10, y: 15, mines: 100 }
 * const myBoard = getBoard(myConfig)
 *
 * placeMines(myConfig, myBoard, 4, 7)
 *
 * // `myBoard` will now be randomly populated with mines and the cells'
 * //  `mineCount` will be set.
 */
export const placeMines = (config, board, seedX, seedY) => {
  // TODO: Rename `seedX`/`seedY`; the names make it sound like this function is idempotent.
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
 * If the origin {@link MinesweeperCell} specified by `x` and `y` is "empty" (has a
 *  `mineCount` of `0`), this function modifies `board` by revealing all empty
 *  and empty-adjacent [Cells](Cell); otherwise, this function does nothing.
 *
 * **Warning:** This is <u>not</u> a pure function.
 *
 * @function
 * @param {MinesweeperConfig} config {@link MinesweeperConfig} used to generate `board` (for reference).
 * @param {MinesweeperBoard} board {@link MinesweeperBoard} for which to reveal the [Cells](Cell).
 * @param {number} x X coordinate of the origin {@link MinesweeperCell}.
 * @param {number} y Y coordinate of the origin {@link MinesweeperCell}.
 * @returns {void}
 * @throws {InvalidConfigError} if `config` is not valid.
 * @throws {OutOfBoundsError} if `x` and `y` indicate a cell that is out of
 *  bounds for `config`.
 * @example
 * const myConfig = { x: 5, y: 5, mines: 10 }
 * const myBoard = getBoard(myConfig)
 * placeMines(myConfig, myBoard, 0, 0)
 *
 * // Assume the following board (x = mine):
 * //  1 1 0 0 0
 * //  x 4 2 1 0
 * //  x x x 4 2
 * //  x x x x x
 * //  x 4 3 3 2
 *
 * cascadeCells(myConfig, myBoard, 2, 0)
 *
 * // This will reveal the following cells (r = revealed):
 * //  - r r r r
 * //  - r r r r
 * //  - - - r r
 * //  - - - - -
 * //  - - - - -
 *
 * cascadeCells(myConfig, myBoard, 1, 4)
 * // Since the target cell would have a `minCount` of 4, this would do nothing.
 *
 * cascadeCells(invalidConfig, [][], 0, 0) // throws InvalidConfigError
 * cascadeCells(myConfig, myBoard, 100, 100) // throws OutOfBoundsError
 */
export const cascadeCells = (config, board, x, y) => {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  // If the target is empty, begin the recursion.
  if (board[y][x].mineCount === 0) _cascadeCells(config, board, x, y);
};

/**
 * Internal recursion callback for {@link cascadeCells}.
 * @param {MinesweeperConfig} config
 * @param {MinesweeperBoard} board
 * @param {number} x
 * @param {number} y
 * @returns {void}
 * @private
 */
const _cascadeCells = (config, board, x, y) => {
  forEachAdjacentCell(config, board, x, y, (cell, _x, _y) => {
    if (cell.state === CELL_STATE.REVEALED) return;
    cell.state = CELL_STATE.REVEALED;
    if (cell.mineCount === 0) _cascadeCells(config, board, _x, _y);
  });
};

/**
 * Indicates that the supplied configuration is not valid.
 * Automatically supplies the error message of `"invalid config"`.
 */
export class InvalidConfigError extends Error {
  constructor(...params) {
    super("invalid confifg", ...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidConfigError);
    }
  }
}

/**
 * Indicates that the supplied coordinates are out of bounds for the given board.
 * Automatically supplies the error message of `"out of bounds"`.
 */
export class OutOfBoundsError extends Error {
  constructor(...params) {
    super("out of bounds", ...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OutOfBoundsError);
    }
  }
}
