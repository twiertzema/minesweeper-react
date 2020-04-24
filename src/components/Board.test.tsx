import React from "react";

import { render, seedRandom, restoreRandom } from "../../utils/test.utils";

import { CONFIG_EASY } from "../lib/constants";
import { getBoard } from "../lib/utils";

import Board from "./Board";

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();
});

it("should render", () => {
  render(
    <Board
      board={getBoard(CONFIG_EASY)}
      revealCell={() => {}}
      turnCellState={() => {}}
    />
  );

  const table = document.getElementsByTagName("table")[0];
  expect(table).toBeTruthy();
});
