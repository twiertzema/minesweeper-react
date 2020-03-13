import React from "react";
import { ipcRenderer } from "electron";
import { act } from "react-dom/test-utils";

import {
  fireEvent,
  render,
  seedRandom,
  restoreRandom
} from "../../utils/test.utils";

import { IPC_MESSAGE } from "../lib/constants";

import Board from "./Board";

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();
});

it("should render", () => {
  render(<Board />);

  const table = document.getElementsByTagName("table")[0];
  expect(table).toBeTruthy();
});

it('should reset on "new game"', () => {
  render(<Board />);

  const table = document.getElementsByTagName("table")[0];
  expect(table).toBeTruthy();

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
