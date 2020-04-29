/* eslint-env jest */
import {
  getSeededBoard,
  printBoard,
  restoreRandom,
  seedRandom,
} from "../../../utils/test.utils";

import {
  CELL_STATE,
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_EXPERT,
  CONFIG_INTERMEDIATE,
  GAME_STATE,
} from "../../lib/constants";
import { OutOfBoundsError, getBoard } from "../../lib/utils";

import {
  BoardState,
  init,
  reconfigureBoard,
  reducer,
  revealCell,
  turnCellState,
} from "./index";
import { MinesweeperBoard, MinesweeperConfig } from "../../types";

const expectBlankBoard = (
  board: MinesweeperBoard,
  config: MinesweeperConfig
) => {
  for (let j = 0; j < config.y; j++) {
    for (let i = 0; i < config.x; i++) {
      expect(board?.[j]?.[i]).toEqual({
        hasMine: false,
        mineCount: 0,
        state: CELL_STATE.DEFAULT,
      });
    }
  }
};

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();
});

it("should have a default value", () => {
  const action = { type: "bogus_action" };
  const result = reducer(undefined as any, action as any);
  expect(result).toEqual({
    board: getBoard(CONFIG_DEFAULT),
    config: CONFIG_DEFAULT,
    gameState: GAME_STATE.DEFAULT,
  });
});

it("should return the current state if action type is unrecognized", () => {
  const stateBefore = init(CONFIG_DEFAULT);
  const action = {
    type: "bogus_action",
  };
  const result = reducer(stateBefore, action as any);
  expect(result).toBe(stateBefore);
});

describe("RECONFIGURE_BOARD", () => {
  it("should configure for CONFIG_DEFAULT", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_DEFAULT);
    const result = reducer(stateBefore, action);
    expect(result).toEqual({
      ...stateBefore,
      board: [],
      config: CONFIG_DEFAULT,
    });
  });

  it("should configure for CONFIG_EASY", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_EASY);
    const result = reducer(stateBefore, action);

    expectBlankBoard(result.board, CONFIG_EASY);
  });

  it("should configure for CONFIG_INTERMEDIATE", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_INTERMEDIATE);
    const result = reducer(stateBefore, action);

    expectBlankBoard(result.board, CONFIG_INTERMEDIATE);
  });

  it("should configure for CONFIG_EXPERT", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_EXPERT);
    const result = reducer(stateBefore, action);

    expectBlankBoard(result.board, CONFIG_EXPERT);
  });
});

describe("REVEAL_CELL", () => {
  /**
   * Convenience function to construct and enacta `BoardState` that is won.
   */
  function getWonState(): BoardState {
    const board = getSeededBoard(CONFIG_EASY);

    for (const row of board) {
      for (const cell of row) {
        // Reveal every non-mine cell.
        if (!cell.hasMine) cell.state = CELL_STATE.REVEALED;
      }
    }

    const actionX = 0;
    const actionY = 4;

    // Unreveal the cell to be revealed.
    board[actionY][actionX].state = CELL_STATE.DEFAULT;

    const stateBefore = {
      ...init(CONFIG_EASY),
      board,
      gameState: GAME_STATE.SEEDED,
    };
    const action = revealCell(actionX, actionY);
    return reducer(stateBefore, action);
  }

  it("should throw an error for a default board", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = revealCell(0, 0);

    expect(() => reducer(stateBefore, action)).toThrow(OutOfBoundsError);
  });

  it("should throw an error for crazy coordinates", () => {
    const stateBefore = init(CONFIG_EASY);

    expect(() => reducer(stateBefore, revealCell(-1, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(0, -1))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(CONFIG_EASY.x, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(0, CONFIG_EASY.y))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(NaN, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(0, NaN))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(Infinity, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, revealCell(0, Infinity))).toThrow(
      OutOfBoundsError
    );
  });

  it("should seed if in DEFAULT gameState", () => {
    const stateBefore = init(CONFIG_EASY);
    const action = revealCell(0, 0);

    // First, ensure the default board doesn't have any mines.
    for (const row of stateBefore.board) {
      for (const cell of row) {
        expect(cell.hasMine).toBe(false);
      }
    }

    // Then ensure revealing a cell places the mines.
    const result = reducer(stateBefore, action as any);

    // Finally, expect that at least one mine has been placed.
    expect(result.board[2][0].hasMine).toBe(true);
  });

  it("should do nothing if the cell is already revealed", () => {
    const stateBefore = init(CONFIG_EASY);
    const actionX = 0;
    const actionY = 0;
    stateBefore.board[actionY][actionX].state = CELL_STATE.REVEALED;

    const action = revealCell(actionX, actionY);
    const result = reducer(stateBefore, action);
    expect(result).toBe(stateBefore);
  });

  it("should go to LOSE gameState if a mine is revealed", () => {
    const initState = init(CONFIG_EASY);
    const seedingAction = revealCell(0, 0);
    const seededState = reducer(initState, seedingAction);

    const loseAction = revealCell(0, 2);
    const result = reducer(seededState, loseAction);
    expect(result.gameState).toBe(GAME_STATE.LOSE);
  });

  it("should chord if a 0 is revealed", () => {
    const stateBefore = init(CONFIG_EASY);
    const action = revealCell(0, 0);
    const result = reducer(stateBefore, action);

    // Manually assert the state of each cell.
    for (let j = 0; j < result.board.length; j++) {
      const row = result.board[j];

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (j < 2) {
          // The first 2 rows should be entirely revealed.
          expect(cell.state).toBe(CELL_STATE.REVEALED);
        } else if (j === 2) {
          if (i < 4) expect(cell.state).toBe(CELL_STATE.DEFAULT);
          else expect(cell.state).toBe(CELL_STATE.REVEALED);
        } else if (j === 3) {
          if (i < 6) expect(cell.state).toBe(CELL_STATE.DEFAULT);
          else expect(cell.state).toBe(CELL_STATE.REVEALED);
        } else {
          expect(cell.state).toBe(CELL_STATE.DEFAULT);
        }
      }
    }
  });

  it("should just reveal the specified cell if not a mine or a 0", () => {
    const stateBefore = init(CONFIG_EASY);
    const actionX = 0;
    const actionY = 1;
    const action = revealCell(actionX, actionY);
    const result = reducer(stateBefore, action);

    result.board.forEach((row, j) =>
      row.forEach((cell, i) => {
        if (i == actionX && j == actionY) {
          // The specified cell should be revealed.
          expect(cell.state).toBe(CELL_STATE.REVEALED);
        } else {
          // All other cells should be default.
          expect(cell.state).toBe(CELL_STATE.DEFAULT);
        }
      })
    );
  });

  it("should flag all mines go to WIN if all non-mine cells are revealed", () => {
    const result = getWonState();

    expect(result.gameState).toBe(GAME_STATE.WIN);
  });

  it("should flag all mines if all non-mine cells are revealed", () => {
    const result = getWonState();

    for (const row of result.board) {
      for (const cell of row) {
        if (cell.hasMine) expect(cell.state).toBe(CELL_STATE.FLAGGED);
      }
    }
  });
});

