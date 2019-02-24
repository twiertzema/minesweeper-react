import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { CELL_STATE } from "../lib/constants";
import FlagIcon from "../i/flag.png";
import "./Cell.css";

/**
 * @param {number} mineCount
 * @return {string}
 */
const getCellTextClass = mineCount => {
  switch (mineCount) {
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "three";
    case 4:
      return "four";
    case 5:
      return "five";
    case 6:
      return "six";
    case 7:
      return "seven";
    case 8:
      return "eight";
    default:
      return "";
  }
};

export class Cell extends React.Component {
  handleClick = evt => {
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

  handleRightClick = evt => {
    evt.preventDefault();

    const { onRightClick, x, y } = this.props;

    onRightClick(x, y);

    return false;
  };

  render() {
    const { children, hasMine, mineCount, state } = this.props;

    return children({
      handleClick: this.handleClick,
      handleRightClick: this.handleRightClick,
      hasMine,
      mineCount,
      state
    });
  }
}

Cell.propTypes = {
  hasMine: PropTypes.bool,
  mineCount: PropTypes.number,
  onClick: PropTypes.func,
  onRightClick: PropTypes.func,
  state: PropTypes.number,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};
Cell.defaultProps = {
  hasMine: false,
  mineCount: 0,
  onClick: () => {},
  onRightClick: () => {},
  state: CELL_STATE.DEFAULT
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

      let cellClassName = "cell";
      let content = null;

      switch (state) {
        case CELL_STATE.FLAGGED:
          content = <img src={FlagIcon} alt="flag" />;
          cellClassName = classnames("cell", "flagged");
          break;

        case CELL_STATE.QUESTIONED:
          content = "?";
          break;

        case CELL_STATE.REVEALED:
          if (hasMine) {
            // TODO: Show mine icon.
            content = "X";
          } else {
            if (mineCount > 0) {
              content = (
                <span className={getCellTextClass(mineCount)}>
                  {mineCount}
                </span>
              );
            }
          }
          cellClassName = classnames("cell", "revealed");
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
