import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { CELL_STATE } from '../logic/board';
import FlagIcon from '../i/flag.png';
import './cell.css';

/**
 * @param {number} mineCount
 * @returns {string}
 */
const getCellTextColor = (mineCount) => {
  switch (mineCount) {
    case 1:
      return '#0000fe';
    case 2:
      return '#017f01';
    case 3:
      return '#fe0000';
    case 4:
      return '#010080';
    case 5:
      return '#810102';
    case 6:
      return '#007f7e';
    case 7:
      return '#fff';
    case 8:
      return '#808080';
    default:
      return '#000';
  }
};


export default class Cell extends React.Component {
  constructor(props) {
    super(props);

    this._handleClick = this.handleClick.bind(this);
    this._handleRightClick = this.handleRightClick.bind(this);
  }

  handleClick(evt) {
    const { x, y, state, mineCount, hasMine, onClick } = this.props;
    if (evt.button === 0) {
      // Left click
      // TODO: If hasMine, enter lose state; else, reveal cell.
      console.log(`Cell clicked: ${JSON.stringify(this.props)}`);
      if (state !== CELL_STATE.FLAGGED && state !== CELL_STATE.REVEALED) {
        onClick(x, y);
      }
    }
  }

  handleRightClick(evt) {
    console.log(`Cell right-clicked: ${JSON.stringify(this.props)}`);
    evt.preventDefault();

    const { x, y, onRightClick } = this.props;
    onRightClick(x, y);
    return false;
  }

  render() {
    const { state, mineCount, hasMine } = this.props;
    let cellClassName = 'cell';
    let content = null;

    switch (state) {
      case CELL_STATE.FLAGGED:
        content = <img src={FlagIcon}/>;
        cellClassName = classnames('cell', 'flagged');
        break;
      case CELL_STATE.QUESTIONED:
        content = '?';
        break;
      case CELL_STATE.REVEALED:
        if (hasMine) {
          // TODO: Show mine icon.
          content = 'X';
        } else {
          if (mineCount > 0) {
            content = <span style={{ color: getCellTextColor(mineCount) }}>{mineCount}</span>;
          }
        }
        cellClassName = classnames('cell', 'revealed');
        break;
      case CELL_STATE.DEFAULT:
      default:
        break;
    }

    return (
      <td
        className={cellClassName}
        onClick={this._handleClick}
        onContextMenu={this._handleRightClick}
        draggable={false}
      >
        {content}
      </td>
    );
  }
}

Cell.propTypes = {
  hasMine: PropTypes.bool,
  mineCount: PropTypes.number,
  onClick: PropTypes.func,
  onRightClick: PropTypes.func,
  state: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
};