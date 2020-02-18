import { MinesweeperConfig } from "../types";
export declare enum CELL_STATE {
    /**
     * Initial state of all [Cells](Cell). Defined as the absence of all other state.
     * */
    DEFAULT = 0,
    /**
     * The user has placed a flag on this {@link MinesweeperCell}. Flagged [Cells](Cell)
     * are not revealed when the user clicks on them.
     */
    FLAGGED = 1,
    /**
     * The user has revealed this {@link MinesweeperCell}. Once a {@link MinesweeperCell}
     * is revealed, the user can no longer interact with a cell.
     */
    REVEALED = 2,
    /**
     * The user has marked this {@link MinesweeperCell} with a question mark
     * indicating that they are unsure whether or not this {@link MinesweeperCell}
     * contains a mine.
     */
    QUESTIONED = 3
}
/** A 9×9 board with 10 mines. */
export declare const CONFIG_EASY: MinesweeperConfig;
/** A 16×16 board with 40 mines. */
export declare const CONFIG_INTERMEDIATE: MinesweeperConfig;
/** A 30×16 board with 99 mines. */
export declare const CONFIG_EXPERT: MinesweeperConfig;
/**
 * A 0×0 board with 0 mines. The initial state of a board before a different
 * configuration is loaded.
 */
export declare const CONFIG_DEFAULT: MinesweeperConfig;
