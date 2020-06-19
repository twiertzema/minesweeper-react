import React from "react";
import { ipcRenderer } from "electron";
import { act } from "react-dom/test-utils";

import {
  fireEvent,
  render,
  seedRandom,
  restoreRandom,
} from "../../utils/test.utils";

import {
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_INTERMEDIATE,
  CONFIG_EXPERT,
} from "../lib/constants";

import { IPC_MESSAGE } from "../electron";
import { MinesweeperConfig } from "../types";

import Game, { GameProps } from "./Game";

beforeEach(() => {
  seedRandom();
});

afterEach(() => {
  restoreRandom();
});

const TEST_ID = "test-game";

function setUp(props?: GameProps) {
  const testProps = render(<Game data-testid={TEST_ID} {...props} />);

  const testGame = testProps.getByTestId(TEST_ID);
  expect(testGame).toBeTruthy();

  return testProps;
}

it("should render", () => {
  setUp();
});

it("should default to EASY if no initial configuration is supplied", () => {
  setUp();

  const cells = document.querySelectorAll(".cell");
  expect(cells.length).toBe(CONFIG_EASY.x * CONFIG_EASY.y);
});

it("should accept an optional initial configuartion", () => {
  setUp({ initialConfig: CONFIG_DEFAULT });

  const cells = document.querySelectorAll(".cell");
  expect(cells.length).toBe(0);
});

describe("The 'New Game' IPC channel", () => {
  it('should reset on "new game"', () => {
    setUp();

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

  it("should be cleaned up on unmounting", () => {
    const { unmount } = setUp();

    // @ts-ignore
    expect(ipcRenderer._channels[IPC_MESSAGE.NEW_GAME]?.length).not.toBe(0);

    act(() => {
      unmount();
    });

    // @ts-ignore
    expect(ipcRenderer._channels[IPC_MESSAGE.NEW_GAME]?.length).toBe(0);
  });
});

// Convenience function to encaspulate the logic of testing the behavior when
//  a difficulty IPC channel gets pinged.
function difficultyTest(channel: string, config: MinesweeperConfig) {
  setUp({ initialConfig: CONFIG_DEFAULT });

  // Ensure the default configuration was used (for sanity).
  let cells = document.querySelectorAll(".cell");
  expect(cells.length).toBe(0);

  act(() => {
    ipcRenderer.send(channel);
  });

  // Verify the game was reconfigured appropriately.
  cells = document.querySelectorAll(".cell");
  expect(cells.length).toBe(config.x * config.y);
}

describe("The 'Beginner' IPC channel", () => {
  it("should reconfigure the board using the EASY configuration", () => {
    difficultyTest(IPC_MESSAGE.DIFFICULTY_BEGINNER, CONFIG_EASY);
  });

  it("should be cleaned up on unmounting", () => {
    const { unmount } = setUp({ initialConfig: CONFIG_DEFAULT });

    expect(
      // @ts-ignore
      ipcRenderer._channels[IPC_MESSAGE.DIFFICULTY_BEGINNER]?.length
    ).not.toBe(0);

    act(() => {
      unmount();
    });

    // @ts-ignore
    expect(ipcRenderer._channels[IPC_MESSAGE.DIFFICULTY_BEGINNER]?.length).toBe(
      0
    );
  });
});

describe("The 'Intermediate' IPC channel", () => {
  it("should reconfigure the board using the INTERMEDIATE configuration", () => {
    difficultyTest(IPC_MESSAGE.DIFFICULTY_INTERMEDIATE, CONFIG_INTERMEDIATE);
  });

  it("should be cleaned up on unmounting", () => {
    const { unmount } = setUp({ initialConfig: CONFIG_DEFAULT });

    expect(
      // @ts-ignore
      ipcRenderer._channels[IPC_MESSAGE.DIFFICULTY_INTERMEDIATE]?.length
    ).not.toBe(0);

    act(() => {
      unmount();
    });

    expect(
      // @ts-ignore
      ipcRenderer._channels[IPC_MESSAGE.DIFFICULTY_INTERMEDIATE]?.length
    ).toBe(0);
  });
});

describe("The 'Expert' IPC channel", () => {
  it("should reconfigure the board using the EXPERT configuration", () => {
    difficultyTest(IPC_MESSAGE.DIFFICULTY_EXPERT, CONFIG_EXPERT);
  });

  it("should be cleaned up on unmounting", () => {
    const { unmount } = setUp({ initialConfig: CONFIG_DEFAULT });

    expect(
      // @ts-ignore
      ipcRenderer._channels[IPC_MESSAGE.DIFFICULTY_EXPERT]?.length
    ).not.toBe(0);

    act(() => {
      unmount();
    });

    expect(
      // @ts-ignore
      ipcRenderer._channels[IPC_MESSAGE.DIFFICULTY_EXPERT]?.length
    ).toBe(0);
  });
});
