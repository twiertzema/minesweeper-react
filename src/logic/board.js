const CONFIG_DEFAULT = { x: 0, y: 0, mines: 0 };
export const CONFIG_EASY = { x: 9, y: 9, mines: 10 };
export const CONFIG_INTERMEDIATE = { x: 16, y: 16, mines: 40 };
export const CONFIG_EXPERT = { x: 30, y: 16, mines: 99 };

export const CELL_STATE = {
    DEFAULT: 0,
    FLAGGED: 1,
    REVEALED: 2,
    QUESTIONED: 4
};

const initialState = {
    config: CONFIG_DEFAULT,
    board: [[]]
};

const CONFIGURE_BOARD = "CONFIGURE_BOARD";
const REVEAL_CELL = "REVEAL_CELL";
const TURN_CELL_STATE = "TURN_CELL_STATE";

export const configureBoard = (configuration) => {
    return {
        type: CONFIGURE_BOARD,
        configuration
    };
};

export const revealCell = (x, y) => {
    return {
        type: REVEAL_CELL,
        x,
        y
    };
};

export const turnCellState = (x, y) => {
    return {
        type: TURN_CELL_STATE,
        x,
        y
    };
};

const modifyCell = (board, x, y, mod) => {
    return [
        ...board.slice(0, y),
        [
            ...board[y].slice(0, x),
            {
                ...board[y][x],
                ...mod
            },
            ...board[y].slice(x + 1)
        ],
        ...board.slice(y + 1)
    ];
};

/**
 * @param {{ x: number, y: number, mines: number }} config 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean} 
 */
const isOutOfBounds = (config, x, y) => {
    return x < 0 || x >= config.x || y < 0 || y >= config.y;
};

/**
 * Generates a new board based on the provided config.
 * @param {{x: number, y: number, mines: number}} config 
 * @returns {Cell[][]} New board.
 */
const getBoard = (config) => {
    const { x: maxX, y: maxY, mines } = config;
    const board = [];

    // Rows
    for (let y = 0; y < maxY; y++) {
        // Columns
        let column = [];
        for (let x = 0; x < maxX; x++) {
            column.push({
                state: CELL_STATE.DEFAULT,
                hasMine: false,
                mineCount: 0
            });
        }
        board.push(column);
    }

    let minesLeftToAssign = mines;
    while (minesLeftToAssign > 0) {
        let randX = Math.floor(Math.random() * maxX);
        let randY = Math.floor(Math.random() * maxY);

        if (isOutOfBounds(config, randX, randY)) continue;
        if (placeMine(config, board, randX, randY)) minesLeftToAssign--;
    }

    return board;
};

/**
 * Modifies the given board by placing a mine at the specified coordinates
 * and incrementing the mineCount of adjacent cells.
 * @param {{x: number, y: number, mines: number}} config 
 * @param {Cell[][]} board 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean} <code>true</code> if a modification took place; <code>false</code> otherwise.
 */
const placeMine = (config, board, x, y) => {
    const cell = board[y][x];

    if (cell == null) throw new Error(`No mine at [${y}, ${x}].`);

    // If it already has a mine, do nothing.
    if (cell.hasMine) return false;

    console.log(`Placing mine at [${x}, ${y}]`);
    cell.hasMine = true;

    // Update the mineCount of adjacent cells.
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const checkX = x + j;
            const checkY = y + i;

            if (i === 0 && j === 0) continue; // Skip the specified cell.
            if (isOutOfBounds(config, checkX, checkY)) continue;

            board[checkY][checkX].mineCount++;
        }
    }
    
    return true;
};

export function mainReducer(state = initialState, action) {
    switch(action.type) {
        case CONFIGURE_BOARD:
            return {
                ...state,
                config: action.configuration,
                board: getBoard(action.configuration)
            };
        case REVEAL_CELL:
            return {
                ...state,
                board: modifyCell(state.board, action.x, action.y, { state: CELL_STATE.REVEALED })
            };
        case TURN_CELL_STATE:
            const { x, y } = action;
            const cell = state.board[y][x];

            if (cell.state === CELL_STATE.REVEALED) return state;

            let newState = CELL_STATE.DEFAULT;

            switch (cell.state) {
                case CELL_STATE.DEFAULT:
                    newState = CELL_STATE.FLAGGED;
                    break;
                case CELL_STATE.FLAGGED:
                    // Check if question is enabled.
                    newState = CELL_STATE.QUESTIONED;
                    break;
                case CELL_STATE.QUESTIONED:
                    newState = CELL_STATE.DEFAULT;
                    break;
                case CELL_STATE.REVEALED:
                default:
                    break;
            }

            return {
                ...state,
                board: modifyCell(state.board, action.x, action.y, { state: newState })
            };
        default:
            return state;
    }
}