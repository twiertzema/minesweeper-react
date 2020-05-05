[minesweeper-react](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [MinesweeperCell](_types_.minesweepercell.md)

# Interface: MinesweeperCell

Object representing a cell on the board. These comprise the makeup of the
 [MinesweeperBoard](../modules/_types_.md#minesweeperboard).

## Hierarchy

* **MinesweeperCell**

## Index

### Properties

* [hasMine](_types_.minesweepercell.md#hasmine)
* [mineCount](_types_.minesweepercell.md#minecount)
* [state](_types_.minesweepercell.md#state)

## Properties

###  hasMine

• **hasMine**: *boolean*

Indicates whether or not this cell contains a mine.

**`default`** `false`

___

###  mineCount

• **mineCount**: *number*

Indicates how many mines are adjacent to this cell.

**`default`** `0`

___

###  state

• **state**: *[CELL_STATE](../enums/_lib_constants_.cell_state.md)*

Enum value indicating what state the cell is in.

**`default`** [CELL_STATE.DEFAULT](../enums/_lib_constants_.cell_state.md#default)
