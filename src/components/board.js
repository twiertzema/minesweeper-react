import React from "react";
import { connect } from "react-redux";

import styles from "./board.css";
import Cell from "./cell";

class BoardComponent extends React.Component {
    render() {
        const { board } = this.props;

        const boardRows = board.map((row, i) => (
            <tr key={`row_${i}`}>
                { row.map((cell, j) => <Cell key={`cell_${j}`} x={j} y={i} />) }
            </tr>
        ));

        return (
            <table className={styles.board}>
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
    }
};

export default connect(mapStateToProps)(BoardComponent);
