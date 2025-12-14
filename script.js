// --- 1. IMPORTS ---
import { db, auth } from './firebaseConnect.js'; // Using the renamed file
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
  getDocs,
  orderBy, 
  getDoc    
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


// --- 2. GET HTML ELEMENTS ---
const loginPage = document.getElementById('login-page');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const userEmailDisplay = document.getElementById('user-email-display');
const logoutButton = document.getElementById('logout-button');

// Admin Panel
const menuForm = document.getElementById('menu-form');
const menuListDiv = document.getElementById('menu-list');

// Waiter Panel
const tableGrid = document.getElementById('table-grid');
const orderModal = document.getElementById('order-modal');
const modalTableName = document.getElementById('modal-table-name');
const modalMenuList = document.getElementById('modal-menu-list');
const modalCurrentOrder = document.getElementById('modal-current-order');
const submitOrderButton = document.getElementById('submit-order-button');
const closeModalButton = document.getElementById('close-modal-button');
const customerNameInput = document.getElementById('order-customer-name');
const customerPhoneInput = document.getElementById('order-customer-phone');
const customerAddressInput = document.getElementById('order-customer-address');
const nameError = document.getElementById('name-error');
const phoneError = document.getElementById('phone-error');

// Kitchen Panel
const kotList = document.getElementById('kot-list');

// Cashier Panel
const billingTableList = document.getElementById('billing-table-list');
const billDetails = document.getElementById('bill-details');

// Bill History Panel
const billHistoryList = document.getElementById('bill-history-list');
const billHistoryDetail = document.getElementById('bill-history-detail');
const loadHistoryBtn = document.getElementById('load-history-btn');


// --- 3. GLOBAL VARIABLES ---
let allMenuItems = []; 
let currentOrder = []; 
let currentTableId = null; 
let currentTableName = null;


// --- 4. AUTH STATE LISTENER ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
    userEmailDisplay.textContent = user.email;
    loadAppFeatures();
  } else {
    loginPage.style.display = 'block';
    dashboard.style.display = 'none';
    userEmailDisplay.textContent = '';
  }
});

// --- 5. LOGIN/LOGOUT FUNCTIONS ---
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error);
    alert(error.message);
  }
});

logoutButton.addEventListener('click', () => {
  signOut(auth);
});


// --- 6. MAIN FEATURE LOADER ---
function loadAppFeatures() {
  loadMenu();
  cacheMenu();
  loadTables();
  loadKitchenOrders();
  loadBillingTables();
}


