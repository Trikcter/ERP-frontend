import { remote } from "electron";

const closeWindows = () => {
  let windows = remote.BrowserWindow.getFocusedWindow();
  windows.close();
};

const minimizeWindows = () => {
  let windows = remote.BrowserWindow.getFocusedWindow();
  windows.minimize();
};

const maximazeWindows = () => {
  let windows = remote.BrowserWindow.getFocusedWindow();
  windows.isMaximized() ? windows.unmaximize() : windows.maximize();
};

export { closeWindows, minimizeWindows, maximazeWindows };
