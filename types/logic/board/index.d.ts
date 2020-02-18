import { MinesweeperBoard, MinesweeperConfig } from "../../types";
import { BoardAction, ReconfigureBoardAction, RevealCellAction, TurnCellStateAction } from "./types";
interface BoardState {
    config: MinesweeperConfig;
    seeded: boolean;
    board: MinesweeperBoard;
}
/**
 * Action creator for `RECONFIGURE_BOARD`.
 * @param {MinesweeperConfig} configuration
 * @returns {{type: string, configuration: MinesweeperConfig}}
 */
export declare const reconfigureBoard: (configuration: MinesweeperConfig) => ReconfigureBoardAction;
/**
 * Action creator for `REVEAL_CELL`.
 */
export declare const revealCell: (x: number, y: number) => RevealCellAction;
/**
 * Action creator for `TURN_CELL_STATE`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export declare const turnCellState: (x: number, y: number) => TurnCellStateAction;
/**
 * Merges an update into the specified {@link MinesweeperCell} in a {@link MinesweeperBoard}.
 * @param {MinesweeperBoard} board
 * @param {number} x
 * @param {number} y
 * @param {Object} mod
 * @returns {MinesweeperBoard} A _new_ board.
 * @throws {OutOfBoundsError}
 */
export declare const modifyCell: (board: MinesweeperBoard, x: number, y: number, mod: Object) => MinesweeperBoard;
export declare const init: (config: MinesweeperConfig) => BoardState;
export declare function reducer(state: BoardState, action: BoardAction): BoardState;
export {};
