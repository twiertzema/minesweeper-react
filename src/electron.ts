import { BrowserWindow } from "electron";

/**
 * Enum representing the Electron IPC message channels.
 * @private
 */
export enum IPC_MESSAGE {
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
  channel: IPC_MESSAGE
) => () => {
  // Send a message to the renderer process.
  window.webContents.send(channel);
};
