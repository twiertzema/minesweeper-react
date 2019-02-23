import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { revealCell, turnCellState } from "../logic/board";

import Cell from "./Cell";

import "./Board.css";

class Board extends Component {
  render() {
    const { board, revealCell, turnCellState } = this.props;

    return (
      <table className="board">
        <tbody>
          {
            board.map((row, i) => (
              <tr key={`row_${i}`}>
                {row.map((cell, j) => (
                  <Cell
                    key={`cell_${j}`}
                    x={j}
                    y={i}
                    onClick={revealCell}
                    onRightClick={turnCellState}
                    {...cell}
                  />
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}

Board.propTypes = {
  // state
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),

  // dispatch
  revealCell: PropTypes.func.isRequired,
  turnCellState: PropTypes.func.isRequired
};

/**
 * @param {ReduxState} state
 * @return {{board: MinesweeperBoard}}
 */
const mapStateToProps = state => ({
  board: state.board
});

const mapDispatchToProps = dispatch => ({
  revealCell: (x, y) => dispatch(revealCell(x, y)),
  turnCellState: (x, y) => dispatch(turnCellState(x, y))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
