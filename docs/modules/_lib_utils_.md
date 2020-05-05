[minesweeper-react](../README.md) › [Globals](../globals.md) › ["lib/utils"](_lib_utils_.md)

# Module: "lib/utils"

## Index

### Classes

* [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md)
* [OutOfBoundsError](../classes/_lib_utils_.outofboundserror.md)

### Functions

* [chordCells](_lib_utils_.md#chordcells)
* [determineBoardState](_lib_utils_.md#determineboardstate)
* [flagAllMines](_lib_utils_.md#flagallmines)
* [forEachAdjacentCell](_lib_utils_.md#foreachadjacentcell)
* [getBoard](_lib_utils_.md#getboard)
* [getMineDisplayCount](_lib_utils_.md#getminedisplaycount)
* [isConfigValid](_lib_utils_.md#isconfigvalid)
* [isOutOfBounds](_lib_utils_.md#isoutofbounds)
* [placeMine](_lib_utils_.md#placemine)
* [placeMines](_lib_utils_.md#placemines)
* [revealAllMines](_lib_utils_.md#revealallmines)

## Functions

###  chordCells

▸ **chordCells**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md), `board`: [MinesweeperBoard](_types_.md#minesweeperboard), `x`: number, `y`: number): *void*

If the origin [MinesweeperCell](../interfaces/_types_.minesweepercell.md) specified by `x` and `y` is "empty" (has a
 `mineCount` of `0`), this function modifies `board` by revealing all empty
 and empty-adjacent [cells](../interfaces/_types_.minesweepercell.md); otherwise, this function does nothing.

**Warning:** This is <u>not</u> a pure function.

```ts
const myConfig = { x: 5, y: 5, mines: 10 };
const myBoard = getBoard(myConfig);
placeMines(myConfig, myBoard, 0, 0);

// Assume the following board (x = mine):
//  1 1 0 0 0
//  x 4 2 1 0
//  x x x 4 2
//  x x x x x
//  x 4 3 3 2

chordCells(myConfig, myBoard, 2, 0);

// This will reveal the following cells (r = revealed):
//  - r r r r
//  - r r r r
//  - - - r r
//  - - - - -
//  - - - - -

chordCells(myConfig, myBoard, 1, 4);
// Since the target cell would have a `mineCount` of 4, this would do nothing.

// A config with more mines than cells:
chordCells({ x: 5, y: 5, mines: 9999 }, [][], 0, 0); // throws InvalidConfigError

// Origin coordinates that are out of bounds:
chordCells(myConfig, myBoard, 100, 100); // throws OutOfBoundsError
```

**`throws`** [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md) if `config` is not valid.

**`throws`** [OutOfBoundsError](../classes/_lib_utils_.outofboundserror.md) if `x` and `y` indicate a cell that is out of
 bounds for `config`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) used to generate `board` (for reference). |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) | [MinesweeperBoard](_types_.md#minesweeperboard) for which to reveal the [cells](../interfaces/_types_.minesweepercell.md). |
`x` | number | X coordinate of the origin [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |
`y` | number | Y coordinate of the origin [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |

**Returns:** *void*

___

###  determineBoardState

▸ **determineBoardState**(`board`: [MinesweeperBoard](_types_.md#minesweeperboard)): *[GAME_STATE](../enums/_lib_constants_.game_state.md)*

Determines what state the game is in from the board.

**Parameters:**

Name | Type |
------ | ------ |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) |

**Returns:** *[GAME_STATE](../enums/_lib_constants_.game_state.md)*

___

###  flagAllMines

▸ **flagAllMines**(`board`: [MinesweeperBoard](_types_.md#minesweeperboard)): *void*

Sets the `state` of all cells that have mines to `FLAGGED`.
- This is to be called at the successful end of the game to confirm the
  placement of mines to the user in case they didn't flag them.

**Warning:** This is <u>not</u> a pure function.

**Parameters:**

Name | Type |
------ | ------ |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) |

**Returns:** *void*

___

###  forEachAdjacentCell

▸ **forEachAdjacentCell**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md), `board`: [MinesweeperBoard](_types_.md#minesweeperboard), `x`: number, `y`: number, `action`: [forEachAdjacentCellCallback](_types_.md#foreachadjacentcellcallback)): *void*

Executes the `action` callback for every cell adjacent to the target `x` and
 `y` coordinates (excluding out-of-bounds coordinates).

```ts
const myConfig = { x: 10, y: 15, mines: 100 };
const myBoard = getBoard(myConfig);
forEachAdjacentCell(myConfig, myBoard, 0, 5, (cell, x, y) => {
  console.log({ x, y });
});
// Will output the following:
//  { x: 0, y: 4 }
//  { x: 0, y: 6 }
//  { x: 1, y: 4 }
//  { x: 1, y: 5 }
//  { x: 1, y: 6 }
```

**`throws`** [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md) if `config` is not valid.

**`throws`** [OutOfBoundsError](../classes/_lib_utils_.outofboundserror.md) if `x` and `y` indicate a cell that is out of
 bounds for `config`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) | For reference. |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) | Source board. |
`x` | number | X coordinate of the target [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |
`y` | number | Y coordinate of the target [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |
`action` | [forEachAdjacentCellCallback](_types_.md#foreachadjacentcellcallback) | Callback function to be executed for every (valid) adjacent cell. |

**Returns:** *void*

___

###  getBoard

▸ **getBoard**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md)): *[MinesweeperBoard](_types_.md#minesweeperboard)*

Generates the 2-dimensional `Array` representing the board using the provided
 [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md).

**Note:** This does not place the mines on the board. For that, you must call
 [placeMines](_lib_utils_.md#placemines).

```ts
getBoard(CONFIG_EASY); // Returns a 9x9 2D Array of Cells in their default state.

const myConfig = { x: 10, y: 15, mines: 100 };
getBoard(myConfig); // Returns a 10x10 2D Array of Cells in their default state.

getBoard({ x: 5, y: 5, mines: 9999 }); // throws InvalidConfigError
```

**`throws`** [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md) if `config` is not valid.

**Parameters:**

Name | Type |
------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) |

**Returns:** *[MinesweeperBoard](_types_.md#minesweeperboard)*

New blank board.

___

###  getMineDisplayCount

▸ **getMineDisplayCount**(`board`: [MinesweeperBoard](_types_.md#minesweeperboard), `gameState`: [GAME_STATE](../enums/_lib_constants_.game_state.md)): *number*

Function used to calculate the number to be displayed to the user for "how
 many mines are left". This is calculated by subtracting the number of flags
 that have been placed from how many mines are on the board.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) | - |
`gameState` | [GAME_STATE](../enums/_lib_constants_.game_state.md) | If [GAME_STATE.WIN](../enums/_lib_constants_.game_state.md#win), automatically returns `0`.  |

**Returns:** *number*

___

###  isConfigValid

▸ **isConfigValid**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md)): *boolean*

Verifies that the supplied [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) is valid.

```ts
isConfigValid({ x: 10, y: 15, mines: 100 }); // true

isConfigValid({ x: 5, y: 5, mines: 1337 }); // false
isConfigValid({ x: -5, y: 5, mines: 10 }); // false
isConfigValid({ x: NaN, y: 5, mines: 10 }); // false
```

**Parameters:**

Name | Type |
------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) |

**Returns:** *boolean*

___

###  isOutOfBounds

▸ **isOutOfBounds**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md), `x`: number, `y`: number): *boolean*

Determines if the supplied `x` and `y` coordinates are out of bounds for the
 given [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md).

```ts
isOutOfBounds({ x: 10, y: 15, mines: 100 }, 4, 0); // false

isOutOfBounds(myConfig, 107, 3); // true
isOutOfBounds(myConfig, 5, -1); // true
isOutOfBounds(myConfig, 10, 10); // true

isOutOfBounds({ x: 5, y: 5, mines: 9999 }, 4, 0); // throws InvalidConfigError
```

**`throws`** [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md) if `config` is not valid.

**Parameters:**

Name | Type |
------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) |
`x` | number |
`y` | number |

**Returns:** *boolean*

___

###  placeMine

▸ **placeMine**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md), `board`: [MinesweeperBoard](_types_.md#minesweeperboard), `x`: number, `y`: number): *boolean*

Modifies the given [MinesweeperBoard](_types_.md#minesweeperboard) by setting `hasMine` to `true`
 for the [MinesweeperCell](../interfaces/_types_.minesweepercell.md) at the specified `x` and `y` coordinates and
 increments `mineCount` for all adjacent cells.

This function is used by [placeMines](_lib_utils_.md#placemines) to populate a board.

If the specified [MinesweeperCell](../interfaces/_types_.minesweepercell.md) already has a mine, this function
 does nothing and returns `false`.

**Warning:** This is <u>not</u> a pure function.

```ts
const myConfig = { x: 10, y: 15, mines: 100 };
const myBoard = getBoard(myConfig);
console.log(myBoard[7][4].hasMine); // false

placeMine(myConfig, myBoard, 4, 7);
console.log(myBoard[7][4].hasMine); // true

console.log(myBoard[6][3].mineCount); // 1
console.log(myBoard[7][3].mineCount); // 1
console.log(myBoard[8][3].mineCount); // 1
console.log(myBoard[6][4].mineCount); // 1
console.log(myBoard[8][4].mineCount); // 1
console.log(myBoard[6][5].mineCount); // 1
console.log(myBoard[7][5].mineCount); // 1
console.log(myBoard[8][5].mineCount); // 1

placeMine(myConfig, myBoard, 4, 5);

console.log(myBoard[4][3].mineCount); // 1
console.log(myBoard[5][3].mineCount); // 1
console.log(myBoard[6][3].mineCount); // 2
console.log(myBoard[4][4].mineCount); // 1
console.log(myBoard[6][4].mineCount); // 2
console.log(myBoard[4][5].mineCount); // 1
console.log(myBoard[5][5].mineCount); // 1
console.log(myBoard[6][5].mineCount); // 2

placeMine({ x: 5, y: 5, mines: 9999 }, [][], 0, 0); // throws InvalidConfigError
placeMine(myConfig, myBoard, 100, 3); // throws OutOfBoundsError
```

**`throws`** [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md) if `config` is not valid.

**`throws`** [OutOfBoundsError](../classes/_lib_utils_.outofboundserror.md) if `x` and `y` indicate a cell that is out
 of bounds for `config`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) | For reference. |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) | Board on which to place the mine. |
`x` | number | X coordinate of the target [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |
`y` | number | Y coordinate of the target [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |

**Returns:** *boolean*

`true` if a modification took place; `false` otherwise.

___

###  placeMines

▸ **placeMines**(`config`: [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md), `board`: [MinesweeperBoard](_types_.md#minesweeperboard), `seedX`: number, `seedY`: number): *[MinesweeperBoard](_types_.md#minesweeperboard)*

Randomly places mines on `board` (using [placeMine](_lib_utils_.md#placemine)), avoiding the
 [MinesweeperCell](../interfaces/_types_.minesweepercell.md) specified by `seedX` and `seedY`.

In practice, the board is not populated with mines until the user clicks the
 first cell. This means that the first cell the user clicks can never be a
 mine, and this is why [getBoard](_lib_utils_.md#getboard) and this function are separate.

**Warning:** This is <u>not</u> a pure function.

```ts
const myConfig = { x: 10, y: 15, mines: 100 }
const myBoard = getBoard(myConfig)

placeMines(myConfig, myBoard, 4, 7)

// `myBoard` will now be randomly populated with mines and the cells'
//  `mineCount` will be set.
```

**`throws`** [InvalidConfigError](../classes/_lib_utils_.invalidconfigerror.md) if `config` is not valid.

**`throws`** [OutOfBoundsError](../classes/_lib_utils_.outofboundserror.md) if `seedX` and `seedY` indicate a cell that
 is out of bounds for `config`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) | [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md) used to generate `board` (for reference). |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) | [MinesweeperBoard](_types_.md#minesweeperboard) on which to place the mines. |
`seedX` | number | X coordinate of the seed [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |
`seedY` | number | Y coordinate of the seed [MinesweeperCell](../interfaces/_types_.minesweepercell.md). |

**Returns:** *[MinesweeperBoard](_types_.md#minesweeperboard)*

Modified `board` with randomly placed mines.

___

###  revealAllMines

▸ **revealAllMines**(`board`: [MinesweeperBoard](_types_.md#minesweeperboard)): *void*

Sets the `state` of all cells that have mines to [CELL_STATE.REVEALED](../enums/_lib_constants_.cell_state.md#revealed).
- This is to be called when the user loses the game by revealing a mine.

**Warning:** This is <u>not</u> a pure function.

**Parameters:**

Name | Type |
------ | ------ |
`board` | [MinesweeperBoard](_types_.md#minesweeperboard) |

**Returns:** *void*
