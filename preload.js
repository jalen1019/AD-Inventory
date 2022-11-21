// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require('electron')
// Expose Computer API 
contextBridge.exposeInMainWorld('tableData', {
  loaded: false,
})

