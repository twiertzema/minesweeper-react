import React, { useReducer } from "react";

import { CONFIG_EASY } from "../lib/constants";

import {
  init,
  reducer as boardReducer,
  revealCell,
  turnCellState
} from "../logic/board";

import Cell from "./Cell";

import styles from "./Board.css";

export default () => {
  const [state, dispatch] = useReducer(boardReducer, CONFIG_EASY, init);

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
