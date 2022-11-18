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
        
        let storageTypeValue = document.querySelector('#storageType')
            .options[storageType.selectedIndex].text;
        computer.storageType = storageTypeValue;
        
        const transaction = db.transaction(["computers"], "readwrite");
        const computerObjectStore = transaction.objectStore("computers");
    
        computerObjectStore.add(computer);
        location.reload();
    };
});

// Event listener for edit button click
window.addEventListener('tablePopulated', event => {
    let tableBody = event.target;
    console.log('tableBody: ', tableBody);
    document.querySelectorAll('.editButton').forEach(element => {
        element.addEventListener('click', event => {
            // TODO: On edit button click, convert all row cells to input fields.
            let row = event.target.closest('tr');
            console.log(row);
        });
    })
});

// Event handler for delete button click
let deleteItemModal = document.getElementById('deleteModal');
deleteModal.addEventListener('shown.bs.modal', (event) => {
    let rowDeleteButton = event.relatedTarget;
    let row = rowDeleteButton.closest('tr');
    // row.children[3] corresponds to computerName field
    let computerName = row.children[3].innerHTML;
    
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