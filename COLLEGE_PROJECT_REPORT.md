# BARAKAH BITES — RESTAURANT RESERVATION & ONLINE ORDERING SYSTEM
### College Project Documentation & Source Code Report
**Submitted by:** Adil Mairaj  
**Technology Stack:** Angular 21, Tailwind CSS v4, Node.js, Express.js, MongoDB Atlas (Mongoose ODM)  
**Academic Subject:** Full Stack Web Development  

---

## 1. Project Directory Structure

```text
barakah-bites
├── client
│   ├── .angular
│   ├── dist
│   ├── node_modules
│   ├── public
│   │   ├── auth-food.jpg
│   │   ├── favicon.ico
│   │   ├── food-black-forest-cake.jpg
│   │   ├── food-chicken-corn-momos.jpg
│   │   ├── food-chicken-roast.jpg
│   │   ├── food-lime-lemon-mojito.jpg
│   │   ├── food-mix-fruit-kiwi.jpg
│   │   ├── food-red-velvet-cake.jpg
│   │   ├── food-white-sauce-pasta.jpg
│   │   ├── menu-beverages.jpg
│   │   ├── menu-dessert.jpg
│   │   ├── menu-main.jpg
│   │   └── menu-starters.jpg
│   ├── src
│   │   ├── app
│   │   │   ├── components
│   │   │   │   ├── admin-dock.component.ts
│   │   │   │   ├── auth-shell.component.ts
│   │   │   │   ├── booking-modal.component.ts
│   │   │   │   ├── file-picker.component.ts
│   │   │   │   ├── food-card.component.ts
│   │   │   │   ├── food-edit-modal.component.ts
│   │   │   │   ├── food-modal.component.ts
│   │   │   │   ├── icon.component.ts
│   │   │   │   ├── modal-shell.component.ts
│   │   │   │   ├── profile-modal.component.ts
│   │   │   │   ├── reservations-drawer.component.ts
│   │   │   │   ├── table-card.component.ts
│   │   │   │   └── table-modal.component.ts
│   │   │   ├── core
│   │   │   │   ├── api.ts
│   │   │   │   ├── config.ts
│   │   │   │   ├── guards.ts
│   │   │   │   ├── models.ts
│   │   │   │   └── store-signal.ts
│   │   │   ├── pages
│   │   │   │   ├── dashboard.page.ts
│   │   │   │   ├── home.page.ts
│   │   │   │   ├── login.page.ts
│   │   │   │   ├── menu.page.ts
│   │   │   │   ├── order.page.ts
│   │   │   │   ├── register.page.ts
│   │   │   │   ├── restaurant-login.page.ts
│   │   │   │   ├── tables.page.ts
│   │   │   │   └── user-layout.page.ts
│   │   │   ├── store
│   │   │   │   ├── admin.store.ts
│   │   │   │   ├── auth.store.ts
│   │   │   │   ├── catalog.store.ts
│   │   │   │   ├── order.store.ts
│   │   │   │   └── reservation.store.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.app.json
│   └── tsconfig.json
│
└── server
    ├── node_modules
    ├── src
    │   ├── configs
    │   │   ├── env.js
    │   │   └── imageKit/config.js
    │   ├── controllers
    │   │   ├── food.controller.js
    │   │   ├── order.controller.js
    │   │   ├── reservations.controller.js
    │   │   ├── restaurant.controller.js
    │   │   ├── tables.controller.js
    │   │   └── user.controller.js
    │   ├── db
    │   │   └── db.js
    │   ├── middlewares
    │   │   ├── error.middleware.js
    │   │   ├── multer.middleware.js
    │   │   ├── oauth.middleware.js
    │   │   └── restaurants.middleware.js
    │   ├── models
    │   │   ├── food.models.js
    │   │   ├── order.models.js
    │   │   ├── reservations.models.js
    │   │   ├── restaurants.models.js
    │   │   ├── tables.models.js
    │   │   └── user.models.js
    │   ├── routes
    │   │   ├── food.route.js
    │   │   ├── order.route.js
    │   │   ├── reservations.route.js
    │   │   ├── restaurants.route.js
    │   │   ├── table.route.js
    │   │   └── user.route.js
    │   ├── utils
    │   │   ├── apiError.js
    │   │   ├── apiResponse.js
    │   │   ├── asyncHandler.js
    │   │   └── imageKit.js
    │   ├── app.js
    │   └── constants.js
    ├── index.js
    ├── package.json
    └── seed_curated_foods.js
```

