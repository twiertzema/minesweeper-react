import { ipcRenderer } from "electron";
import React, { useReducer, useEffect, HTMLAttributes } from "react";

import { CONFIG_EASY, IPC_MESSAGE, GAME_STATE } from "../lib/constants";

import {
  init,
  reducer as boardReducer,
  reconfigureBoard,
  revealCell,
  turnCellState
} from "../logic/board";

import Board from "./Board";
import Tray from "./Tray";

const Game: React.FC<HTMLAttributes<HTMLElement>> = (props) => {
  const [state, dispatch] = useReducer(boardReducer, CONFIG_EASY, init);

  useEffect(() => {
    const newGameListener = () => {
      dispatch(reconfigureBoard(state.config));
    };

    // Listen for the "new game" message from the main process.
    ipcRenderer.on(IPC_MESSAGE.NEW_GAME, newGameListener);

    return () => {
      ipcRenderer.removeListener(IPC_MESSAGE.NEW_GAME, newGameListener);
    };
  }, []);

  return (
    <Tray {...props} board={state.board} gameState={state.gameState}>
      <Board
        board={state.board}
        gameState={state.gameState}
        revealCell={(x, y) => dispatch(revealCell(x, y))}
        turnCellState={(x, y) => dispatch(turnCellState(x, y))}
      />
    </Tray>
  );
};

export default Game