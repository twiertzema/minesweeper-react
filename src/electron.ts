import { BrowserWindow } from "electron";

/**
 * Enum representing the Electron IPC message channels for the main process.
 * @private
 */
export enum IPC_CHANNEL_MAIN {
  RESIZE_WINDOW = "resize-window"
}

/**
 * Enum representing the Electron IPC message channels for the renderer process.
 * @private
 */
export enum IPC_CHANNEL_RENDERER {
  DIFFICULTY_BEGINNER = "difficulty-beginner",
  DIFFICULTY_EXPERT = "difficulty-expert",
  DIFFICULTY_INTERMEDIATE = "difficulty-intermediate",
  NEW_GAME = "new-game",
}

/**
 * Generates a very simple IPC channel notifier.
 * @param window
 * @param channel - The IPC channel to which to notify.
 */
export const getSimpleIpcNotifier = (
  window: BrowserWindow,
  channel: IPC_CHANNEL_RENDERER
) => () => {
  // Send a message to the renderer process.
  window.webContents.send(channel);
};