---

## 2. Frontend Source Code

### `client/package.json`
```json
{
  "name": "barakah-bites-client",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "dev": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "author": "Adil Mairaj",
  "license": "MIT",
  "packageManager": "npm@11.21.1",
  "dependencies": {
    "@angular/common": "^21.2.0",
    "@angular/compiler": "^21.2.0",
    "@angular/core": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "@angular/platform-browser": "^21.2.0",
    "@angular/router": "^21.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zustand": "^5.0.16"
  },
  "devDependencies": {
    "@angular/build": "^21.2.29",
    "@angular/cli": "^21.2.29",
    "@angular/compiler-cli": "^21.2.0",
    "@tailwindcss/postcss": "^4.1.12",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.1.12",
    "typescript": "~5.9.2"
  }
}
```

---

### `client/src/index.html`
```html
<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <title>Barakah Bite's</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

### `client/src/main.ts`
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch(console.error);
```

---

### `client/src/app/app.config.ts`
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

---

### `client/src/app/app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { guestGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'restaurant/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/restaurant-login.page').then(m => m.RestaurantLoginPage),
  },
  {
    path: 'app',
    canActivate: [roleGuard('user')],
    loadComponent: () => import('./pages/user-layout.page').then(m => m.UserLayoutPage),
    children: [
      { path: '', loadComponent: () => import('./pages/home.page').then(m => m.HomePage) },
      { path: 'tables', loadComponent: () => import('./pages/tables.page').then(m => m.TablesPage) },
      { path: 'menu', loadComponent: () => import('./pages/menu.page').then(m => m.MenuPage) },
      { path: 'order', loadComponent: () => import('./pages/order.page').then(m => m.OrderPage) },
    ],
  },
  {
    path: 'restaurant/dashboard',
    canActivate: [roleGuard('restaurant')],
    loadComponent: () => import('./pages/dashboard.page').then(m => m.DashboardPage),
  },
  { path: '**', redirectTo: 'login' },
];
```

---

### `client/src/app/app.component.ts`
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
```

---

### `client/src/app/core/api.ts`
```typescript
import { API_URL } from './config';

type Options = { method?: string; body?: unknown };

export async function api<T>(path: string, { method = 'GET', body }: Options = {}): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(API_URL + path, {
    method,
    credentials: 'include',
    headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || 'Something went wrong. Please try again.');
  return json?.data as T;
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong.');
```

---

### `client/src/app/core/models.ts`
```typescript
export interface User { _id: string; name: string; email: string; isOnline?: boolean }

export interface Restaurant {
  _id: string; name: string; address: string; phone: string; email: string;
  opening_Time: string; closing_Time: string; description: string; image: string;
}

export interface Table {
  _id: string; tableNumber: number; capacity: number; floor: number;
  status: 'available' | 'reserved'; image: string; restaurant: string;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: 'starters' | 'main' | 'desserts' | 'beverages' | string;
}

export interface UserReservation {
  _id: string; date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled';
  restaurant: { _id: string; name: string; address: string };
  table: { _id: string; tableNumber: number; capacity: number; floor: number };
}

export interface RestaurantReservation {
  _id: string; date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled';
  user: { _id: string; name: string; email: string };
  table: { _id: string; tableNumber: number; capacity: number; floor: number };
}

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItemRecord {
  food?: string | Food;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerOrder {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  specialInstructions?: string;
  items: OrderItemRecord[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### `client/src/app/store/order.store.ts`
```typescript
import { createStore } from 'zustand/vanilla';
import { Food } from '../core/models';
import { api } from '../core/api';

export interface OrderItem {
  food: Food;
  quantity: number;
}

export interface PlacedOrder {
  _id?: string;
  orderId: string;
  items: OrderItem[];
  customerName: string;
  phone: string;
  address: string;
  specialInstructions?: string;
  totalAmount: number;
  createdAt: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
}

