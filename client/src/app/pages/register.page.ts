import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthShellComponent } from '../components/auth-shell.component';
import { IconComponent } from '../components/icon.component';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthShellComponent, IconComponent],
  template: `
    <app-auth-shell title="Create your account" subtitle="It takes less than a minute.">
      <div class="space-y-3">
        <div class="relative"><app-icon name="user" [size]="18" class="absolute left-4 top-3.5 text-neutral-500" />
          <input class="field !pl-11" placeholder="Full name" [(ngModel)]="name" /></div>
        <div class="relative"><app-icon name="mail" [size]="18" class="absolute left-4 top-3.5 text-neutral-500" />
          <input class="field !pl-11" type="email" placeholder="Email" [(ngModel)]="email" /></div>
        <div class="relative"><app-icon name="lock" [size]="18" class="absolute left-4 top-3.5 text-neutral-500" />
          <input class="field !pl-11" type="password" placeholder="Password" [(ngModel)]="password" (keyup.enter)="submit()" /></div>
      </div>
      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }
      <button class="btn w-full mt-5" [disabled]="loading() || !name || !email || !password" (click)="submit()">
        {{ loading() ? 'Creating…' : 'Create account' }}
      </button>
      <p class="mt-6 text-sm text-neutral-400">Already registered? <a routerLink="/login" class="text-saffron hover:underline">Sign in</a></p>
    </app-auth-shell>`,
})
export class RegisterPage {
  name = ''; email = ''; password = '';
  loading = select(authStore, s => s.loading);
  error = select(authStore, s => s.error);
  constructor(private router: Router) { authStore.getState().clearError(); }

  async submit() {
    if (await authStore.getState().register({ name: this.name, email: this.email, password: this.password }))
      this.router.navigate(['/login']);
  }
}
