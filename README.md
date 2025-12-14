# 🍽️ Restaurant Billing & Management System

![Project Status](https://img.shields.io/badge/Status-Live-green?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-FullStack_Serverless-blue?style=flat-square)
![Payment](https://img.shields.io/badge/Payment-Razorpay-blueviolet?style=flat-square)

A comprehensive, full-stack web application designed to streamline restaurant operations. It manages the entire workflow from menu creation and table ordering to real-time kitchen updates and final billing with online payment integration.

## 🔗 Live Demo
**[Click here to use the Live App](https://probal08.github.io/Restro-Billing-Software/)**

> **Note:** To test the app, you need a login.
> * **Email:** `admin@gmail.com`
> * **Password:** `123456`

---

## 📸 Screenshots

| Dashboard View | Bill Receipt |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+UI) | ![Receipt](https://via.placeholder.com/400x200?text=Formatted+Receipt) |

---

## ✨ Key Features

### 👨‍💼 Admin Panel
* **Menu Management:** Real-time adding and deleting of menu items.
* **Pricing Control:** Set and update prices instantly across the system.

### 🤵 Waiter Panel
* **Visual Table Grid:** Color-coded tables showing status (Available 🟢, Occupied 🔴, Billing 🟠).
* **Customer Details:** Capture Name, Phone (with validation), and Address.
* **Order Management:** Add items to a table and send orders directly to the kitchen.

### 🧑‍🍳 Kitchen Panel (Real-Time)
* **Live KOT (Kitchen Order Tickets):** Orders appear instantly without refreshing (powered by Firestore listeners).
* **Workflow:** Kitchen staff marks orders as "Done" to notify the cashier.

### 💰 Cashier Panel
* **Automated Billing:** Auto-calculates Subtotal, CGST (2.5%), SGST (2.5%), and Round-off.
* **Payment Gateway:** Integrated **Razorpay** for UPI, Card, and Netbanking payments.
* **Bill History:** View and reprint past bills from a dedicated history panel.
* **Receipt Printing:** Generates professional, thermal-printer-friendly receipts.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Modern Flat UI), JavaScript (ES Modules).
* **Backend:** Google Firebase (Firestore Database & Authentication).
* **Payment:** Razorpay Standard Checkout Integration.
* **Hosting:** GitHub Pages.

---

## 🚀 How to Run Locally

If you want to run this project on your own machine or fork it:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/probal08/Restro-Billing-Software.git](https://github.com/probal08/Restro-Billing-Software.git)
    ```

2.  **Configuration (Firebase)**
    * Create a `firebaseConnect.js` file in the root directory.
    * Paste your Firebase config object inside it:
    ```javascript
    import { initializeApp } from "[https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js](https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js)";
    import { getFirestore } from "[https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js](https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js)";
    import { getAuth } from "[https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js](https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js)";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    export const auth = getAuth(app);
    ```

3.  **Configuration (Razorpay)**
    * Open `script.js`.
    * Find the `options` object inside the payment listener.
    * Replace the `key` with your own Razorpay Key ID.

4.  **Run**
    * Simply open `index.html` in your web browser.

---

## 🔄 Workflow

1.  **Login** as Admin.
2.  **Add Items** to the menu (Admin Panel).
3.  **Select a Table** (Waiter Panel), fill in customer details, and submit an order.
4.  **Mark as Done** in the Kitchen Panel.
5.  **Generate Bill** in the Cashier Panel.
6.  **Pay** using Cash or Online (Razorpay).
7.  **Print** the receipt or view it later in Bill History.

---

## 👤 Author

**Prabal Talukdar**
* GitHub: [@probal08](https://github.com/probal08)

---
*Developed as a Full-Stack Web Application Project.*
