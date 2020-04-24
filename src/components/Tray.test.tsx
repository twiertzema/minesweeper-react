import React from "react";

import { render, restoreRandom, seedRandom } from "../../utils/test.utils";

import {
  CELL_STATE,
  CONFIG_DEFAULT,
  CONFIG_EASY,
  GAME_STATE,
} from "../lib/constants";
import { getBoard, placeMines } from "../lib/utils";
import { MinesweeperBoard } from "../types";

import { Tray } from "./Tray";

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();
});

describe("Tray", () => {
  const MINES_LEFT_ID = "test-mines-left";
  const SECONDS_ID = "test-seconds";

  function renderMineCount(board: MinesweeperBoard, gameState: GAME_STATE) {
    return render(
      <Tray board={board} gameState={GAME_STATE.DEFAULT}>
        {({ minesLeft }) => <p data-testid={MINES_LEFT_ID}>{minesLeft}</p>}
      </Tray>
    );
  }

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

  it("should count how many mines there are", () => {
    const board = placeMines(CONFIG_EASY, getBoard(CONFIG_EASY), 0, 0);

    const { getByTestId } = renderMineCount(board, GAME_STATE.DEFAULT);

    const result = getByTestId(MINES_LEFT_ID);
    expect(result.innerHTML).toBe(String(CONFIG_EASY.mines));
  });

  it("should substract flags from mines left", () => {
    const board = placeMines(CONFIG_EASY, getBoard(CONFIG_EASY), 0, 0);

    // Flag a couple of cells.
    board[0][0].state = CELL_STATE.FLAGGED;
    board[0][1].state = CELL_STATE.FLAGGED;

    const { getByTestId } = renderMineCount(board, GAME_STATE.DEFAULT);

    const result = getByTestId(MINES_LEFT_ID);
    expect(result.innerHTML).toBe(String(CONFIG_EASY.mines - 2));
  });
});