// TODO: TURN_CELL_STATE
describe("TURN_CELL_STATE", () => {
  it("should change cell state from DEFAULT to FLAGGED", () => {
    const board = getSeededBoard(CONFIG_EASY);

    const stateBefore = {
      ...init(CONFIG_EASY),
      board,
      gameState: GAME_STATE.SEEDED,
    };
    const actionX = 0;
    const actionY = 4;

    // Make sure the target cell is in the DEFAULT state.
    expect(stateBefore.board[actionY][actionX].state).toBe(CELL_STATE.DEFAULT);

    const action = turnCellState(actionX, actionY);
    const result = reducer(stateBefore, action);

    expect(result.board[actionY][actionX].state).toBe(CELL_STATE.FLAGGED);
  });

  it("should change cell state from FLAGGED to QUESTIONED", () => {
    const actionX = 0;
    const actionY = 4;

    const board = getSeededBoard(CONFIG_EASY);
    board[actionY][actionX].state = CELL_STATE.FLAGGED;

    const stateBefore = {
      ...init(CONFIG_EASY),
      board,
      gameState: GAME_STATE.SEEDED,
    };

    const action = turnCellState(actionX, actionY);
    const result = reducer(stateBefore, action);

    expect(result.board[actionY][actionX].state).toBe(CELL_STATE.QUESTIONED);
  });

  it("should change cell state from QUESTIONED to DEFAULT", () => {
    const actionX = 0;
    const actionY = 4;

    const board = getSeededBoard(CONFIG_EASY);
    board[actionY][actionX].state = CELL_STATE.QUESTIONED;

    const stateBefore = {
      ...init(CONFIG_EASY),
      board,
      gameState: GAME_STATE.SEEDED,
    };

    const action = turnCellState(actionX, actionY);
    const result = reducer(stateBefore, action);

    expect(result.board[actionY][actionX].state).toBe(CELL_STATE.DEFAULT);
  });

  it("should do nothing if the cell is REVEALED", () => {
    const actionX = 0;
    const actionY = 0;

    const board = getSeededBoard(CONFIG_EASY);
    board[actionY][actionX].state = CELL_STATE.REVEALED;

    const stateBefore = {
      ...init(CONFIG_EASY),
      board,
      gameState: GAME_STATE.SEEDED,
    };

    const action = turnCellState(actionX, actionY);
    const result = reducer(stateBefore, action);

    expect(result).toBe(stateBefore);
  });

  it("should throw an error for crazy coordinates", () => {
    const stateBefore = init(CONFIG_EASY);

    expect(() => reducer(stateBefore, turnCellState(-1, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(0, -1))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(CONFIG_EASY.x, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(0, CONFIG_EASY.y))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(NaN, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(0, NaN))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(Infinity, 0))).toThrow(
      OutOfBoundsError
    );
    expect(() => reducer(stateBefore, turnCellState(0, Infinity))).toThrow(
      OutOfBoundsError
    );
  });
});
