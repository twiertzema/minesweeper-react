import { BrowserWindow, Menu, app, ipcMain } from "electron";

import { getMenuTemplate } from "./main/menu";

import { IPC_CHANNEL_MAIN } from "./electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const isMac = process.platform === "darwin";

const INITIAL_HEIGHT = 600;
const INITIAL_WIDTH = 800;

// Need this to truly calculate content size (barf).
// - To be determined after "did-finish-load".
let menuHeight = 0;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: INITIAL_HEIGHT,
    resizable: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
    width: INITIAL_WIDTH,
  });

  // Set up the menu.
  const menuTemplate = getMenuTemplate(mainWindow);

  if (isMac) {
    menuTemplate.unshift({ role: "appMenu" });
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // IPC listeners.
  ipcMain.on(IPC_CHANNEL_MAIN.RESIZE_WINDOW, (event, width, height) => {
    // Need to take the menu's height into account here (good grief).
    const trueHeight = height + menuHeight;

    // NOTE: Does NOT take the menu's height into account (*facepalm*).
    mainWindow.setContentSize(width, trueHeight);
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Window lifecycle event listeners.
  mainWindow.webContents.on("did-finish-load", () => {
    // Calculate the invisible pixels getting eaten by the menu.
    const contentSize = mainWindow.getContentSize();
    menuHeight = INITIAL_HEIGHT - contentSize[1];
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
