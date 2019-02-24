import React, { useEffect, useReducer } from "react";

import {
  CONFIG_DEFAULT,
  CONFIG_EASY
} from '../lib/constants'

import {
  configureBoard,
  defaultState,
  reducer,
  revealCell,
  turnCellState
} from "../logic/board";

import Cell from "./Cell";

import "./Board.css";

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(
    () => {
      if (state.config === CONFIG_DEFAULT) {
        dispatch(configureBoard(CONFIG_EASY))
      }
    }
  );

  return (
    <table className="board">
      <tbody>
        {state.board.map((row, i) => (
          <tr key={`row_${i}`}>
            {row.map((cell, j) => (
              <Cell
                key={`cell_${j}`}
                onClick={() => dispatch(revealCell(j, i))}
                onRightClick={() => dispatch(turnCellState(j, i))}
                x={j}
                y={i}
                {...cell}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
};
