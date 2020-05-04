import produce from "immer";

import {
  MinesweeperBoard,
  MinesweeperConfig,
  MinesweeperCell,
} from "../../types";
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
  revealAllMines,
  OutOfBoundsError,
} from "../../lib/utils";
import { CELL_STATE, GAME_STATE, CONFIG_DEFAULT } from "../../lib/constants";

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

/** Creates a fresh `BoardState` from the provided `MinesweeperConfig`. */
export const init = (config: MinesweeperConfig): BoardState => ({
  board: getBoard(config),
  config,
  gameState: GAME_STATE.DEFAULT,
});

/**
 * Safeguards retrieving a cell from the board.
 * @throws {OutOfBoundsError}
 * @private
 */
function _getCell(
  board: MinesweeperBoard,
  x: number,
  y: number
): MinesweeperCell {
  const cell = board[y]?.[x];
  if (!cell) throw new OutOfBoundsError(x, y);

  return cell;
}

export const reducer = produce((draft: BoardState, action: BoardAction) => {
  switch (action.type) {
    case RECONFIGURE_BOARD:
      return init(action.configuration);

    case REVEAL_CELL: {
      const { x, y } = action;

      const cell = _getCell(draft.board, x, y);

      // If the cell is already revealed, we don't need to do anything.
      if (cell.state === CELL_STATE.REVEALED) return;

      cell.state = CELL_STATE.REVEALED;

      if (draft.gameState === GAME_STATE.DEFAULT) {
        // Seed the board.
        // TODO: It would be great if this happened somewhere else so this
        //  reducer remained idempotent.
        placeMines(draft.config, draft.board, x, y);
      }

      if (cell.hasMine) {
        // X(
        draft.gameState = GAME_STATE.LOSE;

        // Reveal all the mines to hammer home the user's folly.
        revealAllMines(draft.board);
      } else {
        if (cell.mineCount === 0) {
          // Cell chording.
          chordCells(draft.config, draft.board, x, y);
        }

        // Did we win??
        draft.gameState = determineBoardState(draft.board);

        // If the game was just won, make sure to flag all the cells.
        if (draft.gameState === GAME_STATE.WIN) {
          flagAllMines(draft.board);
        }
      }
    }

    case TURN_CELL_STATE: {
      const { x, y } = action;

      const cell = _getCell(draft.board, x, y);

      if (cell.state === CELL_STATE.REVEALED) return draft;

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

      cell.state = newState;
    }
  }
}, init(CONFIG_DEFAULT));
