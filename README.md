# 🍽️ Barakah Bites — Restaurant Reservation & Online Food Ordering System

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack web application designed for fine-dining restaurants. **Barakah Bites** provides an intuitive customer experience for table reservations, menu exploration, and online food ordering, paired with an administrative dashboard for real-time table management, kitchen orders, and menu catalog maintenance.

---

## 👨‍💻 Author

**Adil Mairaj**  
* GitHub: [@adilmairaj-dev](https://github.com/adilmairaj-dev)
* Repository: [BARAKAH-BITES](https://github.com/adilmairaj-dev/BARAKAH-BITES)

---

## ✨ Features

### 🛒 Customer Experience
* **Hero & Storytelling**: Full-viewport landing page highlighting the restaurant ambiance, timings (`10:00 AM – 10:00 PM (All day)`, `Friday closed`), and quick navigation.
* **Curated Menu & Search**: Categorized into **🥗 Appetizers & Starters**, **🍛 Main Course**, **🍰 Desserts**, and **🍹 Beverages** with search and filter tabs.
* **Online Food Ordering**: Add dishes directly with interactive quantity steppers, cart drawer/bottom dock, and a dedicated checkout page (`/app/order`) with delivery information and order summary.
* **Table Reservations**: View floor-by-floor table layouts, capacity, and real-time availability; book tables for specific dates and meal times.
* **Floating Dual Dock**: When items are in the order, both "View Order" and "Book a Table" remain accessible side-by-side.

### 🛡️ Restaurant Admin Dashboard (`/restaurant/dashboard`)
* **Real-time Metrics**: Track total tables, booked tables, available tables, and live occupancy percentages.
* **Customer Orders Section**:
  * Real-time active orders counter and filter tabs (**All**, **New**, **Preparing**, **Out for Delivery**, **Delivered**).
  * Direct status updater dropdown on each order card to advance kitchen workflow.
  * Full customer details (Name, clickable Phone, Delivery Address, Special Instructions notes).
  * Itemized dish breakdown with thumbnails and quantities.
  * One-click order deletion for cleanup.
* **Menu Catalog Management**:
  * Filter menu items by course category.
  * Distinct color-coded category badges: **Starters (Emerald Green)**, **Main Course (Saffron Gold)**, **Desserts (Pink)**, **Beverages (Cyan Blue)**.
  * **Edit Dish & Price Modal**: Click the pencil icon to update prices, dish names, categories, descriptions, or replace photos.
  * Add new dishes with photos and category assignment.
* **Table Management**: Add new tables with capacity and floor specifications; monitor live reservations.

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: Angular 21 (Standalone Components)
* **Styling**: Tailwind CSS v4 + custom dark luxury palette (`ink-950`, `ink-900`, `saffron`)
* **State Management**: Zustand vanilla store with Angular Signals bridge (`select`)
* **Icons**: Custom SVG Icon system with zero bloated third-party dependencies

### Backend
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database**: MongoDB Atlas with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and bcrypt password hashing
* **File & Media Handling**: Multer for multipart uploads with robust fallback to base64 Data URLs

---

## 📂 Project Structure

```text
barakah-bites/
├── client/                     # Angular 21 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Modals, cards, file picker, docks, icons
│   │   │   ├── core/           # API client, models, guards, signal helpers
│   │   │   ├── pages/          # Home, Menu, Order, Tables, Dashboard, Auth
│   │   │   └── store/          # Zustand stores (auth, admin, catalog, order, reservation)
│   │   └── styles.css          # Tailwind CSS v4 design tokens and theme
│   ├── public/                 # Optimized food photography & assets
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── src/
│   │   ├── configs/            # Environment & cloud configs
│   │   ├── controllers/        # Food, order, restaurant, table, user controllers
│   │   ├── db/                 # MongoDB connection handler
│   │   ├── middlewares/        # Auth, error handling, file upload
│   │   ├── models/             # Mongoose schemas (Food, Order, Table, User, etc.)
│   │   ├── routes/             # REST API routes
│   │   └── utils/              # Async handlers, API responses, ImageKit fallback
│   ├── .env.example            # Sample environment variables
│   ├── index.js                # Server entry point
│   └── package.json
│
├── .gitignore                  # Security-first ignore rules (protects .env and secrets)
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18 or higher
* **npm**: v9 or higher
* **MongoDB**: A local instance or free MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and enter your MONGODB_URI and secret keys

# Start backend server
npm run dev
```
The backend server runs on `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd client
npm install

# Start Angular development server
npm run dev
# or: npm start
```
Open your browser and navigate to `http://localhost:4200`.

---

## 🔐 Environment Variables (`server/.env`)

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:4200

# Authentication Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# ImageKit (Optional - automatically falls back to secure base64 data URLs)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — created by **Adil Mairaj**.
