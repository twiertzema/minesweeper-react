import React from "react";

import { CELL_STATE } from "../logic/board";
import styles from "./cell.css";

/**
 * Expects the following props:
 * - x: number
 * - y: number
 * - mineCount: number
 */
export default class CellComponent extends React.Component {
    constructor(props) {
        super(props);

        this._handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        const { x, y, mineCount, hasMine } = this.props;
        if (evt.button === 0) {
            // Left click
            // TODO: If hasMine, enter lose state; else, reveal cell.
            console.log(`Cell clicked: ${JSON.stringify(this.props)}`);
        } else if (evt.button === 2) {
            // Right click
            // TODO: Cycle cell state.
            console.log(`Cell state changed: ${JSON.stringify(this.props)}`);
        }
    }

    render() {
        return (
            <td className={styles.cell} onClick={this._handleClick} draggable={false}>
                { /* TODO: Add conditional logic to reflect state. */ }
            </td>
        );
    }
}