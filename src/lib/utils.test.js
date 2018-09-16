import seedrandom from "seedrandom";

import {
  CELL_STATE,
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_EXPERT,
  CONFIG_INTERMEDIATE
} from "./constants";
import {
  cascadeCells,
  forEachAdjacentCell,
  getBoard,
  isConfigValid,
  isOutOfBounds,
  modifyCell,
  placeMine,
  placeMines,
  InvalidConfigError,
  OutOfBoundsError
} from "./utils";
import { turnCellState } from "../logic/board";

const testConfig = { x: 13, y: 13, mines: 13 };
let __defaultBoard = getBoard(testConfig);
const cloneBoard = board => board.map(row => row.map(cell => ({ ...cell })));

const __originalRandom = Math.random;
const seedRandom = (seed = "minesweeper-react") =>
  (global.Math.random = seedrandom(seed));
const restoreRandom = () => (global.Math.random = __originalRandom);
const seededMineCoords = [
  { x: 0, y: 3 },
  { x: 1, y: 4 },
  { x: 2, y: 4 },
  { x: 2, y: 6 },
  { x: 3, y: 7 },
  { x: 5, y: 4 },
  { x: 7, y: 5 },
  { x: 7, y: 6 },
  { x: 7, y: 12 },
  { x: 8, y: 7 },
  { x: 8, y: 8 },
  { x: 9, y: 4 },
  { x: 12, y: 5 }
];
const seededMineCounts = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 3, 2, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [2, 2, 1, 1, 1, 0, 2, 1, 2, 0, 1, 1, 1],
  [1, 3, 3, 2, 1, 1, 3, 1, 3, 1, 1, 1, 0],
  [0, 1, 1, 2, 1, 0, 2, 2, 3, 1, 0, 1, 1],
  [0, 1, 2, 1, 1, 0, 1, 3, 2, 2, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 2, 1, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
];

describe("isConfigValid", () => {
  it("should return `true` for a valid custom config`", () => {
    expect(isConfigValid(testConfig)).toBe(true);
  });

  it("should return `true` for all built-in configs", () => {
    expect(isConfigValid(CONFIG_EASY)).toBe(true);
    expect(isConfigValid(CONFIG_INTERMEDIATE)).toBe(true);
    expect(isConfigValid(CONFIG_EXPERT)).toBe(true);
    expect(isConfigValid(CONFIG_DEFAULT)).toBe(true);
  });

  it("should return `false` for invalid `config` type", () => {
    expect(isConfigValid(undefined)).toBe(false);
    expect(isConfigValid(null)).toBe(false);
    expect(isConfigValid(7)).toBe(false);
    expect(isConfigValid("7")).toBe(false);
    expect(isConfigValid([])).toBe(false);
    expect(isConfigValid(function() {})).toBe(false);
  });

  it("should return `false` for properties of invalid type", () => {
    expect(isConfigValid({ x: undefined, y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: undefined, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: undefined })).toBe(false);

    expect(isConfigValid({ x: null, y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: null, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: null })).toBe(false);

    expect(isConfigValid({ x: "7", y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: "7", mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: "7" })).toBe(false);

    expect(isConfigValid({ x: NaN, y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: NaN, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: NaN })).toBe(false);

    expect(isConfigValid({ x: {}, y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: {}, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: {} })).toBe(false);

    expect(isConfigValid({ x: [], y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: [], mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: [] })).toBe(false);

    expect(isConfigValid({ x: function() {}, y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: function() {}, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: function() {} })).toBe(false);
  });

  it("should return `false` for missing properties", () => {
    expect(isConfigValid({ y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7 })).toBe(false);
    expect(isConfigValid({ x: 7 })).toBe(false);
    expect(isConfigValid({ y: 7 })).toBe(false);
    expect(isConfigValid({ mines: 7 })).toBe(false);
    expect(isConfigValid({})).toBe(false);
  });

  it("should return `false` for negative properties", () => {
    expect(isConfigValid({ x: -1, y: 7, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: -1, mines: 7 })).toBe(false);
    expect(isConfigValid({ x: 7, y: 7, mines: -1 })).toBe(false);
  });
});