// --- 7. ADMIN FUNCTIONS ---
function loadMenu() {
  onSnapshot(collection(db, "menuItems"), (querySnapshot) => {
    menuListDiv.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const itemID = doc.id;
      const itemElement = document.createElement('div');
      itemElement.classList.add('menu-item');
      itemElement.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-price">₹${item.price.toFixed(2)}</span>
        <button class="delete-btn" data-id="${itemID}">Delete</button>
      `;
      menuListDiv.appendChild(itemElement);
    });
  });
}

menuForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('menu-item-name').value;
  const price = document.getElementById('menu-item-price').value;
  try {
    await addDoc(collection(db, "menuItems"), { name: name, price: Number(price) });
    menuForm.reset();
  } catch (error) {
    console.error("Error adding menu item: ", error);
  }
});

menuListDiv.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    if (confirm("Are you sure?")) {
      try {
        await deleteDoc(doc(db, "menuItems", id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  }
});


// --- 8. WAITER FUNCTIONS ---
function cacheMenu() {
  onSnapshot(collection(db, "menuItems"), (snapshot) => {
    allMenuItems = [];
    modalMenuList.innerHTML = '';
    snapshot.forEach((doc) => {
      const item = { ...doc.data(), id: doc.id };
      allMenuItems.push(item);
      const itemButton = document.createElement('button');
      itemButton.textContent = `${item.name} - ₹${item.price}`;
      itemButton.onclick = () => addItemToOrder(item);
      modalMenuList.appendChild(itemButton);
    });
  });
}

function loadTables() {
  onSnapshot(collection(db, "tables"), (snapshot) => {
    tableGrid.innerHTML = '';
    snapshot.forEach((doc) => {
      const table = { ...doc.data(), id: doc.id };
      const tableButton = document.createElement('button');
      tableButton.textContent = table.name;
      tableButton.className = `table-btn ${table.status}`;
      tableButton.onclick = () => {
        openOrderModal(table);
      };
      tableGrid.appendChild(tableButton);
    });
  });
}

function openOrderModal(table) {
  if (table.status !== 'available') {
    alert("This table is not available!");
    return;
  }
  currentTableId = table.id;
  currentTableName = table.name;
  currentOrder = [];
  modalTableName.textContent = `Order for ${table.name}`;

  customerNameInput.value = '';
  customerPhoneInput.value = '';
  customerAddressInput.value = '';
  nameError.textContent = '';
  phoneError.textContent = '';
  customerNameInput.classList.remove('invalid');
  customerPhoneInput.classList.remove('invalid');

  updateCurrentOrderDisplay();
  orderModal.style.display = 'flex';
}

function addItemToOrder(item) {
  const existingItem = currentOrder.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.qty++;
  } else {
    currentOrder.push({ ...item, qty: 1 });
  }
  updateCurrentOrderDisplay();
}

function updateCurrentOrderDisplay() {
  modalCurrentOrder.innerHTML = '';
  let total = 0;
  currentOrder.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    modalCurrentOrder.innerHTML += `<p>${item.qty} x ${item.name} - ₹${itemTotal.toFixed(2)}</p>`;
  });
  modalCurrentOrder.innerHTML += `<hr><strong>Total: ₹${total.toFixed(2)}</strong>`;
}

closeModalButton.onclick = () => {
  orderModal.style.display = 'none';
}

function validateCustomerInfo() {
  const name = customerNameInput.value.trim();
  const phone = customerPhoneInput.value.trim();

  const nameRegex = /^[A-Za-z\s]+$/; 
  const phoneRegex = /^\d{10}$/; 

  let isValid = true;

  nameError.textContent = '';
  phoneError.textContent = '';
  customerNameInput.classList.remove('invalid');
  customerPhoneInput.classList.remove('invalid');

  if (name && !nameRegex.test(name)) {
    nameError.textContent = 'Name can only contain letters and spaces.';
    customerNameInput.classList.add('invalid');
    isValid = false;
  }

  if (phone && !phoneRegex.test(phone)) {
    phoneError.textContent = 'Phone must be exactly 10 digits.';
    customerPhoneInput.classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

submitOrderButton.onclick = async () => {
  if (!validateCustomerInfo()) {
    alert("Please fix the errors in the customer details.");
    return;
  }

  if (currentOrder.length === 0) {
    alert("Cannot submit an empty order.");
    return;
  }
  let total = currentOrder.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const customerName = customerNameInput.value.trim();
  const customerPhone = customerPhoneInput.value.trim();
  const customerAddress = customerAddressInput.value.trim();

  try {
    await addDoc(collection(db, "orders"), {
      tableId: currentTableId,
      tableName: currentTableName,

      customerName: customerName || 'Walk-in',
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || '',

      items: currentOrder,
      total: total,
      status: "pending",
      createdAt: new Date()
    });

    await updateDoc(doc(db, "tables", currentTableId), {
      status: "occupied"
    });

    orderModal.style.display = 'none';
  } catch (error) {
    console.error("Error submitting order: ", error);
  }
};


// --- 9. KITCHEN FUNCTIONS ---
function loadKitchenOrders() {
  const q = query(collection(db, "orders"), where("status", "==", "pending"));
  onSnapshot(q, (snapshot) => {
    kotList.innerHTML = '';
    snapshot.forEach((doc) => {
      const order = { ...doc.data(), id: doc.id };
      const kotCard = document.createElement('div');
      kotCard.className = 'kot-card';
      let itemsHtml = order.items.map(item => `<p>${item.qty} x ${item.name}</p>`).join('');
      kotCard.innerHTML = `
        <h4>Table: ${order.tableName}</h4> 
        <small>Customer: ${order.customerName || 'Walk-in'}</small> 
        ${itemsHtml}
        <button class="kot-done-btn" data-id="${order.id}">Done</button>
      `;
      kotList.appendChild(kotCard);
    });
  });
}

kotList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('kot-done-btn')) {
    const orderId = e.target.dataset.id;
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "completed"
      });
    } catch (error) {
      console.error("Error completing order:", error);
    }
  }
});


// --- 10. CASHIER FUNCTIONS ---

let currentBillableOrder = null; 

function loadBillingTables() {
  const q = query(collection(db, "tables"), where("status", "in", ["occupied", "billing"]));
  onSnapshot(q, (snapshot) => {
    billingTableList.innerHTML = '';
    snapshot.forEach((doc) => {
      const table = { ...doc.data(), id: doc.id };
      const tableButton = document.createElement('button');
      tableButton.textContent = `${table.name} (${table.status})`;
      tableButton.className = `table-btn ${table.status}`;
      tableButton.onclick = () => showBill(table.id, table.status);
      billingTableList.appendChild(tableButton);
    });
  });
}

async function showBill(tableId, tableStatus) {

  const q = query(collection(db, "orders"),
    where("tableId", "==", tableId),
    where("status", "==", "completed")
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    billDetails.innerHTML = `<p>Waiting for kitchen to complete the order for this table.</p>`;
    return;
  }

  await updateDoc(doc(db, "tables", tableId), { status: "billing" });
  const orderDoc = querySnapshot.docs[0];

  currentBillableOrder = { ...orderDoc.data(), id: orderDoc.id };
  const order = currentBillableOrder; 

  const billNo = order.id.substring(0, 8).toUpperCase();
  const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-GB');
  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const cashierName = auth.currentUser.email.split('@')[0];
  let totalQty = 0;

  let billTable = `
    <table class="bill-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
  `;
  order.items.forEach(item => {
    totalQty += item.qty;
    billTable += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>₹${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `;
  });
  billTable += `</tbody></table><hr class="dotted">`;

  const subtotal = order.total;
  const cgst = subtotal * 0.025; 
  const sgst = subtotal * 0.025; 
  const totalBeforeRound = subtotal + cgst + sgst;
  const finalTotal = Math.round(totalBeforeRound);
  const roundOff = (finalTotal - totalBeforeRound).toFixed(2);

  const customerName = order.customerName || 'Walk-in';
  const customerPhone = order.customerPhone || 'N/A';
  const customerAddress = order.customerAddress || '';

  billDetails.innerHTML = `
    <div id="bill-receipt-content">
        <div class="bill-header">
            <h3>University Restaurant</h3> 
            <p>Pondicherry university, Pondicherry.</p>
            <p>GST: 34AGZPR9598K3ZU</p>
            <p>phone - 8474045166</p>
        </div>
        <hr class="dotted">
        <div class="bill-meta">
            <p>Date: ${formattedDate} ${formattedTime}</p>
            <p>Bill No.: ${billNo}</p>
            <p>Cashier: ${cashierName}</p>
            <p>Name: ${customerName}</p>
            <p>Phone: ${customerPhone}</p>
            ${customerAddress ? `<p>Address: ${customerAddress}</p>` : ''}
        </div>
        <hr class="dotted">
        ${billTable}
        <div class="bill-totals">
            <p>Total Qty: <span>${totalQty}</span></p>
            <p>Sub Total: <span>₹${subtotal.toFixed(2)}</span></p>
            <hr>
            <p>CGST (2.5%): <span>₹${cgst.toFixed(2)}</span></p>
            <p>SGST (2.5%): <span>₹${sgst.toFixed(2)}</span></p>
            <p>Round off: <span>${roundOff}</span></p>
            <hr class="dotted">
            <p class="bill-final-total">Grand Total: <span>₹${finalTotal.toFixed(2)}</span></p>
        </div>
        <div class="bill-footer">
            <p>Thanks & visit again !!!</p>
        </div>
    </div>

    <button class="pay-online-btn">Pay Online (Card/UPI)</button>
    <button class="mark-paid-btn" data-order-id="${order.id}" data-table-id="${tableId}">Mark as Paid (Cash)</button>
    <button class="print-bill-btn">Print Bill</button>
  `;
}

