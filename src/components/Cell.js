import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { CELL_STATE } from '../logic/board';
import FlagIcon from '../i/flag.png';
import './Cell.css';

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

export class Cell extends React.Component {
  handleClick = (evt) => {
    const {
      // hasMine,
      // mineCount,
      onClick,
      state,
      x,
      y
    } = this.props;

    if (evt.button === 0) {
      // Left click
      // TODO: If hasMine, enter lose state; else, reveal cell.
      console.log(`Cell clicked: ${JSON.stringify(this.props)}`);
      if (state !== CELL_STATE.FLAGGED && state !== CELL_STATE.REVEALED) {
        onClick(x, y);
      }
    }
  };

  handleRightClick = (evt) => {
    evt.preventDefault();

    const {
      onRightClick,
      x,
      y
    } = this.props;

    onRightClick(x, y);

    return false;
  };

  render() {
    const {
      children,
      hasMine,
      mineCount,
      state
    } = this.props;

    return (
      children({
        handleClick: this.handleClick,
        handleRightClick: this.handleRightClick,
        hasMine,
        mineCount,
        state
      })
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

export const XPCell = ({ className, ...props }) => (
  <Cell {...props}>
    {props => {
      const {
        handleClick,
        handleRightClick,
        hasMine,
        mineCount,
        state
      } = props;

      let cellClassName = 'cell';
      let content = null;

      switch (state) {
        case CELL_STATE.FLAGGED:
          content = <img src={FlagIcon} alt='flag' />;
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
          onClick={handleClick}
          onContextMenu={handleRightClick}
          draggable={false}
        >
          {content}
        </td>
      );
    }}
  </Cell>
);

XPCell.propTypes = {
  className: PropTypes.string,
  hasMine: PropTypes.bool,
  mineCount: PropTypes.number,
  onClick: PropTypes.func,
  onRightClick: PropTypes.func,
  state: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
};

XPCell.defaultProps = {
  className: undefined,
  hasMine: false,
  mineCount: 0,
  onClick: () => {},
  onRightClick: () => {},
  state: CELL_STATE.DEFAULT,
  x: 0,
  y: 0
};

export default XPCell;