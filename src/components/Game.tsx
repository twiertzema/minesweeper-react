import { ipcRenderer } from "electron";
import React, { useReducer, useEffect, HTMLAttributes } from "react";
import { castDraft } from "immer";

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
import { IPC_MESSAGE } from "../electron";
import { MinesweeperConfig } from "../types";

import Board from "./Board";
import Tray from "./Tray";

export interface GameProps extends HTMLAttributes<HTMLElement> {
  initialConfig?: MinesweeperConfig;
}

const Game: React.FC<GameProps> = ({ initialConfig, ...props }) => {
  const [state, dispatch] = useReducer(
    boardReducer,
    initialConfig ?? CONFIG_EASY,
    init
  );

  useEffect(() => {
    // If the provided `config` is different than the current one, reconfigures
    //  the board.
    function changeConfig(config: MinesweeperConfig) {
      // This won't catch duplicate custom configs, but that's probably fine.
      if (state.config !== config) {
        dispatch(reconfigureBoard(config));
      }
    }

    // Set up listeners for IPC channels from the main process.
    const beginnerListener = () => changeConfig(CONFIG_EASY);
    const expertListener = () => changeConfig(CONFIG_EXPERT);
    const intermediateListener = () => changeConfig(CONFIG_INTERMEDIATE);
    const newGameListener = () => dispatch(reconfigureBoard(state.config));

    ipcRenderer.on(IPC_MESSAGE.DIFFICULTY_BEGINNER, beginnerListener);
    ipcRenderer.on(IPC_MESSAGE.DIFFICULTY_EXPERT, expertListener);
    ipcRenderer.on(IPC_MESSAGE.DIFFICULTY_INTERMEDIATE, intermediateListener);
    ipcRenderer.on(IPC_MESSAGE.NEW_GAME, newGameListener);

    return () => {
      ipcRenderer.removeListener(
        IPC_MESSAGE.DIFFICULTY_BEGINNER,
        beginnerListener
      );
      ipcRenderer.removeListener(IPC_MESSAGE.DIFFICULTY_EXPERT, expertListener);
      ipcRenderer.removeListener(
        IPC_MESSAGE.DIFFICULTY_INTERMEDIATE,
        intermediateListener
      );
      ipcRenderer.removeListener(IPC_MESSAGE.NEW_GAME, newGameListener);
    };
  }, []);

  return (
    <Tray
      {...props}
      board={castDraft(state.board)}
      gameState={state.gameState}
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
