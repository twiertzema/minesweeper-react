import { MinesweeperBoard, MinesweeperConfig } from "../../types";
import {
  RECONFIGURE_BOARD,
  REVEAL_CELL,
  TURN_CELL_STATE,
  BoardAction,
  ReconfigureBoardAction,
  RevealCellAction,
  TurnCellStateAction
} from "./types";
import {
  cascadeCells,
  getBoard,
  placeMines,
  OutOfBoundsError
} from "../../lib/utils";
import { CELL_STATE } from "../../lib/constants";

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
export const reconfigureBoard = (
  configuration: MinesweeperConfig
): ReconfigureBoardAction => {
  return {
    type: RECONFIGURE_BOARD,
    configuration
  };
};

/**
 * Action creator for `REVEAL_CELL`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const revealCell = (x: number, y: number): RevealCellAction => {
  return {
    type: REVEAL_CELL,
    x,
    y
  };
};

/**
 * Action creator for `TURN_CELL_STATE`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const turnCellState = (x: number, y: number): TurnCellStateAction => {
  return {
    type: TURN_CELL_STATE,
    x,
    y
  };
};

/**
 * Merges an update into the specified {@link MinesweeperCell} in a {@link MinesweeperBoard}.
 * @param {MinesweeperBoard} board
 * @param {number} x
 * @param {number} y
 * @param {Object} mod
 * @returns {MinesweeperBoard} A _new_ board.
 * @throws {OutOfBoundsError}
 */
export const modifyCell = (
  board: MinesweeperBoard,
  x: number,
  y: number,
  mod: Object
): MinesweeperBoard => {
  if (!board[y][x]) throw new OutOfBoundsError(x, y);
  return board.map((row, j) => {
    if (j !== y) return row;
    return row.map((cell, i) => {
      if (i !== x) return cell;
      return {
        ...cell,
        ...mod
      };
    });
  });
};

export const init = (config: MinesweeperConfig): BoardState => ({
  seeded: false,
  config,
  board: getBoard(config)
});

export function reducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case RECONFIGURE_BOARD:
      return init(action.configuration);

    case REVEAL_CELL: {
      const { x, y } = action;

      let newBoard = modifyCell(state.board, x, y, {
        state: CELL_STATE.REVEALED
      });
      if (!state.seeded) {
        // TODO: Split this out into a different action so this one is idempotent.
        placeMines(state.config, newBoard, x, y);
      }

      const cell = newBoard[y][x];
      if (cell.mineCount === 0 && !cell.hasMine) {
        // Cell cascade.
        cascadeCells(state.config, newBoard, x, y);
        return {
          ...state,
          seeded: true,
          board: newBoard
        };
      } else {
        return {
          ...state,
          seeded: true,
          board: newBoard
        };
      }
    }

    case TURN_CELL_STATE: {
      const { x, y } = action;
      const cell = state.board[y][x];

      if (cell.state === CELL_STATE.REVEALED) return state;

      let newState = CELL_STATE.DEFAULT;

      switch (cell.state) {
        case CELL_STATE.DEFAULT:
          newState = CELL_STATE.FLAGGED;
          break;
        case CELL_STATE.FLAGGED:
          // Check if question is enabled.
          newState = CELL_STATE.QUESTIONED;
          break;
        case CELL_STATE.QUESTIONED:
          newState = CELL_STATE.DEFAULT;
          break;
        default:
          break;
      }

      return {
        ...state,
        board: modifyCell(state.board, action.x, action.y, { state: newState })
      };
    }

    default:
      return state;
  }
}
