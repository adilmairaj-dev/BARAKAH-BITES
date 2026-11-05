import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthShellComponent } from '../components/auth-shell.component';
import { IconComponent } from '../components/icon.component';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';

@Component({
  selector: 'app-restaurant-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthShellComponent, IconComponent],
  template: `
    <app-auth-shell title="Owner sign in" subtitle="Manage your tables and see who's booked.">
      <div class="space-y-3">
        <div class="relative"><app-icon name="mail" [size]="18" class="absolute left-4 top-3.5 text-neutral-500" />
          <input class="field !pl-11" type="email" placeholder="Restaurant email" [(ngModel)]="email" /></div>
        <div class="relative"><app-icon name="lock" [size]="18" class="absolute left-4 top-3.5 text-neutral-500" />
          <input class="field !pl-11" type="password" placeholder="Password" [(ngModel)]="password" (keyup.enter)="submit()" /></div>
      </div>
      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }
      <button class="btn w-full mt-5" [disabled]="loading() || !email || !password" (click)="submit()">
        {{ loading() ? 'Signing in…' : 'Open dashboard' }}
      </button>
      <a routerLink="/login" class="mt-8 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300">
        <app-icon name="back" [size]="16" />Back to guest sign in
      </a>
    </app-auth-shell>`,
})
export class RestaurantLoginPage {
  email = ''; password = '';
  loading = select(authStore, s => s.loading);
  error = select(authStore, s => s.error);
  constructor(private router: Router) { authStore.getState().clearError(); }

  async submit() {
    if (await authStore.getState().loginRestaurant(this.email, this.password)) this.router.navigate(['/restaurant/dashboard']);
  }
}
