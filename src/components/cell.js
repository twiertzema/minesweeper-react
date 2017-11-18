import React from "react";
import classnames from "classnames";

import { CELL_STATE } from "../logic/board";
import styles from "./cell.css";

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
                content = hasMine ? 'X' : mineCount;
                // TODO: Change font color based on mineCount.
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