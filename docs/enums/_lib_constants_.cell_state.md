[minesweeper-react](../README.md) › [Globals](../globals.md) › ["lib/constants"](../modules/_lib_constants_.md) › [CELL_STATE](_lib_constants_.cell_state.md)

# Enumeration: CELL_STATE

## Index

### Enumeration members

* [DEFAULT](_lib_constants_.cell_state.md#default)
* [FLAGGED](_lib_constants_.cell_state.md#flagged)
* [QUESTIONED](_lib_constants_.cell_state.md#questioned)
* [REVEALED](_lib_constants_.cell_state.md#revealed)

## Enumeration members

###  DEFAULT

• **DEFAULT**:

Initial state of all [Cells](Cell). Defined as the absence of all other state.

___

###  FLAGGED

• **FLAGGED**:

The user has placed a flag on this [MinesweeperCell](../interfaces/_types_.minesweepercell.md). Flagged [Cells](Cell)
are not revealed when the user clicks on them.

___

###  QUESTIONED

• **QUESTIONED**:

The user has marked this [MinesweeperCell](../interfaces/_types_.minesweepercell.md) with a question mark
indicating that they are unsure whether or not this [MinesweeperCell](../interfaces/_types_.minesweepercell.md)
contains a mine.

___

###  REVEALED

• **REVEALED**:

The user has revealed this [MinesweeperCell](../interfaces/_types_.minesweepercell.md). Once a [MinesweeperCell](../interfaces/_types_.minesweepercell.md)
is revealed, the user can no longer interact with a cell.
