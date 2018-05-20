import React, { Component } from 'react';
import { connect } from 'react-redux';

import { revealCell, turnCellState } from '../logic/board';

import Cell from './cell';

import styles from './board.css';

class BoardComponent extends Component {
  render() {
    const { board, onCellClick, onCellRightClick } = this.props;

    const boardRows = board.map((row, i) => (
      <tr key={`row_${i}`}>
        {
          row.map((cell, j) => (
            <Cell key={`cell_${j}`}
              x={j}
              y={i}
              onClick={onCellClick}
              onRightClick={onCellRightClick}
              {...cell}
            />
          ))
        }
      </tr>
    ));

    return (
      <table className='board'>
        <tbody>
          {boardRows}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (x, y) => dispatch(revealCell(x, y)),
    onCellRightClick: (x, y) => dispatch(turnCellState(x, y))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardComponent);
