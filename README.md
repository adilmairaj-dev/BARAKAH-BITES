# 🍽️ Barakah Bites

> **A Modern Restaurant Reservation & Online Food Ordering Platform**  
> *Full Stack Development — Project [Angular + Node.js + Express + MongoDB]*

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Overview

**Barakah Bites** is a full-featured, responsive restaurant management web application. It combines an intuitive digital dining experience for customers with an administrative dashboard for restaurant owners and staff.

Customers can reserve dining tables across multiple floors, browse categorized culinary offerings, and place delivery or takeaway orders with real-time status updates. Restaurant managers can oversee table occupancy, adjust dish prices on the fly, track live customer orders, and manage kitchen operations.

---

## ✨ Features

### 🌟 Customer Experience
* **Hero Landing Page**: Full viewport landing with restaurant timings (`10:00 AM – 10:00 PM (All day)`, *Friday closed*), featured signature courses, and quick actions.
* **Interactive Culinary Menu**:
  * Categorized courses: **Appetizers & Starters**, **Main Course**, **Desserts**, and **Beverages**.
  * Instant search bar by dish name or ingredients.
  * Course filter pills and category spotlight cards.
* **Online Food Ordering & Checkout**:
  * Add dishes to cart with an interactive quantity stepper (`-`, `qty`, `+`).
  * Live bill calculation with item breakdown, packaging charges, and total amount.
  * Delivery information form with address and special instructions notes.
  * Persistent cart with local storage synchronization.
* **Smart Table Reservation**:
  * Real-time floor plan view (Seats: 2, 4, 6; Floor 1 & Floor 2).
  * Date and time slot booking.
  * Floating action dock to seamlessly switch between ordering dishes and reserving a table.
* **Customer Authentication & Drawer**:
  * Secure sign-up and login with encrypted credentials.
  * Slide-over reservations history drawer with cancellation options.

---

### ⚡ Restaurant Administration Dashboard
* **Live Occupancy Analytics**:
  * Summary metrics for **Total Tables**, **Booked Tables**, **Available Tables**, and **Active Orders**.
  * Visual occupancy progress bar tracking dining capacity in real time.
* **Customer Orders Hub**:
  * Real-time feed of online food orders placed by customers.
  * Status filter tabs: **All Orders**, **New**, **Preparing**, **Out for Delivery**, **Delivered**.
  * Live status changer: Transition order states (`Placed` → `Preparing in Kitchen` → `Out for Delivery` → `Delivered` → `Cancelled`).
  * Customer details with direct phone link, delivery address, special preparation notes, and itemized dish lists with quantity multipliers.
  * One-click order deletion for completed or dismissed entries.
* **Menu Catalog & Pricing Management**:
  * Color-coded category tags for quick visual organization:
    * 🥗 **Starters**: Emerald Green
    * 🍛 **Main Course**: Saffron Gold
    * 🍰 **Desserts**: Sweet Pink / Rose
    * 🍹 **Beverages**: Cyan Blue
  * **Price & Details Editing**: Pencil icon modal on every dish to adjust prices (₹), update descriptions, switch categories, or replace food photos.
  * New dish creator modal with automatic ImageKit upload or base64 fallback.
* **Table Management**:
  * Add tables with custom table numbers, seating capacities, floor levels, and photo previews.
  * Delete or manage existing tables.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Angular 21, TypeScript, Tailwind CSS v4, Zustand (Vanilla Store), SVG Icons |
| **Backend** | Node.js, Express.js (ES Modules), Multer, ImageKit SDK, Bcrypt, JWT |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Styling & Theme** | Modern Dark Ink (`#0d0e12`, `#14151b`) with Saffron Gold (`#e8a33d`) highlights |

---

## 📁 Repository Structure

```text
BARAKAH-BITES/
├── client/                      # Angular 21 Single Page Application
│   ├── public/                  # Static assets & dish photography
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # UI components (Dock, Modal Shell, Cards, Steppers, Pickers)
│   │   │   ├── core/            # API client, Models, Signals, Route Guards
│   │   │   ├── pages/           # Home, Menu, Order, Tables, Dashboard, Auth
│   │   │   └── store/           # Zustand stores (Admin, Auth, Catalog, Order, Reservation)
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css           # Tailwind CSS v4 design tokens
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── server/                      # Node.js Express REST API
│   ├── src/
│   │   ├── configs/             # Environment & ImageKit setup
│   │   ├── controllers/         # Food, Order, Reservation, Restaurant, Table, User
│   │   ├── db/                  # MongoDB Mongoose connection
│   │   ├── middlewares/         # JWT Auth, Multer upload, Error handling
│   │   ├── models/              # Mongoose schemas (Food, Order, Reservation, Restaurant, Table, User)
│   │   ├── routes/              # Express API endpoints
│   │   └── utils/               # ApiError, ApiResponse, asyncHandler, ImageKit helper
│   ├── .env.example             # Template for environment configuration
│   ├── index.js                 # Server entry point
│   └── package.json
│
├── .gitignore                   # Security rules for env files & dependencies
├── LICENSE                      # MIT License
└── README.md                    # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or v20.x+ recommended)
* [npm](https://www.npmjs.com/) (v9.x or v10.x+)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to create your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Configure the following variables in `server/.env`:
   ```ini
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:4200

   ACCESS_TOKEN_SECRET=your_jwt_access_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
   REFRESH_TOKEN_EXPIRY=10d

   ADMIN_EMAIL=admin@restaurant.com
   ADMIN_PASSWORD=your_secure_password

   # ImageKit (Optional: includes built-in fallback)
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:8000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   npm run dev
   # or
   npm start
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:4200
   ```

---

## 🔌 API Reference

### Authentication & Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/user/register` | Register a new customer account |
| `POST` | `/api/user/login` | Log in as a customer |
| `POST` | `/api/user/logout` | Log out user session |
| `POST` | `/api/restaurant/login` | Authenticate restaurant admin |

### Menu & Foods
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/food/all` | Fetch all categorized menu dishes |
| `POST` | `/api/food/create` | Create a new dish with category & photo (Admin) |
| `PATCH` | `/api/food/update/:id` | Update price (₹), name, category, or photo (Admin) |
| `DELETE` | `/api/food/delete/:id` | Delete a food item from the menu (Admin) |

### Customer Food Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/order/create` | Place a food order with customer delivery details |
| `GET` | `/api/order/restaurant` | Retrieve all restaurant orders (Admin) |
| `PATCH` | `/api/order/:id/status` | Update order state (`placed`, `preparing`, etc.) |
| `DELETE` | `/api/order/:id` | Delete / dismiss an order (Admin) |

### Tables & Reservations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/table/all` | Retrieve dining tables & availability |
| `POST` | `/api/table/create` | Add a new dining table (Admin) |
| `DELETE` | `/api/table/delete/:id` | Remove a dining table (Admin) |
| `POST` | `/api/reservation/book` | Reserve a dining table for a customer |
| `GET` | `/api/reservation/user` | Fetch current user's reservations |
| `GET` | `/api/reservation/restaurant` | Fetch restaurant reservation list (Admin) |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
