[minesweeper-react](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [MinesweeperConfig](_types_.minesweeperconfig.md)

# Interface: MinesweeperConfig

Configuration object that defines a board's setup.

## Hierarchy

* **MinesweeperConfig**

## Index

### Properties

* [mines](_types_.minesweeperconfig.md#mines)
* [x](_types_.minesweeperconfig.md#x)
* [y](_types_.minesweeperconfig.md#y)

## Properties

###  mines

• **mines**: *number*

Number of mines contained on the board.
*Note:* Must adhere to the following rules:
- Must be >= `0`.
- Must be <= the product of `x` and `y`.

___

###  x

• **x**: *number*

Number of mines on the X axis. *Note:* Must be >= `0`.

___

###  y

• **y**: *number*

Number of mines on the Y axis. *Note:* Must be >= `0`.