describe("isOutOfBounds", () => {
  it("should return `false` for valid coordinates", () => {
    expect(isOutOfBounds(CONFIG_EASY, 5, 5)).toBe(false);
    expect(isOutOfBounds(CONFIG_INTERMEDIATE, 5, 5)).toBe(false);
    expect(isOutOfBounds(CONFIG_EXPERT, 5, 5)).toBe(false);
    expect(isOutOfBounds(testConfig, 5, 5)).toBe(false);
  });

  it("should return `false` for coordinates at lower bounds", () => {
    expect(isOutOfBounds(CONFIG_EASY, 0, 0)).toBe(false);
    expect(isOutOfBounds(CONFIG_INTERMEDIATE, 0, 0)).toBe(false);
    expect(isOutOfBounds(CONFIG_EXPERT, 0, 0)).toBe(false);
    expect(isOutOfBounds(testConfig, 0, 0)).toBe(false);
  });

  it("should return `false` for coordinates at upper bounds", () => {
    expect(
      isOutOfBounds(CONFIG_EASY, CONFIG_EASY.x - 1, CONFIG_EASY.y - 1)
    ).toBe(false);
    expect(
      isOutOfBounds(
        CONFIG_INTERMEDIATE,
        CONFIG_INTERMEDIATE.x - 1,
        CONFIG_INTERMEDIATE.y - 1
      )
    ).toBe(false);
    expect(
      isOutOfBounds(CONFIG_EXPERT, CONFIG_EXPERT.x - 1, CONFIG_EXPERT.y - 1)
    ).toBe(false);
    expect(isOutOfBounds(testConfig, testConfig.x - 1, testConfig.y - 1)).toBe(
      false
    );
  });

  it("should return `true` if the specified coordinate is out of bounds", () => {
    expect(isOutOfBounds(CONFIG_EASY, 5, 10)).toBe(true);
    expect(isOutOfBounds(CONFIG_EASY, 10, 5)).toBe(true);
    expect(isOutOfBounds(CONFIG_EASY, 10, 10)).toBe(true);

    expect(isOutOfBounds(CONFIG_INTERMEDIATE, 5, 17)).toBe(true);
    expect(isOutOfBounds(CONFIG_INTERMEDIATE, 17, 5)).toBe(true);
    expect(isOutOfBounds(CONFIG_INTERMEDIATE, 17, 17)).toBe(true);

    expect(isOutOfBounds(CONFIG_EXPERT, 5, 17)).toBe(true);
    expect(isOutOfBounds(CONFIG_EXPERT, 31, 5)).toBe(true);
    expect(isOutOfBounds(CONFIG_EXPERT, 31, 17)).toBe(true);

    expect(isOutOfBounds(testConfig, 5, 43)).toBe(true);
    expect(isOutOfBounds(testConfig, 43, 5)).toBe(true);
    expect(isOutOfBounds(testConfig, 43, 43)).toBe(true);
  });

  it("should return `true` for negative coordinates", () => {
    expect(isOutOfBounds(CONFIG_EASY, -1, 5)).toBe(true);
    expect(isOutOfBounds(CONFIG_EASY, 5, -1)).toBe(true);
    expect(isOutOfBounds(CONFIG_EASY, -1, -1)).toBe(true);

    expect(isOutOfBounds(CONFIG_INTERMEDIATE, -1, 5)).toBe(true);
    expect(isOutOfBounds(CONFIG_INTERMEDIATE, 5, -1)).toBe(true);
    expect(isOutOfBounds(CONFIG_INTERMEDIATE, -1, -1)).toBe(true);

    expect(isOutOfBounds(CONFIG_EXPERT, -1, 5)).toBe(true);
    expect(isOutOfBounds(CONFIG_EXPERT, 5, -1)).toBe(true);
    expect(isOutOfBounds(CONFIG_EXPERT, -1, -1)).toBe(true);

    expect(isOutOfBounds(testConfig, -1, 5)).toBe(true);
    expect(isOutOfBounds(testConfig, 5, -1)).toBe(true);
    expect(isOutOfBounds(testConfig, -1, -1)).toBe(true);
  });

  it("should throw an InvalidConfigError for an invalid config", () => {
    expect(() => isOutOfBounds(undefined, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => isOutOfBounds(null, 5, 5)).toThrowError(InvalidConfigError);
    expect(() => isOutOfBounds({}, 5, 5)).toThrowError(InvalidConfigError);
    expect(() => isOutOfBounds({ x: -1, y: 42, mines: 13 }, 5, 5)).toThrowError(
      InvalidConfigError
    );
  });

  it("should always return `true` for CONFIG_DEFAULT", () => {
    expect(isOutOfBounds(CONFIG_DEFAULT, 0, 0)).toBe(true);
  });
});

describe("getBoard", () => {
  it("should generate a board of the correct size", () => {
    const resultDefault = getBoard(CONFIG_DEFAULT);
    expect(resultDefault.length).toBe(CONFIG_DEFAULT.y);
    resultDefault.forEach(row => expect(row.length).toBe(CONFIG_DEFAULT.x));

    const resultEasy = getBoard(CONFIG_EASY);
    expect(resultEasy.length).toBe(CONFIG_EASY.y);
    resultEasy.forEach(row => expect(row.length).toBe(CONFIG_EASY.x));

    const resultIntermediate = getBoard(CONFIG_INTERMEDIATE);
    expect(resultIntermediate.length).toBe(CONFIG_INTERMEDIATE.y);
    resultIntermediate.forEach(row =>
      expect(row.length).toBe(CONFIG_INTERMEDIATE.x)
    );

    const resultExpert = getBoard(CONFIG_EXPERT);
    expect(resultExpert.length).toBe(CONFIG_EXPERT.y);
    resultExpert.forEach(row => expect(row.length).toBe(CONFIG_EXPERT.x));

    const resultTest = getBoard(testConfig);
    expect(resultTest.length).toBe(testConfig.y);
    resultTest.forEach(row => expect(row.length).toBe(testConfig.x));
  });

  it("should generate a board with all the cells in the default state", () => {
    getBoard(CONFIG_EASY).forEach(row =>
      row.forEach(cell => {
        expect(cell.state).toBe(CELL_STATE.DEFAULT);
        expect(cell.hasMine).toBe(false);
        expect(cell.mineCount).toBe(0);
      })
    );
    getBoard(CONFIG_INTERMEDIATE).forEach(row =>
      row.forEach(cell => {
        expect(cell.state).toBe(CELL_STATE.DEFAULT);
        expect(cell.hasMine).toBe(false);
        expect(cell.mineCount).toBe(0);
      })
    );
    getBoard(CONFIG_EXPERT).forEach(row =>
      row.forEach(cell => {
        expect(cell.state).toBe(CELL_STATE.DEFAULT);
        expect(cell.hasMine).toBe(false);
        expect(cell.mineCount).toBe(0);
      })
    );
    getBoard(testConfig).forEach(row =>
      row.forEach(cell => {
        expect(cell.state).toBe(CELL_STATE.DEFAULT);
        expect(cell.hasMine).toBe(false);
        expect(cell.mineCount).toBe(0);
      })
    );
  });

  it("should throw an InvalidConfigError for an invalid config", () => {
    expect(() => getBoard(undefined)).toThrowError(InvalidConfigError);
    expect(() => getBoard(null)).toThrowError(InvalidConfigError);
    expect(() => getBoard({})).toThrowError(InvalidConfigError);
    expect(() => getBoard({ x: -1, y: 42, mines: 13 })).toThrowError(
      InvalidConfigError
    );
  });
});

describe("forEachAdjacentCell", () => {
  const getCallbackExpect = callback => {
    return (_x, _y) => {
      expect(
        callback.mock.calls.some(call => call[1] === _x && call[2] === _y)
      ).toBe(true);
    };
  };
  const testBoard = getBoard(testConfig);

  it("should invoke the given callback for every cell around a cell in the middle", () => {
    const callback = jest.fn();
    const x = 5;
    const y = 5;

    forEachAdjacentCell(testConfig, testBoard, x, y, callback);

    expect(callback.mock.calls.length).toBe(8);

    const expectCallback = getCallbackExpect(callback);

    expectCallback(x - 1, y - 1);
    expectCallback(x, y - 1);
    expectCallback(x + 1, y - 1);
    expectCallback(x - 1, y);
    expectCallback(x + 1, y);
    expectCallback(x - 1, y + 1);
    expectCallback(x, y + 1);
    expectCallback(x + 1, y + 1);

    expect(callback.mock.calls.every(call => call[0] !== x && call[1] !== y));
  });

  describe("should invoke the given callback for every cell that isn't out of bounds", () => {
    it("in the top-left corner", () => {
      const callback = jest.fn();
      const x = 0;
      const y = 0;

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(3);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x + 1, y);
      expectCallback(x, y + 1);
      expectCallback(x + 1, y + 1);
    });

    it("in the top-right corner", () => {
      const callback = jest.fn();
      const x = testConfig.x - 1;
      const y = 0;

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(3);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x - 1, y);
      expectCallback(x - 1, y + 1);
      expectCallback(x, y + 1);
    });

    it("in the bottom-right corner", () => {
      const callback = jest.fn();
      const x = testConfig.x - 1;
      const y = testConfig.y - 1;

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(3);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x - 1, y - 1);
      expectCallback(x, y - 1);
      expectCallback(x - 1, y);
    });

    it("in the bottom-left corner", () => {
      const callback = jest.fn();
      const x = 0;
      const y = testConfig.y - 1;

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(3);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x, y - 1);
      expectCallback(x + 1, y - 1);
      expectCallback(x + 1, y);
    });

    it("along the top edge", () => {
      const callback = jest.fn();
      const x = Math.floor(testConfig.x / 2);
      const y = 0;

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(5);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x - 1, y);
      expectCallback(x + 1, y);
      expectCallback(x - 1, y + 1);
      expectCallback(x, y + 1);
      expectCallback(x + 1, y + 1);
    });

    it("along the right edge", () => {
      const callback = jest.fn();
      const x = testConfig.x - 1;
      const y = Math.floor(testConfig.y / 2);

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(5);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x - 1, y - 1);
      expectCallback(x, y - 1);
      expectCallback(x - 1, y);
      expectCallback(x - 1, y + 1);
      expectCallback(x, y + 1);
    });

    it("along the bottom edge", () => {
      const callback = jest.fn();
      const x = Math.floor(testConfig.x / 2);
      const y = testConfig.y - 1;

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(5);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x - 1, y - 1);
      expectCallback(x, y - 1);
      expectCallback(x + 1, y - 1);
      expectCallback(x - 1, y);
      expectCallback(x + 1, y);
    });

    it("along the left edge", () => {
      const callback = jest.fn();
      const x = 0;
      const y = Math.floor(testConfig.y / 2);

      forEachAdjacentCell(testConfig, testBoard, x, y, callback);

      expect(callback.mock.calls.length).toBe(5);

      const expectCallback = getCallbackExpect(callback);

      expectCallback(x, y - 1);
      expectCallback(x + 1, y - 1);
      expectCallback(x + 1, y);
      expectCallback(x, y + 1);
      expectCallback(x + 1, y + 1);
    });
  });

  it("should throw an InvalidConfigError for an invalid config", () => {
    expect(() =>
      forEachAdjacentCell(undefined, testBoard, 5, 5, () => {})
    ).toThrowError(InvalidConfigError);
    expect(() =>
      forEachAdjacentCell(null, testBoard, 5, 5, () => {})
    ).toThrowError(InvalidConfigError);
    expect(() =>
      forEachAdjacentCell({}, testBoard, 5, 5, () => {})
    ).toThrowError(InvalidConfigError);
    expect(() =>
      forEachAdjacentCell(
        { x: -1, y: 42, mines: 13 },
        testBoard,
        5,
        5,
        () => {}
      )
    ).toThrowError(InvalidConfigError);
  });

  it("should throw an OutOfBoundsError for out of bounds coordinates", () => {
    expect(() =>
      forEachAdjacentCell(testConfig, testBoard, 1337, 1337, () => {})
    ).toThrowError(OutOfBoundsError);
  });
});