// *** NEW: THIS ENTIRE FUNCTION IS REPLACED TO HANDLE 3 BUTTONS ***
billDetails.addEventListener('click', async (e) => {

  // --- 1. MARK AS PAID (CASH) LOGIC ---
  if (e.target.classList.contains('mark-paid-btn')) {
    if (!currentBillableOrder) return;

    // Get the function from below
    await finalizeBillPayment(currentBillableOrder, e.target.dataset.tableId, "Cash"); 
  }

  // --- 2. PRINT BILL LOGIC ---
  if (e.target.classList.contains('print-bill-btn')) {
    window.print();
  }

  // --- 3. PAY ONLINE LOGIC ---
  if (e.target.classList.contains('pay-online-btn')) {
    if (!currentBillableOrder) return;

    // --- Start Razorpay Payment ---
    // A. Get customer details (or use defaults)
    const order = currentBillableOrder;
    const customerName = order.customerName || 'Walk-in';
    const customerPhone = order.customerPhone || '9999999999'; // Razorpay requires a phone #
    const customerEmail = auth.currentUser.email || 'customer@email.com'; // Use cashier's email

    // B. Calculate final total
    const subtotal = order.total;
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    const finalTotal = Math.round(subtotal + cgst + sgst);
    const amountInPaisa = finalTotal * 100; // Razorpay needs amount in paisa

    var options = {
        "key": "rzp_test_RbMxpYHx5MCHkn", // <-- IMPORTANT: REPLACE WITH YOUR KEY ID
        "amount": amountInPaisa, 
        "currency": "INR",
        "name": "University Restaurant",
        "description": `Bill No: ${order.id.substring(0, 8).toUpperCase()}`,
        "prefill": {
            "name": customerName,
            "email": customerEmail,
            "contact": customerPhone
        },
        "theme": {
            "color": "#007bff"
        },
        "handler": async function (response){
            // This function runs on payment success
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            // Now, we finalize the bill, just like a cash payment
            await finalizeBillPayment(order, order.tableId, "Online");
        },
        "modal": {
            "ondismiss": function(){
                alert("Payment cancelled.");
            }
        }
    };

    // Create and open the Razorpay payment modal
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
    });
    rzp1.open();
  }
});


