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
    };
});