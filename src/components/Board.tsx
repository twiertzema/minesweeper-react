import { ipcRenderer } from "electron";
import React, { useEffect, useReducer } from "react";

import { CONFIG_EASY, IPC_MESSAGE, GAME_STATE } from "../lib/constants";

import {
  init,
  reducer as boardReducer,
  reconfigureBoard,
  revealCell,
  turnCellState
} from "../logic/board";

import Cell from "./Cell";

import styles from "./Board.css";

export default () => {
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

  const onCellClick = (x: number, y: number) => {
    if (state.gameState < GAME_STATE.LOSE) {
      // The game hasn't been won or lost yet.
      dispatch(revealCell(x, y))
    }
  }

  const onCellRightClick = (x: number, y: number) => {
    if (state.gameState < GAME_STATE.LOSE) {
      // The game hasn't been won or lost yet.
      dispatch(turnCellState(x, y))
    }
  }

  return (
    <table className={styles.board}>
      <tbody>
        {state.board.map((row, i) => (
          <tr key={`row_${i}`}>
            {row.map((cell, j) => (
              <Cell
                hasMine={cell.hasMine}
                key={`cell_${j}`}
                mineCount={cell.mineCount}
                onClick={() => onCellClick(j, i)}
                onRightClick={() => onCellRightClick(j, i)}
                state={cell.state}
                x={j}
                y={i}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
