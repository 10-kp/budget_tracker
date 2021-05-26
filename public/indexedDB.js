let db;
// create a new db request for a "BudgetDB" database.
const request = indexedDB.open('budgetDB', 1);

request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const db = event.target.result;
  const dbStore = db.createObjectStore('budgetStore', { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error
  console.log('An error connecting to database', event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(['budgetStore'], 'readwrite');
  // access pending object store
  const store = transaction.objectStore('budgetStore');
  // add record store with add method.
  console.log(record);
  store.add(record);
}

function checkDatabase() {
  // Open a transaction on pending db
  // Access pending object store
  // Get all records from store and set to a variable
  const transaction = db.transaction(['budgetStore'], 'readwrite');
  const store = transaction.objectStore('budgetStore');
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // Open a transaction on pending db if successful
          // Access pending object store
          // Clear all items in your store
          const transaction2 = db.transaction(['budgetStore'], 'readwrite');
          const store = transaction2.objectStore('budgetStore');
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