// *** NEW HELPER FUNCTION TO SAVE THE BILL ***
// This function is called by both "Mark as Paid" and "Pay Online"
async function finalizeBillPayment(order, tableId, paymentMethod) {
  try {
    // 1. Recalculate all bill values to save them
    const subtotal = order.total;
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    const totalBeforeRound = subtotal + cgst + sgst;
    const finalTotal = Math.round(totalBeforeRound);
    const roundOff = (finalTotal - totalBeforeRound);
    const billNo = order.id.substring(0, 8).toUpperCase();
    const cashierName = auth.currentUser.email.split('@')[0];
    const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
    const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();

    // 2. Create the final "bill" object to be saved
    const billToSave = {
      billNo: billNo,
      orderId: order.id,
      tableId: tableId,
      tableName: order.tableName,

      customerName: order.customerName || 'Walk-in',
      customerPhone: order.customerPhone || '',
      customerAddress: order.customerAddress || '',

      cashierName: cashierName,
      createdAt: orderDate,
      items: order.items,
      totalQty: totalQty,
      subtotal: subtotal,
      cgst: cgst,
      sgst: sgst,
      roundOff: roundOff,
      grandTotal: finalTotal,
      paymentMethod: paymentMethod // <-- NEW: Save how it was paid
    };

    // 3. Save this object to a new "bills" collection in Firebase
    const billRef = await addDoc(collection(db, "bills"), billToSave);
    console.log("Bill saved successfully with ID: ", billRef.id);

    // 4. Update the original order status to "paid"
    await updateDoc(doc(db, "orders", order.id), {
      status: "paid"
    });

    // 5. Update the table status to "available"
    await updateDoc(doc(db, "tables", tableId), {
      status: "available"
    });

    // 6. Clear the UI
    billDetails.innerHTML = `<p>Payment complete (${paymentMethod}). Bill saved. Table is now available.</p>`;
    currentBillableOrder = null; // Clear the saved order

  } catch (error) {
    console.error("Error finalizing payment:", error);
    alert("Error saving bill: " + error.message);
  }
}


// --- 11. BILL HISTORY FUNCTIONS ---
loadHistoryBtn.addEventListener('click', async () => {
  loadBillHistory();
});

