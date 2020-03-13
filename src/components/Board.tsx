import { ipcRenderer } from "electron";
import React, { useEffect, useReducer } from "react";

import { CONFIG_EASY, IPC_MESSAGE } from "../lib/constants";

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
    const newGameListener = (event, arg) => {
      dispatch(reconfigureBoard(state.config));
    };

    // Listen for the "new game" message from the main process.
    ipcRenderer.on(IPC_MESSAGE.NEW_GAME, newGameListener);

    return () => {
      ipcRenderer.removeListener(IPC_MESSAGE.NEW_GAME, newGameListener);
    };
  }, []);

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
                onClick={() => dispatch(revealCell(j, i))}
                onRightClick={() => dispatch(turnCellState(j, i))}
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
