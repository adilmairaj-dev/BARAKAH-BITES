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
