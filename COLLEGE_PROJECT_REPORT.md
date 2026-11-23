# BARAKAH BITES — RESTAURANT RESERVATION & ONLINE ORDERING SYSTEM
### College Project Documentation & Source Code Report
**Submitted by:** Adil Mairaj  
**Technology Stack:** Angular 21, Tailwind CSS v4, Node.js, Express.js, MongoDB Atlas (Mongoose ODM)  
**Academic Subject:** Full Stack Web Development  

---

## 1. Project Overview & Architecture

**Barakah Bites** is a modern, responsive full-stack restaurant application designed for fine-dining management. It bridges customer interactions (browsing categorized menus, reserving dining tables, and placing food delivery orders) with a centralized restaurant administration dashboard.

* **Frontend Architecture:** Angular 21 with Standalone Components, Signals-based reactive state management via Zustand, and Tailwind CSS v4 styling.
* **Backend Architecture:** RESTful API built on Node.js and Express.js (ES Modules) connected to a cloud-hosted MongoDB Atlas cluster.
* **Security & Auth:** JWT tokens with HTTP-only cookies, password hashing with bcrypt, and Angular route guards for guest and role-based access control.

---

## 2. Frontend Source Code (Client Side)

### 2.1 `client/package.json`
```json
{
  "name": "client",
  "version": "0.0.0",
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
    "jsdom": "^28.0.0",
    "postcss": "^8.5.3",
    "prettier": "^3.8.1",
    "tailwindcss": "^4.1.12",
    "typescript": "~5.9.2",
    "vitest": "^4.0.8"
  }
}
```

---

### 2.2 `client/src/index.html`
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
<body><app-root></app-root></body>
</html>
```

---

### 2.3 `client/src/main.ts`
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch(console.error);
```

---

### 2.4 `client/src/styles.css`
```css
@import "tailwindcss";

@theme {
  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "DM Sans", system-ui, sans-serif;
  --color-ink-950: #0d0e12;
  --color-ink-900: #14151b;
  --color-ink-800: #1c1e26;
  --color-ink-700: #2a2d38;
  --color-saffron: #e8a33d;
  --color-saffron-soft: #f3c677;
}

@layer base {
  html { @apply bg-ink-950 text-neutral-200 font-sans antialiased; }
  *:focus-visible { @apply outline-2 outline-offset-2 outline-saffron; }
}
@layer components {
  .field { @apply w-full rounded-xl bg-ink-800 border border-ink-700 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-saffron focus:outline-none; }
  .btn { @apply inline-flex items-center justify-center gap-2 rounded-xl bg-saffron px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-saffron-soft disabled:opacity-50 disabled:cursor-not-allowed; }
  .btn-ghost { @apply inline-flex items-center justify-center gap-2 rounded-xl border border-ink-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-ink-800; }
  .card { @apply rounded-2xl border border-ink-700 bg-ink-900; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
```

---

### 2.5 `client/src/app/app.routes.ts`
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

### 2.6 `client/src/app/app.config.ts`
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};
```

---

### 2.7 `client/src/app/app.component.ts`
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

### 2.8 `client/src/app/core/store-signal.ts`
```typescript
import { DestroyRef, Signal, inject, signal } from '@angular/core';
import type { StoreApi } from 'zustand/vanilla';

export function select<T, U>(store: StoreApi<T>, selector: (s: T) => U): Signal<U> {
  const sig = signal(selector(store.getState()));
  const unsub = store.subscribe(s => sig.set(selector(s)));
  inject(DestroyRef).onDestroy(unsub);
  return sig.asReadonly();
}
```

---

### 2.9 `client/src/app/core/guards.ts`
```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, authStore } from '../store/auth.store';

export const roleGuard = (role: Exclude<Role, null>): CanActivateFn => () => {
  const router = inject(Router);
  return (async () => {
    await authStore.getState().init();
    const s = authStore.getState();
    if (s.role === role && s.account) return true;
    return router.createUrlTree([role === 'user' ? '/login' : '/restaurant/login']);
  })();
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  return (async () => {
    await authStore.getState().init();
    const { role, account } = authStore.getState();
    if (!account) return true;
    return router.createUrlTree([role === 'restaurant' ? '/restaurant/dashboard' : '/app']);
  })();
};
```

---

### 2.10 `client/src/app/core/models.ts`
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

## 3. Backend Source Code (Server Side)

### 3.1 `server/package.json`
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
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

### 3.2 `server/index.js`
```javascript
import "./src/configs/env.js";

import connectDB from "./src/db/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.on("error", (err)=>{
        console.log(err)
    })
    app.listen(PORT,()=>{
        console.log("server running",PORT)
    })
}).catch((err) => {
    console.log("connection failed", err?.message)
})
```

---

### 3.3 `server/src/app.js`
```javascript
import "./configs/env.js";

import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

import userRoutes from "./routes/user.route.js"
import restaurantRoutes from "./routes/restaurants.route.js"
import foodRoutes from "./routes/food.route.js"
import tableRoutes from "./routes/table.route.js"
import reservationRoutes from "./routes/reservations.route.js"
import orderRoutes from "./routes/order.route.js"
import errorHandler from "./middlewares/error.middleware.js";

app.use("/api/user", userRoutes)
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/food", foodRoutes)
app.use("/api/table", tableRoutes)
app.use("/api/reservation", reservationRoutes)
app.use("/api/order", orderRoutes)
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Barakah Bites API" });
})

export default app
```

---

## 4. Academic Project Summary

* **Project Title:** Barakah Bites — Restaurant Reservation & Table Management System
* **Author / Developer:** Adil Mairaj
* **Architecture:** Decoupled Full-Stack Architecture (Client-Server Model)
* **Client Implementation:** Angular 21, TypeScript, Tailwind CSS v4, Signals, Zustand
* **Server Implementation:** Node.js, Express.js (ES Modules), Mongoose, JWT Authentication
* **Status:** Verified, Tested, and Fully Functional
