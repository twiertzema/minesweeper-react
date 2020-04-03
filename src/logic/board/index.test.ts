/* eslint-env jest */
import { restoreRandom, seedRandom } from "../../../utils/test.utils";

import {
  CELL_STATE,
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_EXPERT,
  CONFIG_INTERMEDIATE,
  GAME_STATE
} from "../../lib/constants";
import { OutOfBoundsError } from "../../lib/utils";

import { init, reconfigureBoard, reducer, revealCell } from "./index";
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
        state: CELL_STATE.DEFAULT
      });
    }
  }
};

it("should return the current state if action type is unrecognized", () => {
  const stateBefore = init(CONFIG_DEFAULT);
  const action = {
    type: "bogus_action"
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
      config: CONFIG_DEFAULT
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
  beforeEach(() => {
    seedRandom();
  });

  afterEach(() => {
    restoreRandom();
  });

  it("should throw an error for a default board", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = revealCell(0, 0);

    expect(() => reducer(stateBefore, action)).toThrow(OutOfBoundsError);
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
});

// TODO: TURN_CELL_STATE

// TODO: modifyCell
