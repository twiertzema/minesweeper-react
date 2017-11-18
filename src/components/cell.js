import React from "react";
import classnames from "classnames";

import { CELL_STATE } from "../logic/board";
import styles from "./cell.css";

const getCellTextColor = (mineCount) => {
    switch (mineCount) {
        case 1: return "#0000fe";
        case 2: return "#017f01";
        case 3: return "#fe0000";
        case 4: return "#010080";
        case 5: return "#810102";
        case 6: return "#007f7e";
        case 7: return "#fff";
        case 8: return "#808080";
    }
    return "#0000";
};

/**
 * Expects the following props:
 * - x: number
 * - y: number
 * - onClick: function
 * - onRightClick: function
 * - mineCount: number
 * - hasMine: boolean
 * - state: CELL_STATE
 */
export default class CellComponent extends React.Component {
    constructor(props) {
        super(props);

        this._handleClick = this.handleClick.bind(this);
        this._handleRightClick = this.handleRightClick.bind(this);
    }

    handleClick(evt) {
        const { x, y, state, mineCount, hasMine, onClick } = this.props;
        console.log(`Click; which: ${evt.which}, button: ${evt.button}`);
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
        let cellClassName = styles.cell;
        let content = null;

        switch (state) {
            case CELL_STATE.FLAGGED:
                content = "F";
                cellClassName = classnames(cellClassName, styles.flagged);
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
                        content = <span style={{color: getCellTextColor(mineCount)}}>{mineCount}</span>;
                    }
                }
                cellClassName = classnames(cellClassName, styles.revealed);
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