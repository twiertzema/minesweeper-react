import {
  CELL_STATE,
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_EXPERT,
  CONFIG_INTERMEDIATE
} from "./constants";
import {
  forEachAdjacentCell,
  getBoard,
  isConfigValid,
  isOutOfBounds,
  placeMine,
  InvalidConfigError,
  OutOfBoundsError
} from "./utils";

const testConfig = { x: 13, y: 13, mines: 13 };

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
  it("should set `hasMine` and nothing else on the specified cell", () => {
    const testBoard = getBoard(testConfig);
    const x = 4;
    const y = 7;

    const cellBefore = { ...testBoard[y][x] };

    placeMine(testConfig, testBoard, x, y);

    expect(testBoard[y][x]).toEqual({
      ...cellBefore,
      hasMine: true
    });
  });

  it("should set increment the `mineCount` of adjacent cells", () => {
    const testBoard = getBoard(testConfig);
    const x = 4;
    const y = 7;

    placeMine(testConfig, testBoard, x, y);

    expect(testBoard[y - 1][x - 1].mineCount).toBe(1);
    expect(testBoard[y - 1][x].mineCount).toBe(1);
    expect(testBoard[y - 1][x + 1].mineCount).toBe(1);
    expect(testBoard[y][x - 1].mineCount).toBe(1);
    expect(testBoard[y][x + 1].mineCount).toBe(1);
    expect(testBoard[y + 1][x - 1].mineCount).toBe(1);
    expect(testBoard[y + 1][x].mineCount).toBe(1);
    expect(testBoard[y + 1][x + 1].mineCount).toBe(1);
  });
});
