import { MinesweeperBoard, MinesweeperConfig } from "../../types";
import {
  RECONFIGURE_BOARD,
  REVEAL_CELL,
  TURN_CELL_STATE,
  BoardAction,
  ReconfigureBoardAction,
  RevealCellAction,
  TurnCellStateAction,
} from "./types";
import {
  chordCells,
  determineBoardState,
  flagAllMines,
  getBoard,
  placeMines,
  OutOfBoundsError,
} from "../../lib/utils";
import { CELL_STATE, GAME_STATE } from "../../lib/constants";

export interface BoardState {
  board: MinesweeperBoard;
  config: MinesweeperConfig;
  gameState: GAME_STATE;
}

/** Action creator for `RECONFIGURE_BOARD`. */
export const reconfigureBoard = (
  configuration: MinesweeperConfig
): ReconfigureBoardAction => {
  return {
    type: RECONFIGURE_BOARD,
    configuration,
  };
};

/** Action creator for `REVEAL_CELL`. */
export const revealCell = (x: number, y: number): RevealCellAction => {
  return {
    type: REVEAL_CELL,
    x,
    y,
  };
};

/** Action creator for `TURN_CELL_STATE`. */
export const turnCellState = (x: number, y: number): TurnCellStateAction => {
  return {
    type: TURN_CELL_STATE,
    x,
    y,
  };
};

/**
 * Merges an update into the specified {@link MinesweeperCell} in a {@link MinesweeperBoard}.
 * @returns {MinesweeperBoard} A _new_ board.
 * @throws {OutOfBoundsError}
 */
export const modifyCell = (
  board: MinesweeperBoard,
  x: number,
  y: number,
  mod: Object
): MinesweeperBoard => {
  if (!board[y]?.[x]) throw new OutOfBoundsError(x, y);
  return board.map((row, j) => {
    if (j !== y) return row;
    return row.map((cell, i) => {
      if (i !== x) return cell;
      return {
        ...cell,
        ...mod,
      };
    });
  });
};

/** Creates a fresh `BoardState` from the provided `MinesweeperConfig`. */
export const init = (config: MinesweeperConfig): BoardState => ({
  board: getBoard(config),
  config,
  gameState: GAME_STATE.DEFAULT,
});

export function reducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case RECONFIGURE_BOARD:
      return init(action.configuration);

    case REVEAL_CELL: {
      const { x, y } = action;

      let newBoard = modifyCell(state.board, x, y, {
        state: CELL_STATE.REVEALED,
      });
      if (state.gameState === GAME_STATE.DEFAULT) {
        // Seed the board.
        // TODO: It would be great if this happened somewhere else so this
        //  reducer remained idempotent.
        placeMines(state.config, newBoard, x, y);
      }

      const cell = newBoard[y][x];
      if (cell.mineCount === 0) {
        // Cell chording.
        chordCells(state.config, newBoard, x, y);
      }

      // If a mine was just revealed, we can short-circuit the determination of
      //  the game state.
      const newState = cell.hasMine
        ? GAME_STATE.LOSE
        : determineBoardState(newBoard);

      // If the game was just won, make sure to flag all the cells.
      if (newState === GAME_STATE.WIN) {
        flagAllMines(newBoard);
      }

      return {
        ...state,
        board: newBoard,
        gameState: newState,
      };
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
        board: modifyCell(state.board, x, y, { state: newState }),
      };
    }

    default:
      return state;
  }
}
