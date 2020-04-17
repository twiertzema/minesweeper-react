import React from "react";
import { ipcRenderer } from "electron";
import { act } from "react-dom/test-utils";

import {
  fireEvent,
  render,
  seedRandom,
  restoreRandom,
} from "../../utils/test.utils";

import { IPC_MESSAGE } from "../lib/constants";

import Game from "./Game";

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();
});

const TEST_ID = "test-game";

it("should render", () => {
  render(<Game data-test-id={TEST_ID} />);

  const testGame = document.querySelector(`[data-test-id="${TEST_ID}"]`);
  expect(testGame).toBeTruthy();
});

it('should reset on "new game"', () => {
  render(<Game data-test-id={TEST_ID} />);

  const testGame = document.querySelector(`[data-test-id="${TEST_ID}"]`);
  expect(testGame).toBeTruthy();

  const cell = document.querySelector(".cell");
  if (!cell) throw new Error("No cells!");

  seedRandom(1337);

  fireEvent.click(cell);

  // Make sure there are revealed cells before we reconfigure the board.
  const revealedCells = document.querySelectorAll(".revealed");
  expect(revealedCells.length).toBe(53);

  act(() => {
    ipcRenderer.send(IPC_MESSAGE.NEW_GAME);
  });

  expect(document.querySelectorAll(".revealed").length).toBe(0);
});
