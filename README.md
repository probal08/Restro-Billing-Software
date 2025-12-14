# 🍽️ Restaurant Billing & Management System

![Project Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=github)
![Tech Stack](https://img.shields.io/badge/Stack-FullStack-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A complete, **serverless** web application designed to digitize the entire workflow of a restaurant. From menu management and order taking to real-time kitchen updates and final billing with **Razorpay** online payment integration.

## 🔗 Live Demo
### 👉 **[Click here to view the Live App](https://probal08.github.io/Restro-Billing-Software/)**

---

## 🔑 How to Login

To test the application, please use the following demo credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin / Manager** | `admin@gmail.com` | `123456` |

*(Note: Since this is a demo, all panels (Admin, Waiter, Kitchen, Cashier) are accessible from this single login.)*

---

## ✨ Key Features

### 👨‍💼 Admin Panel
* **Menu Management:** Add, update, and delete menu items instantly.
* **Real-time Updates:** Changes to the menu reflect immediately for all waiters.

### 🤵 Waiter Panel
* **Visual Table Grid:** Color-coded tables showing status at a glance:
    * 🟢 **Available**
    * 🔴 **Occupied** (Dining)
    * 🟠 **Billing** (Payment Pending)
* **Smart Ordering:**
    * Built-in validation for **Customer Name** & **10-digit Phone Number**.
    * Auto-save customer details for the final bill.

### 🧑‍🍳 Kitchen Panel (Real-Time)
* **Live KOT (Kitchen Order Tickets):** Orders appear instantly on the kitchen screen without refreshing (powered by Firestore listeners).
* **Order Tracking:** Kitchen staff marks orders as "Done," notifying the cashier instantly.

### 💰 Cashier Panel & Billing
* **Automated Calculations:** Automatically calculates Subtotal, **CGST (2.5%)**, **SGST (2.5%)**, and Round-off.
* **Payment Gateway:** Integrated **Razorpay** for seamless UPI, Card, and Netbanking payments.
* **Bill History:** A dedicated panel to view, reprint, and track all past sales.
* **Professional Receipts:** Generates a thermal-printer-style receipt with one-click printing.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Modern Flat UI), JavaScript (ES6+) |
| **Backend** | Google Firebase (Firestore Database & Authentication) |
| **Payments** | Razorpay Standard Checkout Integration |
| **Hosting** | GitHub Pages |

---

## 📸 Workflow

1.  **Login:** Secure staff login using Firebase Authentication.
2.  **Order:** Waiter selects a table, enters customer info, and submits items.
3.  **Cook:** Kitchen sees the KOT instantly and marks it complete.
4.  **Bill:** Cashier selects the table, reviews the total, and accepts payment (Cash or Online).
5.  **Archive:** The final bill is saved to the cloud history for future reference.

---

## 🚀 How to Run Locally

If you want to run this project on your own machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/probal08/Restro-Billing-Software.git](https://github.com/probal08/Restro-Billing-Software.git)
    ```

2.  **Open the project**
    Simply double-click `index.html` to open it in your web browser.

3.  **Configuration (Important)**
    * **Firebase:** The app connects via `firebaseConnect.js`. Ensure your Firestore security rules allow read/write for authenticated users.
    * **Razorpay:** To enable online payments, open `script.js` and replace `"YOUR_KEY_ID"` with your actual Razorpay Key ID.

---

## 🔮 Future Improvements

* [ ] **Role-Based Access Control:** Separate logins for Waiter, Kitchen, and Admin to restrict panel access.
* [ ] **Sales Analytics Dashboard:** A visual graph showing daily revenue and top-selling items.
* [ ] **Customer Loyalty:** Auto-fill details for returning customers based on phone number search.

---

## 👤 Author

**Prabal Talukdar**
* GitHub: [@probal08](https://github.com/probal08)

---
*Built with ❤️ for the University Restaurant Project.*
