import { ipcRenderer } from "electron";
import React, { useReducer, useEffect, HTMLAttributes } from "react";
import { castDraft } from "immer";

import assert from "../lib/assert";
import {
  CONFIG_EASY,
  CONFIG_INTERMEDIATE,
  CONFIG_EXPERT,
} from "../lib/constants";
import {
  init,
  reducer as boardReducer,
  reconfigureBoard,
  revealCell,
  turnCellState,
} from "../logic/board";
import { IPC_CHANNEL_MAIN, IPC_CHANNEL_RENDERER } from "../electron";
import { MinesweeperConfig } from "../types";

import Board from "./Board";
import Tray from "./Tray";

const TRAY_ID = "minesweeper-game-tray";

export interface GameProps extends HTMLAttributes<HTMLElement> {
  initialConfig?: MinesweeperConfig;
}

const Game: React.FC<GameProps> = ({ initialConfig, ...props }) => {
  const [state, dispatch] = useReducer(
    boardReducer,
    initialConfig ?? CONFIG_EASY,
    init
  );

  function changeDifficulty(config: MinesweeperConfig) {
    // Change the game's underlying configuration.
    dispatch(reconfigureBoard(config));

    // Then resize the application window based on the new content size.
    const trayElement = document.getElementById(TRAY_ID);
    assert(trayElement);

    const windowRect = trayElement.getBoundingClientRect();

    // Send the message to the main process to resize the application window.
    // - We need to let the main process handle this (as opposed to importing
    //   `remote`) because Electron doesn't take the application menu into
    //   account when setting the content size.
    ipcRenderer.send(
      IPC_CHANNEL_MAIN.RESIZE_WINDOW,
      windowRect.width,
      windowRect.height
    );
  }

  useEffect(() => {
    // Set up listeners for IPC channels from the main process.
    const beginnerListener = () => changeDifficulty(CONFIG_EASY);
    const expertListener = () => changeDifficulty(CONFIG_EXPERT);
    const intermediateListener = () => changeDifficulty(CONFIG_INTERMEDIATE);
    const newGameListener = () => dispatch(reconfigureBoard(state.config));

    ipcRenderer.on(IPC_CHANNEL_RENDERER.DIFFICULTY_BEGINNER, beginnerListener);
    ipcRenderer.on(IPC_CHANNEL_RENDERER.DIFFICULTY_EXPERT, expertListener);
    ipcRenderer.on(
      IPC_CHANNEL_RENDERER.DIFFICULTY_INTERMEDIATE,
      intermediateListener
    );
    ipcRenderer.on(IPC_CHANNEL_RENDERER.NEW_GAME, newGameListener);

    return () => {
      ipcRenderer.removeListener(
        IPC_CHANNEL_RENDERER.DIFFICULTY_BEGINNER,
        beginnerListener
      );
      ipcRenderer.removeListener(
        IPC_CHANNEL_RENDERER.DIFFICULTY_EXPERT,
        expertListener
      );
      ipcRenderer.removeListener(
        IPC_CHANNEL_RENDERER.DIFFICULTY_INTERMEDIATE,
        intermediateListener
      );
      ipcRenderer.removeListener(
        IPC_CHANNEL_RENDERER.NEW_GAME,
        newGameListener
      );
    };
  }, []);

  return (
    <Tray
      {...props}
      board={castDraft(state.board)}
      gameState={state.gameState}
      id={TRAY_ID}
      onSmileyClick={() => dispatch(reconfigureBoard(state.config))}
    >
      <Board
        board={castDraft(state.board)}
        gameState={state.gameState}
        revealCell={(x, y) => dispatch(revealCell(x, y))}
        turnCellState={(x, y) => dispatch(turnCellState(x, y))}
      />
    </Tray>
  );
};

export default Game;
