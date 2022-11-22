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
          editButton.setAttribute('data-bs-toggle', 'modal');
          editButton.setAttribute('data-bs-target', '#addRecord');
          editButton.setAttribute('data-editDeviceModalLabel', 'Edit Device');

          // Add event listener for each edit button which populates the modal with
          // current row data.
          editButton.addEventListener('click', event => {
            let form = document.querySelector('#addDeviceForm');
            form.querySelector('#previousUser').value = element.previousUser;
            form.querySelector('#currentUser').value = element.currentUser;
            form.querySelector('#computerName').value = element.computerName;
            form.querySelector('#modelName').value = element.modelName;
            form.querySelector('#cpuModel').value = element.cpuModel;
            form.querySelector('#ramSize').value = element.ramSize;
            form.querySelector('#storage').value = element.storage;
            form.querySelector('#storageType').value = element.storageType;
            form.querySelector('#monitorCount').value = element.monitorCount;
          });
          
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
        
        //*
        // Define custom event to signal completed table population.
        const customEvent = new Event('tablePopulated');
        //customEvent.target = tableBody;
        window.dispatchEvent(customEvent);
        //*/
      };
    };
  });

// Disable form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('click', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
})();


// Event listener for computer submission
document.getElementById('submitBtn').addEventListener('click', () => {
    const request = indexedDB.open("ComputerDatabase", 1);
    let db;

    request.onsuccess = (event) => {
      db = event.target.result;

      let computer = {
          previousUser: document.querySelector('#previousUser').value,
          currentUser: document.querySelector('#currentUser').value,
          computerName: document.querySelector('#computerName').value,
          modelName: document.querySelector('#modelName').value,
          cpuModel: document.querySelector('#cpuModel').value,
          ramSize: document.querySelector('#ramSize').value,
          storage: document.querySelector('#storage').value,
          monitorCount: document.querySelector('#monitorCount').value,
          //monitorSize: document.querySelector('#monitorSize').value
      }

      //computer.monitorSize = document.querySelector('#monitorSize').value;
        
      // Add storageType attribute to computer object.
      let storageTypeValue = document.querySelector('#storageType')
        .options[storageType.selectedIndex].text;
      computer.storageType = storageTypeValue;

      const transaction = db.transaction(["computers"], "readwrite");
      const computerObjectStore = transaction.objectStore("computers");

      // Check if computer name already exists in database
      let validationCheck = computerObjectStore.index('computerName').getKey(computer.computerName);

      validationCheck.onsuccess = (event) => {
        // Display new modal for overwriting existing entry
        let addRecordModalEl = document.getElementById('addRecord');
        let addRecordModal = bootstrap.Modal.getInstance(addRecordModalEl);
        addRecordModal.hide();
        let overwriteModal = new bootstrap.Modal(
          document.getElementById('overwriteModal')
        );
        overwriteModal.show();

        // Event handler for submission event
        let overwriteSubmit = document.querySelector('#overwriteItemSubmit');
        overwriteSubmit.addEventListener('click', () => {
          let computerObjectStore = db
            .transaction(['computers'], 'readwrite')
            .objectStore('computers');
          let updateRequest = computerObjectStore.get(event.target.result);
            updateRequest.onsuccess = (event) => {
              const data = event.target.result;

              computerObjectStore.put(computer);
            };
        });
      validationCheck.onerror = (event) => {
        console.log(`Error: ${event.target.result}`);
      };
        
        // This will fail if a duplicate computer name is already registered.
        let addition = computerObjectStore.add(computer);
        addition.onsuccess = () => {
          location.reload();
        };

        addition.onerror = (event) => {
          // Show alert with error message
          let errorMessageContainer = document.createElement('div');
          let dismissButton = document.createElement('button');
          errorMessageContainer.classList.add(
            'alert', 
            'alert-warning', 
            'alert-dismissible', 
            'fade', 
            'show'
          );
          errorMessageContainer.setAttribute('role', 'alert');
          errorMessageContainer.textContent = `Database entry updated: ${computer.computerName}`;
          
          dismissButton.setAttribute('type', 'button');
          dismissButton.classList.add('btn-close');
          dismissButton.setAttribute('data-bs-dismiss', 'alert');
          dismissButton.setAttribute('aria-label', 'Close');
          errorMessageContainer.append(dismissButton);

          document.querySelector('#dataTable')
            .insertAdjacentElement('beforebegin', errorMessageContainer);
        };
      };
    };
});

// Event handler for delete button click
let deleteItemModal = document.getElementById('deleteModal');
deleteModal.addEventListener('shown.bs.modal', (event) => {
    let rowDeleteButton = event.relatedTarget;
    let row = rowDeleteButton.closest('tr');
    // row.children[3] corresponds to computerName field
    let computerName = row.children[3].innerHTML;
    
    // Event handler for submission button click.
    document.getElementById('deleteItemModalSubmit').addEventListener('click', (event) => {    
        // Setup database transaction to find item.
        const request = indexedDB.open("ComputerDatabase", 1);
        let db;

        // Try to find item index based on computerName 
        request.onsuccess = (event) => {
            db = event.target.result;
            const computerNameIndex = db
                .transaction(['computers'], 'readonly')
                .objectStore('computers')
                .index('computerName');
            let keyRequest = computerNameIndex.getKey(computerName);

            // Handle computerName key found
            keyRequest.onsuccess = () => {
                const transaction = db
                    .transaction(['computers'], 'readwrite')
                    .objectStore('computers')
                    .delete(keyRequest.result);
                transaction.onsuccess = (event) => {
                    console.log('deleted: ', computerName);
                };
            };
        }
        request.onerror = (event) => {
            console.log(`error deleting ${computerName}: ${event}`);
        };
        location.reload();
    });
});

// Event handler for hiding modal dialog
let addRecordModal = document.querySelector('#addRecord');
addRecordModal.addEventListener('hidden.bs.modal', () => {
  addRecordModal.querySelector('form').reset();
});
