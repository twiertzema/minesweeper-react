import React, { useMemo, useReducer } from "react";

import { GAME_STATE } from "../lib/constants";

import { MinesweeperBoard } from "../types";

import Cell from "./Cell";

interface BoardProps extends React.HTMLAttributes<HTMLTableElement> {
  board: MinesweeperBoard;
  gameState: GAME_STATE;
  revealCell: (x: number, y: number) => void;
  turnCellState: (x: number, y: number) => void;
}

const Board: React.FC<BoardProps> = ({
  board,
  gameState,
  revealCell,
  style,
  turnCellState,
  ...props
}) => {
  const onCellClick = (x: number, y: number) => {
    if (gameState < GAME_STATE.LOSE) {
      // The game hasn't been won or lost yet.
      revealCell(x, y);
    }
  };

  const onCellRightClick = (x: number, y: number) => {
    if (gameState < GAME_STATE.LOSE) {
      // The game hasn't been won or lost yet.
      turnCellState(x, y);
    }
  };

  const tableStyle = useMemo(() => ({ borderSpacing: 0, ...style }), [style]);

  return (
    <table {...props} style={tableStyle}>
      <tbody>
        {board.map((row, i) => (
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

export default Board;