describe("placeMine", () => {
  let testBoard = getBoard(testConfig);

  afterEach(() => {
    testBoard = cloneBoard(__defaultBoard);
  });

  it("should set `hasMine` and nothing else on the specified cell", () => {
    const x = 4;
    const y = 7;

    const cellBefore = { ...testBoard[y][x] };

    const result = placeMine(testConfig, testBoard, x, y);

    expect(result).toBe(true);
    expect(testBoard[y][x]).toEqual({
      ...cellBefore,
      hasMine: true
    });
  });

  it("should increment the `mineCount` of adjacent cells", () => {
    const x = 4;
    const y = 7;

    const result = placeMine(testConfig, testBoard, x, y);

    expect(result).toBe(true);
    expect(testBoard[y - 1][x - 1].mineCount).toBe(1);
    expect(testBoard[y - 1][x].mineCount).toBe(1);
    expect(testBoard[y - 1][x + 1].mineCount).toBe(1);
    expect(testBoard[y][x - 1].mineCount).toBe(1);
    expect(testBoard[y][x + 1].mineCount).toBe(1);
    expect(testBoard[y + 1][x - 1].mineCount).toBe(1);
    expect(testBoard[y + 1][x].mineCount).toBe(1);
    expect(testBoard[y + 1][x + 1].mineCount).toBe(1);
  });

  it("shouldn't modify anything if the cell already has a mine", () => {
    const x = 4;
    const y = 7;

    testBoard[y][x].hasMine = true;

    const boardBefore = cloneBoard(testBoard);

    const result = placeMine(testConfig, testBoard, x, y);

    expect(result).toBe(false);
    expect(testBoard).toEqual(boardBefore);
  });

  it("should throw an InvalidConfigError for an invalid config", () => {
    expect(() => placeMine(undefined, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => placeMine(null, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => placeMine({}, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() =>
      placeMine({ x: -1, y: 42, mines: 13 }, testBoard, 5, 5)
    ).toThrowError(InvalidConfigError);
  });

  it("should throw an OutOfBoundsError for out of bounds coordinates", () => {
    expect(() => placeMine(testConfig, testBoard, 1337, 1337)).toThrowError(
      OutOfBoundsError
    );
  });
});

describe("placeMines", () => {
  let testBoard = getBoard(testConfig);

  beforeEach(() => {
    seedRandom();
  });

  afterEach(() => {
    testBoard = cloneBoard(__defaultBoard);
    restoreRandom();
  });

  it("should be predictably random for testing", () => {
    const x = 4;
    const y = 7;

    const result0 = placeMines(testConfig, cloneBoard(__defaultBoard), x, y);

    seedRandom(); // reset the seed so the results are the same

    const result1 = placeMines(testConfig, cloneBoard(__defaultBoard), x, y);

    expect(result0).toEqual(result1);
  });

  it("should skip the seed cell", () => {
    const x = 4;
    const y = 7;

    // Seed random with a pre-determined value to try to place a mine on the seed cell.
    seedRandom(1401);
    placeMines(testConfig, testBoard, x, y);

    expect(testBoard[y][x].hasMine).toBe(false);
  });

  it("should randomly place mines on the board", () => {
    const x = 4;
    const y = 7;

    placeMines(testConfig, testBoard, x, y);

    testBoard.forEach((row, j) =>
      row.forEach((cell, i) => {
        if (seededMineCoords.some(coord => coord.x === i && coord.y === j))
          expect(cell.hasMine).toBe(true);
        else expect(cell.hasMine).toBe(false);
      })
    );
  });

  it("should correctly add the `mineCount` of the cells adjacent to mines", () => {
    const x = 4;
    const y = 7;

    placeMines(testConfig, testBoard, x, y);

    testBoard.forEach((row, j) =>
      row.forEach((cell, i) =>
        expect(cell.mineCount).toBe(seededMineCounts[j][i])
      )
    );
  });

  it("should throw an InvalidConfigError for an invalid config", () => {
    expect(() => placeMines(undefined, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => placeMines(null, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => placeMines({}, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() =>
      placeMines({ x: -1, y: 42, mines: 13 }, testBoard, 5, 5)
    ).toThrowError(InvalidConfigError);
  });

  it("should throw an OutOfBoundsError for out of bounds coordinates", () => {
    expect(() => placeMines(testConfig, testBoard, 1337, 1337)).toThrowError(
      OutOfBoundsError
    );
  });
});

describe("cascadeCells", () => {
  let testBoard = getBoard(testConfig);

  beforeEach(() => {
    seedRandom();
  });

  afterEach(() => {
    testBoard = cloneBoard(__defaultBoard);
    restoreRandom();
  });

  it("should reveal all empty and empty-adjacent cells connected to the specified empty coordinate", () => {
    placeMines(testConfig, testBoard, 4, 7);
    cascadeCells(testConfig, testBoard, 0, 0);

    const seededReveals = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    testBoard.forEach((row, j) =>
      row.forEach((cell, i) =>
        expect(cell.state).toBe(
          seededReveals[j][i] ? CELL_STATE.REVEALED : CELL_STATE.DEFAULT
        )
      )
    );
  });

  it("shouldn't cascade if the target cell is not empty", () => {
    const x = 4;
    const y = 7;

    placeMines(testConfig, testBoard, x, y);

    const boardBefore = cloneBoard(testBoard);

    cascadeCells(testConfig, testBoard, 1, 3);

    expect(testBoard).toEqual(boardBefore);
  });

  it("should throw an InvalidConfigError for an invalid config", () => {
    expect(() => cascadeCells(undefined, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => cascadeCells(null, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() => cascadeCells({}, testBoard, 5, 5)).toThrowError(
      InvalidConfigError
    );
    expect(() =>
      cascadeCells({ x: -1, y: 42, mines: 13 }, testBoard, 5, 5)
    ).toThrowError(InvalidConfigError);
  });

  it("should throw an OutOfBoundsError for out of bounds coordinates", () => {
    expect(() => cascadeCells(testConfig, testBoard, 1337, 1337)).toThrowError(
      OutOfBoundsError
    );
  });
});
