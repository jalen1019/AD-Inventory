// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Initialize the database
const Store = require('electron-store');

const schema = {
  computer: {
    type: 'object',
    properties: {
      previousUser: {
        type: 'string'
      },
      currentUser: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      model: {
        type: 'string'
      },
      cpu: {
        type: 'string'
      },
      ram: {
        type: 'number'
      },
      storage: {
        type: 'number'
      },
      storage_type: {
        'enum': ['SSD', 'HDD']
      },
      monitor: {
        type: 'object',
        properties: {
          monitor_count: {
            type: 'integer', 
            default: 1
          },
          monitor_size: {
            type: 'integer'
          }
        }
      }
    }
  }
}

const store = new Store({schema});

// Add handlers for ipcRenderer events
ipcMain.handle('electron-store-set', (key, value) => { store.set(key, value) });
ipcMain.handle('electron-store-get', (key) => { store.get(key) });