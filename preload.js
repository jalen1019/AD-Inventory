// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require('electron')
// Expose Computer API 
contextBridge.exposeInMainWorld('tableData', {
  loaded: false,
})

window.addEventListener('DOMContentLoaded', () => {
  // Set up database access
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

    // On successful database creation/update
    request.onsuccess = (event) => {
      db = event.target?.result;
    };
  };

  // Event handler for successful database open
  request.onsuccess = (event) => {
    db = event.target?.result;
    const transaction = db.transaction("computers", "readonly");
    const computerObjectStore = transaction.objectStore("computers");
    let request = computerObjectStore.getAll();

    // On successful database read
    request.onsuccess = (event) => {
      let tableBody = document.querySelector('#table-body');

      // Populate table with information
      request.result.forEach(element => {
        // Set up table row and cells for population
        let row = tableBody.insertRow();
        let editGroupCell = row.insertCell();
        let previousUser = row.insertCell();
        let currentUser = row.insertCell();
        let computerName = row.insertCell();
        let modelName = row.insertCell();
        let cpuModel = row.insertCell();
        let ramSize = row.insertCell();
        let storage = row.insertCell();
        let storageType = row.insertCell();
        let monitorCount = row.insertCell();

        // Populate table with information
        previousUser.innerHTML = element.previousUser;
        currentUser.innerHTML = element.currentUser;
        computerName.innerHTML = element.computerName;
        modelName.innerHTML = element.modelName;
        cpuModel.innerHTML = element.cpuModel;
        ramSize.innerHTML = element.ramSize;
        storage.innerHTML = element.storage;
        storageType.innerHTML = element.storageType;
        monitorCount.innerHTML = element.monitorCount;

        // Create edit and delete buttons
        let editButtonGroup = document.createElement('div');
        let editButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Setup edit and delete button container
        editButtonGroup.className = 'btn-group';
        editButtonGroup.setAttribute('role', 'group');
        
        // Setup edit button
        editButton.type = 'button';
        editButton.classList.add('btn', 'btn-primary', 'editButton');
        editButton.innerHTML = '✏️';
        
        // Setup delete button
        deleteButton.type = 'button';
        deleteButton.classList.add('btn', 'btn-primary', 'deleteButton');
        deleteButton.innerHTML = '❌';

        // Delete button modal setup
        deleteButton.setAttribute('data-bs-toggle', 'modal');
        deleteButton.setAttribute('data-bs-target', '#deleteModal');
        
        // Add edit button group to table cell
        editButtonGroup.appendChild(editButton);
        editButtonGroup.appendChild(deleteButton);
        editGroupCell.appendChild(editButtonGroup);
      });

      // Define emit custom event to signal completed table population.
      const customEvent = new Event('tablePopulated');
      customEvent.target = tableBody;
      window.dispatchEvent(customEvent);
    };
  };
});