interface OrderState {
  items: OrderItem[];
  lastOrder: PlacedOrder | null;
  addItem: (food: Food) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (details: {
    customerName: string;
    phone: string;
    address: string;
    specialInstructions?: string;
  }) => Promise<PlacedOrder>;
}

const STORAGE_KEY = 'barakah_bites_cart';

const loadSavedItems = (): OrderItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveItems = (items: OrderItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

export const orderStore = createStore<OrderState>()((set, get) => ({
  items: loadSavedItems(),
  lastOrder: null,

  addItem: (food: Food) => {
    const items = [...get().items];
    const idx = items.findIndex(i => i.food._id === food._id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
    } else {
      items.push({ food, quantity: 1 });
    }
    saveItems(items);
    set({ items });
  },

  removeItem: (foodId: string) => {
    const items = get().items.filter(i => i.food._id !== foodId);
    saveItems(items);
    set({ items });
  },

  updateQuantity: (foodId: string, quantity: number) => {
    let items = [...get().items];
    if (quantity <= 0) {
      items = items.filter(i => i.food._id !== foodId);
    } else {
      items = items.map(i => (i.food._id === foodId ? { ...i, quantity } : i));
    }
    saveItems(items);
    set({ items });
  },

  clearCart: () => {
    saveItems([]);
    set({ items: [] });
  },

  placeOrder: async details => {
    const items = [...get().items];
    const totalAmount = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    const fallbackOrderId = 'BB-' + Math.floor(100000 + Math.random() * 900000);

    let order: PlacedOrder = {
      orderId: fallbackOrderId,
      items,
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      specialInstructions: details.specialInstructions,
      totalAmount,
      createdAt: new Date().toISOString(),
      status: 'placed',
    };

    try {
      const payload = {
        customerName: details.customerName,
        phone: details.phone,
        address: details.address,
        specialInstructions: details.specialInstructions,
        items: items.map(i => ({
          food: i.food._id,
          name: i.food.name,
          price: i.food.price,
          quantity: i.quantity,
          image: i.food.image,
        })),
        totalAmount,
      };
      const saved = await api<any>('/order/create', { method: 'POST', body: payload });
      if (saved && saved.orderId) {
        order = {
          _id: saved._id,
          orderId: saved.orderId,
          items,
          customerName: saved.customerName,
          phone: saved.phone,
          address: saved.address,
          specialInstructions: saved.specialInstructions,
          totalAmount: saved.totalAmount,
          createdAt: saved.createdAt,
          status: saved.status,
        };
      }
    } catch (e) {
      console.warn('Backend order sync fallback:', e);
    }

    saveItems([]);
    set({ items: [], lastOrder: order });
    return order;
  },
}));
```

---

### `client/src/app/store/admin.store.ts`
```typescript
import { createStore } from 'zustand/vanilla';
import { api, errMsg } from '../core/api';
import { Restaurant, CustomerOrder, OrderStatus } from '../core/models';
import { authStore } from './auth.store';
import { catalogStore } from './catalog.store';

interface AdminState {
  busy: boolean;
  error: string | null;
  orders: CustomerOrder[];
  clearError: () => void;
  updateProfile: (fd: FormData) => Promise<boolean>;
  addFood: (fd: FormData) => Promise<boolean>;
  updateFood: (id: string, fd: FormData) => Promise<boolean>;
  addTable: (fd: FormData) => Promise<boolean>;
  deleteFood: (id: string) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
}

export const adminStore = createStore<AdminState>()((set, get) => {
  const run = async (fn: () => Promise<unknown>) => {
    set({ busy: true, error: null });
    try { await fn(); set({ busy: false }); return true; }
    catch (e) { set({ busy: false, error: errMsg(e) }); return false; }
  };

  return {
    busy: false,
    error: null,
    orders: [],
    clearError: () => set({ error: null }),

    updateProfile: fd => run(async () => {
      const r = await api<Restaurant>('/restaurant/addDetails', { method: 'POST', body: fd });
      authStore.getState().setAccount(r);
    }),

    addFood: fd => run(async () => {
      await api('/food/create', { method: 'POST', body: fd });
      await catalogStore.getState().fetchFoods();
    }),

    updateFood: (id, fd) => run(async () => {
      await api(`/food/update/${id}`, { method: 'PATCH', body: fd });
      await catalogStore.getState().fetchFoods();
    }),

    addTable: fd => run(async () => {
      await api('/table/create', { method: 'POST', body: fd });
      await catalogStore.getState().fetchTables();
    }),

    deleteFood: async id => {
      await run(async () => {
        await api(`/food/delete/${id}`, { method: 'DELETE' });
        await catalogStore.getState().fetchFoods();
      });
    },

    deleteTable: async id => {
      await run(async () => {
        await api(`/table/delete/${id}`, { method: 'DELETE' });
        await catalogStore.getState().fetchTables();
      });
    },

    fetchOrders: async () => {
      try {
        const orders = await api<CustomerOrder[]>('/order/restaurant');
        set({ orders: orders || [] });
      } catch (e) {
        console.warn('Failed to fetch orders:', e);
      }
    },

    updateOrderStatus: (id, status) => run(async () => {
      await api(`/order/${id}/status`, { method: 'PATCH', body: { status } });
      const orders = get().orders.map(o => (o._id === id ? { ...o, status } : o));
      set({ orders });
    }),

    deleteOrder: id => run(async () => {
      await api(`/order/${id}`, { method: 'DELETE' });
      const orders = get().orders.filter(o => o._id !== id);
      set({ orders });
    }),
  };
});
```

---

## 3. Backend Source Code

### `server/package.json`
```json
{
  "name": "barakah-bites-server",
  "version": "1.0.0",
  "description": "Barakah Bites Restaurant Backend API - Node.js + Express + MongoDB",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "keywords": [
    "restaurant",
    "reservation",
    "food-ordering",
    "angular",
    "nodejs",
    "express",
    "mongodb"
  ],
  "author": "Adil Mairaj",
  "license": "MIT",
  "type": "module",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "imagekit": "^6.0.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.9.5",
    "multer": "^2.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

### `server/index.js`
```javascript
import "./src/configs/env.js";

import connectDB from "./src/db/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.on("error", (err) => {
        console.log("Server error:", err);
    });
    app.listen(PORT, () => {
        console.log("Barakah Bites Server running on PORT:", PORT);
    });
}).catch((err) => {
    console.log("Database connection failed:", err?.message);
});
```

---

### `server/src/app.js`
```javascript
import "./configs/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4200",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import userRoutes from "./routes/user.route.js";
import restaurantRoutes from "./routes/restaurants.route.js";
import foodRoutes from "./routes/food.route.js";
import tableRoutes from "./routes/table.route.js";
import reservationRoutes from "./routes/reservations.route.js";
import orderRoutes from "./routes/order.route.js";
import errorHandler from "./middlewares/error.middleware.js";

app.use("/api/user", userRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/order", orderRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Barakah Bites API" });
});

export default app;
```

---

### `server/src/db/db.js`
```javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
        const connectionIn = await mongoose.connect(uri, { dbName: DB_NAME });
        console.log("MongoDB connected successfully:", connectionIn.connection.host);
    } catch (error) {
        console.log("MongoDB Connection Failed:", error?.message);
        process.exit(1);
    }
};

export default connectDB;
```

---

### Database Schemas / Models

#### `server/src/models/tables.models.js`
```javascript
import { Schema, model } from 'mongoose';

const tableSchema = new Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'reserved'],
        default: 'available'
    },
    image: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, { timestamps: true });

const Table = model('Table', tableSchema);
export default Table;
```

#### `server/src/models/reservations.models.js`
```javascript
import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    table: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, { timestamps: true });

const Reservation = model('Reservation', reservationSchema);
export default Reservation;
```

#### `server/src/models/food.models.js`
```javascript
import { Schema, model } from 'mongoose';

const foodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['starters', 'main', 'desserts', 'beverages'],
        default: 'main'
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, { timestamps: true });

const Food = model('Food', foodSchema);
export default Food;
```

#### `server/src/models/order.models.js`
```javascript
import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: false
  }
}, { _id: false });

const orderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String,
    required: false
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  }
}, { timestamps: true });

const Order = model('Order', orderSchema);
export default Order;
```

---

### Key Backend Controllers & Endpoints

#### `server/src/controllers/order.controller.js`
```javascript
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Order from "../models/order.models.js";
import Restaurant from "../models/restaurants.models.js";

// POST /api/order/create
const createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, address, specialInstructions, items, totalAmount, restaurantId } = req.body;

  if (!customerName || !phone || !address) {
    throw new ApiError(400, "Customer name, phone, and address are required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "At least one item is required in the order");
  }

  let restaurant = null;
  if (restaurantId) {
    restaurant = await Restaurant.findById(restaurantId);
  }
  if (!restaurant) {
    restaurant = await Restaurant.findOne();
  }
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const orderId = 'BB-' + Math.floor(100000 + Math.random() * 900000);

  const formattedItems = items.map(item => ({
    food: item.food?._id || item.food || null,
    name: item.food?.name || item.name || 'Dish',
    price: Number(item.food?.price || item.price || 0),
    quantity: Number(item.quantity || 1),
    image: item.food?.image || item.image || ''
  }));

  const calculatedTotal = totalAmount || formattedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const order = await Order.create({
    orderId,
    restaurant: restaurant._id,
    customerName,
    phone,
    address,
    specialInstructions: specialInstructions || '',
    items: formattedItems,
    totalAmount: calculatedTotal,
    status: 'placed'
  });

  if (!order) {
    throw new ApiError(500, "Failed to create order");
  }

  res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});

// GET /api/order/restaurant
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant?._id;
  if (!restaurantId) {
    throw new ApiError(401, "Unauthorized: Restaurant ID required");
  }

  const orders = await Order.find({ restaurant: restaurantId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

// PATCH /api/order/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const restaurantId = req.restaurant?._id;
  const order = await Order.findOne({ _id: id, restaurant: restaurantId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

// DELETE /api/order/:id
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurantId = req.restaurant?._id;
  const order = await Order.findOneAndDelete({ _id: id, restaurant: restaurantId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Order deleted successfully"));
});

export { createOrder, getRestaurantOrders, updateOrderStatus, deleteOrder };
```

#### `server/src/routes/order.route.js`
```javascript
import { Router } from "express";
import { createOrder, getRestaurantOrders, updateOrderStatus, deleteOrder } from "../controllers/order.controller.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";

const router = Router();

router.route("/create").post(createOrder);
router.route("/restaurant").get(verifyRestaurants, getRestaurantOrders);
router.route("/:id/status").patch(verifyRestaurants, updateOrderStatus);
router.route("/:id").delete(verifyRestaurants, deleteOrder);

export default router;
```

#### `server/src/routes/food.route.js`
```javascript
import { Router } from "express";
import { createFood, updateFood, deleteFood, getAllFoods } from "../controllers/food.controller.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyRestaurants, upload.single("image"), createFood);
router.route("/update/:id").patch(verifyRestaurants, upload.single("image"), updateFood);
router.route("/delete/:id").delete(verifyRestaurants, deleteFood);
router.route("/all").get(getAllFoods);

export default router;
```

---

## 4. Academic Project Summary

| Parameter | Details |
| :--- | :--- |
| **Project Title** | Barakah Bites — Restaurant Reservation & Table Management System |
| **Developer / Author** | **Adil Mairaj** |
| **Front-End Architecture** | Angular 21, Standalone Components, Signals, Tailwind CSS v4, Zustand Store |
| **Back-End Architecture** | Node.js, Express.js (REST API, ES Modules), JWT Authentication, Multer |
| **Database** | MongoDB Atlas (`restaurantDB` cluster) with Mongoose ORM |
| **Key Functionalities** | Floor Plan Live Table Reservation, Food Ordering with Quantity Stepper, Dynamic Cart, Real-Time Admin Kitchen Orders Dispatch, Course Categorization, Price Editing Modal |
| **GitHub Repository** | [https://github.com/adilmairaj-dev/BARAKAH-BITES](https://github.com/adilmairaj-dev/BARAKAH-BITES) |

---
*Documentation compiled for academic examination and submission.*
