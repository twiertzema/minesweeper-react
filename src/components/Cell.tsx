import React from "react";
import classnames from "classnames";

import { CELL_STATE } from "../lib/constants";
import FlagIcon from "../res/flag.png";

import styles from "./Cell.css";

const getCellTextClass = (mineCount: number): string => {
  switch (mineCount) {
    case 1:
      return styles.one;
    case 2:
      return styles.two;
    case 3:
      return styles.three;
    case 4:
      return styles.four;
    case 5:
      return styles.five;
    case 6:
      return styles.six;
    case 7:
      return styles.seven;
    case 8:
      return styles.eight;
    default:
      return "";
  }
};

type ClickHandler = (x: number, y: number) => void;

interface RenderPropProps {
  handleClick: React.MouseEventHandler;
  handleRightClick: React.MouseEventHandler;
  hasMine: boolean;
  mineCount: number;
  state: CELL_STATE;
}

type RenderProp = (props: RenderPropProps) => React.ReactNode;

interface CellProps {
  children: RenderProp;
  hasMine?: boolean;
  mineCount?: number;
  onClick?: ClickHandler;
  onRightClick?: ClickHandler;
  state?: CELL_STATE;
  x: number;
  y: number;
}

// Prop-getter to provide default values for non-required properties.
const getCellProps = (props: CellProps) => ({
  hasMine: false,
  mineCount: 0,
  onClick: () => {},
  onRightClick: () => {},
  state: CELL_STATE.DEFAULT,
  ...props
});

export class Cell extends React.Component<CellProps> {
  handleClick = (evt: React.MouseEvent) => {
    const {
      // hasMine,
      // mineCount,
      onClick,
      state,
      x,
      y
    } = getCellProps(this.props);

    if (evt.button === 0) {
      // Left click
      // TODO: If hasMine, enter lose state; else, reveal cell.
      console.log(`Cell clicked: ${JSON.stringify(this.props)}`);
      if (state !== CELL_STATE.FLAGGED && state !== CELL_STATE.REVEALED) {
        onClick(x, y);
      }
    }
  };

  handleRightClick = (evt: React.MouseEvent) => {
    evt.preventDefault();

    const { onRightClick, x, y } = getCellProps(this.props);

    onRightClick(x, y);

    return false;
  };

  render() {
    const { children, hasMine, mineCount, state } = getCellProps(this.props);

    return children({
      handleClick: this.handleClick,
      handleRightClick: this.handleRightClick,
      hasMine,
      mineCount,
      state
    });
  }
}

interface XPCellProps {
  className?: string;
  hasMine?: boolean;
  mineCount?: number;
  onClick?: ClickHandler;
  onRightClick?: ClickHandler;
  state?: CELL_STATE;
  x?: number;
  y?: number;
  [propName: string]: any;
}

// Prop-getter to provide default values for non-required properties.
const getXPCellProps = (props: XPCellProps) => ({
  hasMine: false,
  mineCount: 0,
  onClick: () => {},
  onRightClick: () => {},
  state: CELL_STATE.DEFAULT,
  x: 0,
  y: 0,
  ...props
});

export const XPCell = (props: XPCellProps) => {
  const { className, ...rest } = getXPCellProps(props);
  return (
    <Cell {...rest}>
      {(props: RenderPropProps) => {
        const {
          handleClick,
          handleRightClick,
          hasMine,
          mineCount,
          state
        } = props;

        let cellClassName = styles.cell;
        let content: React.ReactNode = null;

        switch (state) {
          case CELL_STATE.FLAGGED:
            content = <img src={FlagIcon} alt="flag" />;
            cellClassName = classnames(styles.cell, styles.flagged);
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
            cellClassName = classnames(styles.cell, styles.revealed);
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
};

export default XPCell;
