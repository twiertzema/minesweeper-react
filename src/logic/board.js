import {
  cascadeCells,
  getBoard,
  placeMines,
  OutOfBoundsError
} from "../lib/utils";
import { CELL_STATE, CONFIG_DEFAULT } from "../lib/constants";

/**
 * @typedef {Object} BoardState
 * @property {MinesweeperConfig} config
 * @property {boolean} seeded
 * @property {MinesweeperBoard} board
 */

/** @type {BoardState} */
export const defaultState = {
  board: [[]],
  config: CONFIG_DEFAULT,
  seeded: false
};

export const CONFIGURE_BOARD = "CONFIGURE_BOARD";
export const REVEAL_CELL = "REVEAL_CELL";
export const TURN_CELL_STATE = "TURN_CELL_STATE";

/**
 * Action creator for `CONFIGURE_BOARD`.
 * @param {MinesweeperConfig} configuration
 * @returns {{type: string, configuration: MinesweeperConfig}}
 */
export const configureBoard = configuration => {
  return {
    type: CONFIGURE_BOARD,
    configuration
  };
};

/**
 * Action creator for `REVEAL_CELL`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const revealCell = (x, y) => {
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
export const turnCellState = (x, y) => {
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
export const modifyCell = (board, x, y, mod) => {
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

/**
 * @param {BoardState} state
 * @param {{}} action
 * @return {BoardState}
 */
export function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONFIGURE_BOARD:
      return {
        seeded: false,
        config: action.configuration,
        board: getBoard(action.configuration)
      };

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
        case CELL_STATE.REVEALED:
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
