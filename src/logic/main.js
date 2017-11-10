export const CONFIG_EASY = { x: 9, y: 9, mines: 10 };
export const CONFIG_INTERMEDIATE = { x: 16, y: 16, mines: 40 };
export const CONFIG_EXPERT = { x: 30, y: 16, mines: 99 };

const CELL_STATE = {
    DEFAULT: 0,
    FLAGGED: 1,
    REVEALED: 2,
    QUESTIONED: 4
};

const initialState = {
    board: []
};

const CONFIGURE_BOARD = "CONFIGURE_BOARD";
const REVEAL_CELL = "REVEAL_CELL";

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
   }
};

const modifyCell = (board, x, y, mod) => {
    return [
        ...board.slice(0, x),
        [
            ...board[x].slice(0, y),
            {
                ...board[x][y],
                ...mod
            },
            ...board[x].slice(y + 1)
        ],
        ...board.slice(x + 1)
    ];
};

export function mainReducer(state = initialState, action) {
    switch(action.type) {
        case CONFIGURE_BOARD: {
            const config = action.configuration, board = [];

            for (let i = 0; i < config.x; i++) {
                board.push([]);
                for (let j = 0; j < config.y; j++) {
                    board[i].push({
                        state: CELL_STATE.DEFAULT,
                        hasMine: false
                    });
                }
            }

            return {
                board
            };
        }
        case REVEAL_CELL:
            return {
                board: modifyCell(state.board, action.x, action.y, { state: CELL_STATE.REVEALED })
            };
        default:
            return state;
    }
}