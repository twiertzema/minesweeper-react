[minesweeper-react](../README.md) › [Globals](../globals.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [MinesweeperCell](../interfaces/_types_.minesweepercell.md)
* [MinesweeperConfig](../interfaces/_types_.minesweeperconfig.md)

### Type aliases

* [MinesweeperBoard](_types_.md#minesweeperboard)
* [forEachAdjacentCellCallback](_types_.md#foreachadjacentcellcallback)

## Type aliases

###  MinesweeperBoard

Ƭ **MinesweeperBoard**: *Array‹Array‹[MinesweeperCell](../interfaces/_types_.minesweepercell.md)››*

2-dimensional `Array` representing a board in Minesweeper.

**Note:** The first order of arrays represents the rows of the board, and the
 second order represents the columns. This means that the Y coordinate of a
 given [MinesweeperCell](../interfaces/_types_.minesweepercell.md) is used as the index of the first order and
 the X coordinate is used as the index of the second order.

___

###  forEachAdjacentCellCallback

Ƭ **forEachAdjacentCellCallback**: *function*

The format for the `action` parameter of [forEachAdjacentCell](_lib_utils_.md#foreachadjacentcell).

#### Type declaration:

▸ (`cell`: [MinesweeperCell](../interfaces/_types_.minesweepercell.md), `x`: number, `y`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`cell` | [MinesweeperCell](../interfaces/_types_.minesweepercell.md) |
`x` | number |
`y` | number |
