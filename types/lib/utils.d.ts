import { MinesweeperConfig, forEachAdjacentCellCallback } from "../types";
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
export declare const isConfigValid: (config: MinesweeperConfig) => boolean;
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
export declare const isOutOfBounds: (config: MinesweeperConfig, x: number, y: number) => boolean;
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
export declare const getBoard: (config: MinesweeperConfig) => import("../types").MinesweeperCell[][];
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
export declare const forEachAdjacentCell: (config: MinesweeperConfig, board: import("../types").MinesweeperCell[][], x: number, y: number, action: forEachAdjacentCellCallback) => void;
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
export declare const placeMine: (config: MinesweeperConfig, board: import("../types").MinesweeperCell[][], x: number, y: number) => boolean;
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
export declare const placeMines: (config: MinesweeperConfig, board: import("../types").MinesweeperCell[][], seedX: number, seedY: number) => import("../types").MinesweeperCell[][];
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
export declare const cascadeCells: (config: MinesweeperConfig, board: import("../types").MinesweeperCell[][], x: number, y: number) => void;
/**
 * Indicates that the supplied configuration is not valid.
 * Automatically supplies the error message of `"invalid config"`.
 */
export declare class InvalidConfigError extends Error {
    constructor(config: MinesweeperConfig);
}
/**
 * Indicates that the supplied coordinates are out of bounds for the given board.
 * Automatically supplies the error message of `"out of bounds"`.
 */
export declare class OutOfBoundsError extends Error {
    constructor(x: number, y: number);
}
