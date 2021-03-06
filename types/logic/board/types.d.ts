import { MinesweeperConfig } from "../../types";
export declare const RECONFIGURE_BOARD = "RECONFIGURE_BOARD";
export declare const REVEAL_CELL = "REVEAL_CELL";
export declare const TURN_CELL_STATE = "TURN_CELL_STATE";
export interface ReconfigureBoardAction {
    type: typeof RECONFIGURE_BOARD;
    configuration: MinesweeperConfig;
}
export interface RevealCellAction {
    type: typeof REVEAL_CELL;
    x: number;
    y: number;
}
export interface TurnCellStateAction {
    type: typeof TURN_CELL_STATE;
    x: number;
    y: number;
}
export declare type BoardAction = ReconfigureBoardAction | RevealCellAction | TurnCellStateAction;
