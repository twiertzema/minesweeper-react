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
 * - mineCount: number
 * - hasMine: boolean
 * - state: CELL_STATE
 */
export default class CellComponent extends React.Component {
    constructor(props) {
        super(props);

        this._handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        const { x, y, mineCount, hasMine, onClick } = this.props;
        if (evt.button === 0) {
            // Left click
            // TODO: If hasMine, enter lose state; else, reveal cell.
            console.log(`Cell clicked: ${JSON.stringify(this.props)}`);
            onClick(x, y);
        } else if (evt.button === 2) {
            // Right click
            // TODO: Cycle cell state.
            console.log(`Cell state changed: ${JSON.stringify(this.props)}`);
        }
    }

    render() {
        const { state, mineCount, hasMine } = this.props;
        let cellClassName = styles.cell;
        let content = null;

        switch (state) {
            case CELL_STATE.FLAGGED:
                content = "F";
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
            <td className={cellClassName} onClick={this._handleClick} draggable={false}>
                {content}
            </td>
        );
    }
}