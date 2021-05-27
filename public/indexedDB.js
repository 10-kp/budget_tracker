let db;
// create a new db request for a "BudgetDB" database.
const request = indexedDB.open('budgetDB', 1);

request.onupgradeneeded = (event) => {
  // Create object store called "BudgetStore"
  // Set autoIncrement to true
  const db = event.target.result;
  const dbStore = db.createObjectStore('budgetStore', { autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = (event) => {
  // Generic error handler for all errors targeted at this database's requests
  console.log('Database error: ' + event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(['pending'], 'readwrite');
  // access pending object store
  const store = transaction.objectStore('pending');
  // add record store with add method.
  console.log(record);
  store.add(record);
}

function checkDatabase() {
  // Open a transaction on pending db
  // Access pending object store
  // Get all records from store and set to a variable
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = () => {
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
          const transaction2 = db.transaction(['pending'], 'readwrite');
          const store = transaction2.objectStore('pending');
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
