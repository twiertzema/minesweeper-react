import { CELL_STATE } from "./lib/constants";
/** Configuration object that defines a board's setup. */
export interface MinesweeperConfig {
    /**
     * Number of mines contained on the board.
     * *Note:* Must adhere to the following rules:
     * - Must be >= `0`.
     * - Must be <= the product of `x` and `y`.
     */
    mines: number;
    /** Number of mines on the X axis. *Note:* Must be >= `0`. */
    x: number;
    /** Number of mines on the Y axis. *Note:* Must be >= `0`. */
    y: number;
}
/**
 * 2-dimensional {@link Array} representing a board in Minesweeper.
 *
 * **Note:** The first order of [Arrays](Array) represents the rows of the
 *  board, and the second order represents the columns. This means that the Y
 *  coordinate of a given {@link MinesweeperCell} is used as the index of the
 *  first order and the X coordinate is used as the index of the second order.
 */
export declare type MinesweeperBoard = Array<Array<MinesweeperCell>>;
/**
 * Object representing a cell on the board. These comprise the makeup of the
 *  {@link MinesweeperBoard}.
 */
export interface MinesweeperCell {
    /**
     * Indicates whether or not this cell contains a mine.
     * @default false
     */
    hasMine: boolean;
    /**
     * Indicates how many mines are adjacent to this cell.
     * @default 0
     */
    mineCount: number;
    /**
     * Enum value indicating what state the cell is in.
     * @default CELL_STATE.DEFAULT
     */
    state: CELL_STATE;
}
/** The format for the `action` parameter of {@link forEachAdjacentCell}. */
export declare type forEachAdjacentCellCallback = (cell: MinesweeperCell, x: number, y: number) => void;
