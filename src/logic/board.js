/** @typedef {{x: number, y: number, mines: number}} Config */
/** @typedef {{state: number, hasMine: boolean, mineCount: number}} Cell */
/** @typedef {Cell[][]} Board */
/** @typedef {{config: Config, seeded: boolean, board: Board}} BoardState

/** @type Config */
export const CONFIG_DEFAULT = { x: 0, y: 0, mines: 0 };

/** @type Config */
export const CONFIG_EASY = { x: 9, y: 9, mines: 10 };

/** @type Config */
export const CONFIG_INTERMEDIATE = { x: 16, y: 16, mines: 40 };

/** @type Config */
export const CONFIG_EXPERT = { x: 30, y: 16, mines: 99 };

/**
 * Enum for cell states
 * @enum {number}
 */
export const CELL_STATE = {
  DEFAULT: 0,
  FLAGGED: 1,
  REVEALED: 2,
  QUESTIONED: 4
};

/** @type {BoardState} */
export const defaultState = {
  config: CONFIG_DEFAULT,
  seeded: false,
  board: [ [] ]
};

export const CONFIGURE_BOARD = 'CONFIGURE_BOARD';
export const REVEAL_CELL = 'REVEAL_CELL';
export const TURN_CELL_STATE = 'TURN_CELL_STATE';

/**
 * Action creator for `CONFIGURE_BOARD`.
 * @param {Config} configuration
 * @returns {{type: string, configuration: Config}}
 */
export const configureBoard = (configuration) => {
  return {
    type: CONFIGURE_BOARD,
    configuration
  };
};

/**
 * Action creator for `REVEAL_CELL`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const revealCell = (x, y) => {
  return {
    type: REVEAL_CELL,
    x,
    y
  };
};

/**
 * Action creator for `TURN_CELL_STATE`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const turnCellState = (x, y) => {
  return {
    type: TURN_CELL_STATE,
    x,
    y
  };
};

/**
 * Merges an update into the specified {@link Cell} in a {@link Board}.
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @param {Object} mod
 * @returns {Cell}
 */
const modifyCell = (board, x, y, mod) => {
  return [
    ...board.slice(0, y),
    [
      ...board[ y ].slice(0, x),
      {
        ...board[ y ][ x ],
        ...mod
      },
      ...board[ y ].slice(x + 1)
    ],
    ...board.slice(y + 1)
  ];
};

/**
 * @param {Config} config
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isOutOfBounds = (config, x, y) => {
  return x < 0 || x >= config.x || y < 0 || y >= config.y;
};

/**
 * Generates a new blank board based on the provided config.
 * @param {Config} config
 * @returns {Board} New board.
 */
const getBoard = (config) => {
  const { x: maxX, y: maxY } = config;
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

  return board;
};

/**
 * Places mines on the given board, avoiding the specified seed coordinates.
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
const placeMines = (config, board, x, y) => {
  const { x: maxX, y: maxY, mines } = config;

  let minesLeftToAssign = mines;
  while (minesLeftToAssign > 0) {
    let randX = Math.floor(Math.random() * maxX);
    let randY = Math.floor(Math.random() * maxY);

    if (randX === x && randY === y) continue; // Skip the seed cell.
    if (isOutOfBounds(config, randX, randY)) continue;
    if (placeMine(config, board, randX, randY)) minesLeftToAssign--;
  }

  return board;
};

/**
 * Modifies the given board by placing a mine at the specified coordinates
 * and incrementing the mineCount of adjacent cells.
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @returns {boolean} <code>true</code> if a modification took place; <code>false</code> otherwise.
 */
const placeMine = (config, board, x, y) => {
  const cell = board[ y ][ x ];

  if (cell == null) throw new Error(`No mine at [${y}, ${x}].`);

  // If it already has a mine, do nothing.
  if (cell.hasMine) return false;

  console.log(`Placing mine at [${x}, ${y}]`);
  cell.hasMine = true;

  // Update the mineCount of adjacent cells.
  forEachAdjacentCell(config, board, x, y, cell => cell.mineCount++);

  return true;
};

/**
 * Modifies the given board by revealing all empty and empty-adjacent cells
 * connected to the given coordinates.
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
const cascadeCells = (config, board, x, y) => {
  forEachAdjacentCell(config, board, x, y, (cell, x, y) => {
    if (cell.state === CELL_STATE.REVEALED) return;
    cell.state = CELL_STATE.REVEALED;
    if (cell.mineCount === 0) cascadeCells(config, board, x, y);
  });
};

/**
 * @callback forEachCell
 * @param {Cell} cell
 * @param {number} x
 * @param {number} y
 */
/**
 * @param {Config} config
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @param {forEachCell} action
 */
const forEachAdjacentCell = (config, board, x, y, action) => {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const checkX = x + j;
      const checkY = y + i;

      if (i === 0 && j === 0) continue; // Skip the specified cell.
      if (isOutOfBounds(config, checkX, checkY)) continue;
      action(board[ checkY ][ checkX ], checkX, checkY);
    }
  }
};

export function mainReducer(state = defaultState, action) {
  switch (action.type) {
    case CONFIGURE_BOARD:
      return {
        seeded: false,
        config: action.configuration,
        board: getBoard(action.configuration)
      };

    case REVEAL_CELL: {
      const { x, y } = action;

      let newBoard = modifyCell(state.board, x, y, { state: CELL_STATE.REVEALED });
      if (!state.seeded) {
        placeMines(state.config, newBoard, x, y);
      }

      const cell = newBoard[ y ][ x ];
      if (cell.mineCount === 0 && !cell.hasMine) {
        // Cell cascade.
        cascadeCells(state.config, newBoard, x, y);
        return {
          ...state,
          seeded: true,
          board: newBoard
        };
      } else {
        return {
          ...state,
          seeded: true,
          board: newBoard
        };
      }
    }

    case TURN_CELL_STATE: {
      const { x, y } = action;
      const cell = state.board[ y ][ x ];

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
    }

    default:
      return state;
  }
}