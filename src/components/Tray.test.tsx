import React from "react";
import { act } from "react-dom/test-utils";

import {
  getSeededBoard,
  render,
  restoreRandom,
  seedRandom,
} from "../../utils/test.utils";

import {
  CELL_STATE,
  CONFIG_DEFAULT,
  CONFIG_EASY,
  GAME_STATE,
} from "../lib/constants";
import { getBoard, placeMines } from "../lib/utils";
import { MinesweeperBoard } from "../types";

import { Tray } from "./Tray";

jest.useFakeTimers();

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();

  jest.clearAllTimers();
});

describe("Tray", () => {
  const MINES_LEFT_ID = "test-mines-left";
  const SECONDS_ID = "test-seconds";

  /** Test component to just render the value of `minesLeft`. */
  const TestMinesLeft: React.FC<{
    board: MinesweeperBoard;
    gameState: GAME_STATE;
  }> = ({ board, gameState, ...props }) => (
    <Tray board={board} gameState={gameState}>
      {({ minesLeft }) => (
        <p {...props} data-testid={MINES_LEFT_ID}>
          {minesLeft}
        </p>
      )}
    </Tray>
  );

  /** Test component to just render the value of `seconds`. */
  const TestSeconds: React.FC<{
    board: MinesweeperBoard;
    gameState: GAME_STATE;
  }> = ({ board, gameState, ...props }) => (
    <Tray board={board} gameState={gameState}>
      {({ seconds }) => (
        <p {...props} data-testid={SECONDS_ID}>
          {seconds}
        </p>
      )}
    </Tray>
  );

  it("should render", () => {
    render(
      <Tray board={getBoard(CONFIG_DEFAULT)} gameState={GAME_STATE.DEFAULT}>
        {() => null}
      </Tray>
    );
  });

  it("should set proper default render prop props", () => {
    render(
      <Tray board={getBoard(CONFIG_DEFAULT)} gameState={GAME_STATE.DEFAULT}>
        {({ gameState, minesLeft, seconds }) => {
          expect(gameState).toBe(GAME_STATE.DEFAULT);
          expect(minesLeft).toBe(0);
          expect(seconds).toBe(0);

          return null;
        }}
      </Tray>
    );
  });

  describe("minesLeft", () => {
    it("should count how many mines there are", () => {
      const board = getSeededBoard(CONFIG_EASY);

      const { getByTestId } = render(
        <TestMinesLeft board={board} gameState={GAME_STATE.DEFAULT} />
      );

      const result = getByTestId(MINES_LEFT_ID);
      expect(result.innerHTML).toBe(String(CONFIG_EASY.mines));
    });

    it("should substract flags from mines left", () => {
      const board = getSeededBoard(CONFIG_EASY);

      // Flag a couple of cells.
      board[0][0].state = CELL_STATE.FLAGGED;
      board[0][1].state = CELL_STATE.FLAGGED;

      const { getByTestId } = render(
        <TestMinesLeft board={board} gameState={GAME_STATE.DEFAULT} />
      );

      const result = getByTestId(MINES_LEFT_ID);
      expect(result.innerHTML).toBe(String(CONFIG_EASY.mines - 2));
    });

    it("should be set to 0 when the game is won", () => {
      const board = getSeededBoard(CONFIG_EASY);

      const { getByTestId, rerender } = render(
        <TestMinesLeft board={board} gameState={GAME_STATE.SEEDED} />
      );

      // First, make sure `minesLeft` is non-zero.
      expect(getByTestId(MINES_LEFT_ID).innerHTML).toBe(
        String(CONFIG_EASY.mines)
      );

      // Then simply set the state to WIN.
      rerender(<TestMinesLeft board={board} gameState={GAME_STATE.WIN} />);

      // And make sure `minesLeft` was set to 0.
      expect(getByTestId(MINES_LEFT_ID).innerHTML).toBe(String(0));
    });
  });

  describe("seconds", () => {
    /**
     * Convenience function to render the `Tray` and ensure the timer has
     *  started.
     */
    function expectBaselineSecondsFunctionality(
      board: MinesweeperBoard,
      gameState: GAME_STATE
    ) {
      const renderResult = render(
        <TestSeconds board={board} gameState={gameState} />
      );

      // For sanity.
      expect(renderResult.getByText("0")).toBeDefined();

      act(() => {
        // Advance timers by 1 second.
        jest.advanceTimersByTime(1000);
      });

      // Verify the seconds were incremented.
      expect(renderResult.getByText("1")).toBeDefined();

      return renderResult;
    }

    it("should count seconds when the board is seeded", () => {
      const board = getSeededBoard(CONFIG_EASY);
      expectBaselineSecondsFunctionality(board, GAME_STATE.SEEDED);
    });

    it("should stop the timer if >= 999", () => {
      const board = getSeededBoard(CONFIG_EASY);
      const { getByText } = expectBaselineSecondsFunctionality(
        board,
        GAME_STATE.SEEDED
      );

      act(() => {
        // Shoot that timer to exactly 999.
        jest.advanceTimersByTime(999 * 1000);
      });

      expect(getByText("999")).toBeDefined();

      act(() => {
        // Advance one more second...
        jest.advanceTimersByTime(1000);
      });

      // And make sure the seconds haven't been incrememnted.
      expect(getByText("999")).toBeDefined();
    });

    it("should stop the timer if the game is lost", () => {
      const board = getSeededBoard(CONFIG_EASY);
      const { getByText, rerender } = expectBaselineSecondsFunctionality(
        board,
        GAME_STATE.SEEDED
      );

      // Re-render with the "lose" state.
      rerender(<TestSeconds board={board} gameState={GAME_STATE.LOSE} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // The timer should be stopped at "1".
      expect(getByText("1")).toBeDefined();
    });

    it("should stop the timer if the game is won", () => {
      const board = getSeededBoard(CONFIG_EASY);
      const { getByText, rerender } = expectBaselineSecondsFunctionality(
        board,
        GAME_STATE.SEEDED
      );

      // Re-render with the "lose" state.
      rerender(<TestSeconds board={board} gameState={GAME_STATE.WIN} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // The timer should be stopped at "1".
      expect(getByText("1")).toBeDefined();
    });
  });
});
