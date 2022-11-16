// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require('electron')
// Expose Computer API 
contextBridge.exposeInMainWorld('computer', {

})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }

    // Populate the table
    const request = window.indexedDB.open("ComputerDatabase", 1);
    let db;
    
    request.onerror = (event) => {
      console.error(event);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      const objectStore = db.createObjectStore("computers", { autoIncrement : true });

      // Add an index for each field present in the database.
      objectStore.createIndex("previousUser", "previousUser", { unique : false });
      objectStore.createIndex("currentUser", "currentUser", { unique : false });
      objectStore.createIndex("computerName", "computerName", { unique : true });
      objectStore.createIndex("modelName", "modelName", { unique : false });
      objectStore.createIndex("cpuModel", "cpuModel", { unique : false });
      objectStore.createIndex("ramSize", "ramSize", { unique : false });
      objectStore.createIndex("storage", "storage", { unique : false });
      objectStore.createIndex("storageType", "storageType", { unique : false });
      objectStore.createIndex("monitorCount", "monitorCount", { unique : false });
      objectStore.createIndex("monitorSize", "monitorSize", { unique : false });

      request.onsuccess = (event) => {
        db = event.target?.result;
      };
    };
});