async function loadBillHistory() {
  billHistoryList.innerHTML = '<p>Loading history...</p>';
  billHistoryDetail.style.display = 'none'; 
  billHistoryList.style.display = 'block';  

  try {
    const q = query(collection(db, "bills"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      billHistoryList.innerHTML = '<p>No saved bills found.</p>';
      return;
    }

    billHistoryList.innerHTML = ''; 

    querySnapshot.forEach((doc) => {
      const bill = doc.data();
      const billId = doc.id;

      const billItem = document.createElement('div');
      billItem.className = 'bill-list-item';
      billItem.innerHTML = `
        <div>
          <strong>Bill No: ${bill.billNo}</strong> (Customer: ${bill.customerName})<br>
          <small>${bill.createdAt.toDate().toLocaleString('en-IN')} - ${bill.paymentMethod}</small>
        </div>
        <div>
          <strong>Total: ₹${bill.grandTotal.toFixed(2)}</strong>
          <button class="view-bill-btn" data-id="${billId}">View</button>
        </div>
      `;
      billHistoryList.appendChild(billItem);
    });

  } catch (error)
 {
    console.error("Error loading bill history:", error);
    billHistoryList.innerHTML = `<p>Error: ${error.message}</p><p>You may need to create a Firestore Index. Check the console (F12) for a link.</p>`;
  }
}

billHistoryList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('view-bill-btn')) {
    const billId = e.target.dataset.id;
    showBillDetail(billId);
  }
});

async function showBillDetail(billId) {
  try {
    const docRef = doc(db, "bills", billId);
    const docSnap = await getDoc(docRef); 

    if (!docSnap.exists()) {
      billHistoryDetail.innerHTML = '<p>Error: Bill not found.</p>';
      return;
    }

    const bill = docSnap.data();

    let billTable = `
      <table class="bill-table">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
        <tbody>
    `;
    bill.items.forEach(item => {
      billTable += `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${(item.price * item.qty).toFixed(2)}</td>
        </tr>
      `;
    });
    billTable += `</tbody></table><hr class="dotted">`;

    const customerName = bill.customerName || 'Walk-in';
    const customerPhone = bill.customerPhone || 'N/A';
    const customerAddress = bill.customerAddress || '';

    billHistoryDetail.innerHTML = `
      <button class="back-to-list-btn">← Back to List</button>
      <br><br>
      <div id="bill-receipt-content">
          <div class="bill-header">
              <h3>University Restaurant</h3> 
              <p>Pondicherry university, Pondicherry.</p>
              <p>GST: 34AGZPR9598K3ZU</p>
              <p>phone - 8474045166</p>
          </div>
          <hr class="dotted">
          <div class="bill-meta">
              <p>Date: ${bill.createdAt.toDate().toLocaleString('en-IN')}</p>
              <p>Bill No.: ${bill.billNo}</p>
              <p>Cashier: ${bill.cashierName}</p>
              <p>Payment: ${bill.paymentMethod}</p>
              <p>Name: ${customerName}</p>
              <p>Phone: ${customerPhone}</p>
              ${customerAddress ? `<p>Address: ${customerAddress}</p>` : ''}
          </div>
          <hr class="dotted">
          ${billTable}
          <div class="bill-totals">
              <p>Total Qty: <span>${bill.totalQty}</span></p>
              <p>Sub Total: <span>₹${bill.subtotal.toFixed(2)}</span></p>
              <hr>
              <p>CGST (2.5%): <span>₹${bill.cgst.toFixed(2)}</span></p>
              <p>SGST (2.5%): <span>₹${sgst.toFixed(2)}</span></p>
              <p>Round off: <span>${bill.roundOff.toFixed(2)}</span></p>
              <hr class="dotted">
              <p class="bill-final-total">Grand Total: <span>₹${bill.grandTotal.toFixed(2)}</span></p>
          </div>
          <div class="bill-footer">
              <p>Thanks & visit again !!!</p>
          </div>
      </div>
      <br>
      <button class="print-bill-btn">Print This Bill</button>
    `;

    billHistoryList.style.display = 'none';
    billHistoryDetail.style.display = 'block';

  } catch (error) {
    console.error("Error showing bill detail:", error);
  }
}

billHistoryDetail.addEventListener('click', (e) => {
  if (e.target.classList.contains('back-to-list-btn')) {
    billHistoryDetail.style.display = 'none';
    billHistoryList.style.display = 'block';
  }
  if (e.target.classList.contains('print-bill-btn')) {
    window.print();
  }
});