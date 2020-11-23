import { app, globalShortcut } from 'electron';
import { createCapacitorElectronApp } from '@capacitor-community/electron';

// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp({
  mainWindow: {
    windowOptions: {
      width: 500,
      webPreferences: {
        devTools: false
      }
    }
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', () => {
  myCapacitorApp.init();

  globalShortcut.register('Control+Shift+I', () => {
    return false;
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    myCapacitorApp.init();
  }
});

// Define any IPC or other custom functionality below here
