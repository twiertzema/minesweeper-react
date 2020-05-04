import React, {
  useState,
  useEffect,
  MouseEvent,
  MouseEventHandler,
} from "react";
import classnames from "classnames";

import { GAME_STATE } from "../lib/constants";
import { getMineDisplayCount } from "../lib/utils";
import { MinesweeperBoard, MinesweeperConfig } from "../types";

import styles from "./Tray.css";

interface RenderPropProps {
  // For the state of the smiley face.
  gameState: number;
  // For the text display.
  minesLeft: number;
  onSmileyClick: () => void;
  // For the text display.
  seconds: number;
}

type RenderProp = React.FC<RenderPropProps>;

interface TrayProps {
  board: MinesweeperBoard;
  children: RenderProp;
  gameState: GAME_STATE;
  onSmileyClick: () => void;
}

/**
 * Logical component for the game's "tray" (everything outside the board).
 * Accepts a render prop as `children`.
 */
export const Tray: React.FC<TrayProps> = ({
  board,
  children,
  gameState,
  onSmileyClick,
}) => {
  const [minesLeft, setMinesLeft] = useState(
    getMineDisplayCount(board, gameState)
  );
  const [seconds, setSeconds] = useState(0);

  // Calculate number of unflagged mines left.
  useEffect(() => {
    setMinesLeft(getMineDisplayCount(board, gameState));
  }, [board, gameState]);

  // Set up and manage the timer.
  useEffect(() => {
    let secondsIntervalId: NodeJS.Timeout | undefined = undefined;

    // If the game was just reset, reset the timer.
    if (gameState === GAME_STATE.DEFAULT) setSeconds(0);
    else if (gameState === GAME_STATE.SEEDED) {
      // Once the board is seeded, start the interval to count the seconds.
      secondsIntervalId = setInterval(() => {
        setSeconds((currentSeconds) => {
          if (currentSeconds + 1 >= 999 && secondsIntervalId) {
            clearInterval(secondsIntervalId);
            return 999; // Upper bound.
          }

          return currentSeconds + 1;
        });
      }, 1000);
    }

    return () => {
      // No matter what `gameState` changed to, stop the interval.
      if (secondsIntervalId) clearInterval(secondsIntervalId);
    };
  }, [gameState]);

  return children({ gameState, minesLeft, onSmileyClick, seconds });
};

interface XPTrayProps
  extends Omit<TrayProps, "children">,
    React.HTMLAttributes<HTMLElement> {}

const SMILEY_BUTTON_ID = "smiley-button";

/* Visual component for rendering `Tray` to mimic XP. */
export const XPTray: React.FC<XPTrayProps> = ({
  board,
  children,
  gameState,
  onSmileyClick,
  ...props
}) => {
  return (
    <Tray board={board} gameState={gameState} onSmileyClick={onSmileyClick}>
      {({ gameState, minesLeft, onSmileyClick, seconds }) => {
        const [isScared, setIsScared] = useState(false);

        return (
          <main
            {...props}
            className={classnames(styles.container, props.className)}
            onMouseDown={() => setIsScared(true)}
            onMouseUp={() => setIsScared(false)}
            onMouseLeave={() => setIsScared(false)}
          >
            {/* HUD */}
            <div className={classnames(styles.slot, styles.hud)}>
              <p className={styles.display}>
                {/* TODO: "0-X" bug for negative numbers. */}
                <span>{String(minesLeft).padStart(3, "0")}</span>
              </p>

              <button
                className={styles.smileyButton}
                id={SMILEY_BUTTON_ID}
                onClick={onSmileyClick}
                onMouseDown={(e) => {
                  // Eat the event so it doesn't get scared.
                  e.stopPropagation();
                }}
              >
                <img
                  className={classnames(styles.smileyImage, {
                    [styles.scared]: isScared,
                    [styles.cool]: gameState === GAME_STATE.WIN,
                    [styles.dead]: gameState === GAME_STATE.LOSE,
                  })}
                />
              </button>

              <p className={styles.display}>
                <span>{String(seconds).padStart(3, "0")}</span>
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
