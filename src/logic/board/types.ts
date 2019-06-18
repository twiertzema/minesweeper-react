import { MinesweeperConfig } from "../../types";

export const RECONFIGURE_BOARD = "RECONFIGURE_BOARD";
export const REVEAL_CELL = "REVEAL_CELL";
export const TURN_CELL_STATE = "TURN_CELL_STATE";

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

export type BoardAction =
  | ReconfigureBoardAction
  | RevealCellAction
  | TurnCellStateAction
  | {
      type: Exclude<
        string,
        typeof RECONFIGURE_BOARD | typeof REVEAL_CELL | typeof TURN_CELL_STATE
      >;
      [paramName: string]: any;
    };
