let db;

// create a new db request for a "BudgetDB" database.
const request = indexedDB.open('budgetDB', 1);

request.onupgradeneeded = (event) => {
  // Create object store called "budgetStore"
  const db = event.target.result;
  db.createObjectStore('BudgetStore', { autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;

  // Check if app is online before reading from db
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
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  // access pending object store
  const store = transaction.objectStore('BudgetStore');
  // add record store with add method.
  console.log(record);
  store.add(record);
}

function checkDatabase() {
  // Open a transaction on pending db
  // Access pending object store
  // Get all records from store and set to a variable
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  const store = transaction.objectStore('BudgetStore');
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
          const transaction2 = db.transaction(['BudgetStore'], 'readwrite');
          const store = transaction2.objectStore('BudgetStore');
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
