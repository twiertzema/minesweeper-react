import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";

import { IPC_MESSAGE } from "./lib/constants";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const isMac = process.platform === "darwin";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    width: 800
  });

  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Game",
      submenu: [
        {
          label: "New",
          accelerator: "F2",
          click: () => {
            // Send a message to the renderer process.
            mainWindow.webContents.send(IPC_MESSAGE.NEW_GAME);
          }
        },
        { type: "separator" },
        { label: "Beginner", type: "checkbox", enabled: false, checked: true },
        { label: "Intermediate", type: "checkbox", enabled: false },
        { label: "Expert", type: "checkbox", enabled: false },
        { label: "Custom...", type: "checkbox", enabled: false },
        { type: "separator" },
        { label: "Marks (?)", type: "checkbox", enabled: false, checked: true },
        { label: "Color", type: "checkbox", enabled: false, checked: true },
        { label: "Sound", type: "checkbox", enabled: false },
        { type: "separator" },
        { label: "Best Times...", enabled: false },
        { type: "separator" },
        { label: "Exit", role: "quit" }
      ]
    },
    {
      label: "Help",
      submenu: [
        { label: "Contents", accelerator: "F1", enabled: false },
        { label: "Search for Help on...", enabled: false },
        { label: "Using Help", enabled: false },
        { type: "separator" },
        { label: "About Minesweeper...", enabled: false }
      ]
    }
  ];

  if (isMac) {
    menuTemplate.unshift({ role: "appMenu" });
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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
