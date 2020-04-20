import React, { useState, useEffect } from "react";
import classnames from "classnames";

import { GAME_STATE } from "../lib/constants";
import { MinesweeperBoard } from "../types";

import styles from "./Tray.css";

interface RenderPropProps {
  gameState: number; // For the state of the smiley face
  numberOfMines: number; // For the text display
  seconds: number; // For the text display
}

type RenderProp = (props: RenderPropProps) => React.ReactElement | null;

interface TrayProps {
  board: MinesweeperBoard;
  children: RenderProp;
  gameState: GAME_STATE;
}

/**
 * Logical component for the game's "tray" (everything outside the board).
 * Accepts a render prop as `children`.
 */
export const Tray: React.FC<TrayProps> = ({ children, gameState }) => {
  const [numberOfMines, setNumberOfMines] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let secondsIntervalId: NodeJS.Timeout | undefined = undefined;
    if (gameState === GAME_STATE.SEEDED) {
      // Once the board is seeded, start the interval to count the seconds.
      secondsIntervalId = setInterval(() => {
        setSeconds((currentSeconds) => {
          if (currentSeconds + 1 >= 999 && secondsIntervalId) {
            clearInterval(secondsIntervalId);
          }

          return currentSeconds + 1;
        });
      }, 1000);
    }

    return () => {
      // If the game was just reset, reset the timer.
      if (gameState === GAME_STATE.DEFAULT) setSeconds(0);

      // No matter what `gameState` changed to, stop the interval.
      if (secondsIntervalId) clearInterval(secondsIntervalId);
    };
  }, [gameState]);

  return children({ gameState, numberOfMines, seconds });
};

interface XPTrayProps
  extends Omit<TrayProps, "children">,
    React.HTMLAttributes<HTMLElement> {}

/* Visual component for rendering `Tray` to mimic XP. */
export const XPTray: React.FC<XPTrayProps> = ({
  board,
  children,
  gameState,
  ...props
}) => {
  return (
    <Tray board={board} gameState={gameState}>
      {({ gameState, numberOfMines, seconds }) => {
        return (
          <main
            {...props}
            className={classnames(styles.container, props.className)}
          >
            {/* HUD */}
            <div className={classnames(styles.slot, styles.hud)}>
              <p className={styles.display}>
                <span>{String(seconds).padStart(3, "0")}</span>
              </p>
              <p className={styles.display}>
                <span>{String(numberOfMines).padStart(3, "0")}</span>
              </p>
            </div>

            {/* Board */}
            <div className={classnames(styles.slot, styles.board)}>
              {children}
            </div>
          </main>
        );
      }}
    </Tray>
  );
};

export default XPTray;
