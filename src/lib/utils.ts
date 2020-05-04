import {
  MinesweeperConfig,
  MinesweeperBoard,
  forEachAdjacentCellCallback,
} from "../types";
import { CELL_STATE, GAME_STATE } from "./constants";

// TODO: Derive more information from boards instead of requiring config to always be passed in.

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
export function isConfigValid(config: MinesweeperConfig): boolean {
  return (
    !isNaN(config.x) &&
    !isNaN(config.y) &&
    !isNaN(config.mines) &&
    config.x >= 0 &&
    config.y >= 0 &&
    config.mines >= 0 &&
    config.mines <= config.x * config.y
  );
}

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
export function isOutOfBounds(
  config: MinesweeperConfig,
  x: number,
  y: number
): boolean {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  return x < 0 || x >= config.x || y < 0 || y >= config.y;
}

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
export function getBoard(config: MinesweeperConfig): MinesweeperBoard {
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
        mineCount: 0,
      });
    }
    board.push(column);
  }

  return board;
}

/**
 * Executes the `action` callback for every cell adjacent to the target `x` and
 *  `y` coordinates (excluding out-of-bounds coordinates).
 *
 * @function
 * @param {MinesweeperConfig} config {@link MinesweeperConfig} used to generate `board` (for reference).
 * @param {MinesweeperBoard} board {@link MinesweeperBoard} from which to retrive the [Cells](Cell).
 * @param {number} x X coordinate of the target {@link MinesweeperCell}.
 * @param {number} y Y coordinate of the target {@link MinesweeperCell}.
 * @param {forEachAdjacentCellCallback} action Callback function to be executed
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
export function forEachAdjacentCell(
  config: MinesweeperConfig,
  board: MinesweeperBoard,
  x: number,
  y: number,
  action: forEachAdjacentCellCallback
): void {
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
}

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
export function placeMine(
  config: MinesweeperConfig,
  board: MinesweeperBoard,
  x: number,
  y: number
): boolean {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  const cell = board[y][x];

  // If it already has a mine, do nothing.
  if (cell.hasMine) return false;

  // console.log(`Placing mine at [${x}, ${y}]`);
  cell.hasMine = true;

  // Update the mineCount of adjacent cells.
  forEachAdjacentCell(config, board, x, y, (cell) => cell.mineCount++);

  return true;
}

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
export function placeMines(
  config: MinesweeperConfig,
  board: MinesweeperBoard,
  seedX: number,
  seedY: number
): MinesweeperBoard {
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
        seedY,
      });
      continue;
    }
    if (placeMine(config, board, randX, randY)) minesLeftToAssign--;
  }

  return board;
}

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
 * chordCells(myConfig, myBoard, 2, 0)
 *
 * // This will reveal the following cells (r = revealed):
 * //  - r r r r
 * //  - r r r r
 * //  - - - r r
 * //  - - - - -
 * //  - - - - -
 *
 * chordCells(myConfig, myBoard, 1, 4)
 * // Since the target cell would have a `minCount` of 4, this would do nothing.
 *
 * chordCells(invalidConfig, [][], 0, 0) // throws InvalidConfigError
 * chordCells(myConfig, myBoard, 100, 100) // throws OutOfBoundsError
 */
export function chordCells(
  config: MinesweeperConfig,
  board: MinesweeperBoard,
  x: number,
  y: number
): void {
  if (!isConfigValid(config)) throw new InvalidConfigError(config);
  if (isOutOfBounds(config, x, y)) throw new OutOfBoundsError(x, y);

  // If the target is empty, begin the recursion.
  if (board[y][x].mineCount === 0) _chordCells(config, board, x, y);
}

/**
 * Internal recursion callback for {@link chordCells}.
 * @param {MinesweeperConfig} config
 * @param {MinesweeperBoard} board
 * @param {number} x
 * @param {number} y
 * @returns {void}
 * @private
 */
function _chordCells(
  config: MinesweeperConfig,
  board: MinesweeperBoard,
  x: number,
  y: number
): void {
  forEachAdjacentCell(config, board, x, y, (cell, _x, _y) => {
    if (cell.state === CELL_STATE.REVEALED) return;
    cell.state = CELL_STATE.REVEALED;
    if (cell.mineCount === 0) _chordCells(config, board, _x, _y);
  });
}

/**
 * Counts how many mines are on the board, subtracting the number of flags that
 *  have been placed.
 */
export function getMineDisplayCount(
  board: MinesweeperBoard,
  gameState: GAME_STATE
): number {
  if (gameState === GAME_STATE.WIN) return 0;

  let _numberOfMines = 0;
  let _numberOfFlags = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell.hasMine) _numberOfMines++;
      if (cell.state === CELL_STATE.FLAGGED) _numberOfFlags++;
    }
  }

  return _numberOfMines - _numberOfFlags;
}

/**
 * Determines what state the game is in from the board.
 */
export function determineBoardState(board: MinesweeperBoard): GAME_STATE {
  let isSeeded = false;

  // The game is won when all non-mine cells are revealed.
  let hasUnrevealedCells = false;

  // Don't want to count a board with no cells as "won".
  let hasCells = false;

  for (const row of board) {
    for (const cell of row) {
      hasCells = true;
      if (cell.hasMine) isSeeded = true;

      switch (cell.state) {
        case CELL_STATE.DEFAULT:
        case CELL_STATE.QUESTIONED:
        case CELL_STATE.FLAGGED:
          if (!cell.hasMine) hasUnrevealedCells = true;
          break;

        case CELL_STATE.REVEALED:
          if (cell.hasMine) {
            // A mine was revealed, so the game is lost.
            return GAME_STATE.LOSE;
          }

          break;
      }
    }
  }

  // By this point, we know the game isn't lost.

  if (!hasCells) {
    // If there aren't any cells at all, it's the DEFAULT state.
    return GAME_STATE.DEFAULT;
  }

  if (hasUnrevealedCells) {
    // There are some cells left to reveal, so the game isn't won.
    return isSeeded ? GAME_STATE.SEEDED : GAME_STATE.DEFAULT;
  } else {
    return GAME_STATE.WIN;
  }
}

/**
 * Sets the `state` of all cells that have mines to `FLAGGED`.
 * - This is to be called at the successful end of the game to confirm the
 *   placement of mines to the user in case they didn't flag them.
 *
 * **Warning:** This is <u>not</u> a pure function.
 */
export function flagAllMines(board: MinesweeperBoard): void {
  for (const row of board) {
    for (const cell of row) {
      if (cell.hasMine) cell.state = CELL_STATE.FLAGGED;
    }
  }
}

/**
 * Sets the `state` of all cells that have mines to `REVEALED`.
 * - This is to be called when the user loses the game by revealing a mine.
 *
 * ** Warning:** This is <u>not</u> a pure function.
 */
export function revealAllMines(board: MinesweeperBoard): void {
  for (const row of board) {
    for (const cell of row) {
      if (cell.hasMine) cell.state = CELL_STATE.REVEALED;
    }
  }
}

/**
 * Indicates that the supplied configuration is not valid.
 * Automatically supplies the error message of `"invalid config"`.
 */
export class InvalidConfigError extends Error {
  constructor(config: MinesweeperConfig) {
    super(`invalid config: ${JSON.stringify(config)}`);

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
  constructor(x: number, y: number) {
    super(`out of bounds: {x: ${x}, y: ${y}}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OutOfBoundsError);
    }
  }
}
