import { Component, OnInit, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { filter } from 'rxjs';
import { IconComponent } from '../components/icon.component';
import { ReservationsDrawerComponent } from '../components/reservations-drawer.component';
import { select } from '../core/store-signal';
import { reservationStore } from '../store/reservation.store';
import { orderStore } from '../store/order.store';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, CurrencyPipe, IconComponent, ReservationsDrawerComponent],
  template: `
    <router-outlet />

    <!-- top-right actions -->
    <div class="fixed right-4 top-4 z-20 flex items-center gap-3">
      <!-- order button (to the left of menu) -->
      <button type="button"
              (click)="goToOrder()"
              class="group relative flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full border border-ink-700 bg-ink-900/90 text-white shadow-lg backdrop-blur transition hover:border-saffron active:scale-95"
              aria-label="Your Order" title="Your Order">
        <app-icon name="cart" [size]="17" class="text-saffron transition group-hover:scale-110" />
        <span class="text-[9px] font-semibold uppercase tracking-wider text-neutral-300 transition group-hover:text-saffron leading-none mt-0.5">Order</span>
        @if (orderCount() > 0) {
          <span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-md animate-pulse">
            {{ orderCount() }}
          </span>
        }
      </button>

      <!-- menu button -->
      <button type="button"
              (click)="goToMenu()"
              class="group flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full border border-ink-700 bg-ink-900/90 text-white shadow-lg backdrop-blur transition hover:border-saffron active:scale-95"
              aria-label="Restaurant Menu" title="Menu">
        <app-icon name="utensils" [size]="17" class="text-saffron transition group-hover:scale-110" />
        <span class="text-[9px] font-semibold uppercase tracking-wider text-neutral-300 transition group-hover:text-saffron leading-none mt-0.5">Menu</span>
      </button>

      <!-- my bookings -->
      <button type="button"
              class="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink-700 bg-ink-900/90 text-white shadow-lg backdrop-blur transition hover:border-saffron active:scale-95"
              (click)="openDrawer()" aria-label="My bookings" title="My account & bookings">
        <app-icon name="user" />
        @if (count() > 0) {
          <span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-xs font-bold text-ink-950">{{ count() }}</span>
        }
      </button>
    </div>

    <!-- Unified Floating Bottom Dock (Always keeps Book a Table accessible) -->
    @if (!isExcludedPage()) {
      <div class="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none">
        @if (orderCount() > 0) {
          <!-- Dual Action Bar: Both "Book a table" AND "View Order" accessible side-by-side -->
          <div class="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-ink-900/95 border border-saffron/40 p-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-md">
            <!-- Book a table button -->
            <button
              type="button"
              (click)="goBook()"
              class="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-200 transition hover:border-saffron hover:bg-ink-700 hover:text-white cursor-pointer shrink-0">
              <app-icon name="table" [size]="16" class="text-saffron" />
              <span>Book a table</span>
            </button>

            <!-- Order info and View Order button -->
            <div class="flex items-center gap-3">
              <div class="hidden sm:block text-right">
                <p class="text-xs font-semibold text-white leading-tight">
                  {{ orderCount() }} item(s) added
                </p>
                <p class="text-xs text-saffron font-bold leading-tight">
                  {{ orderTotal() | currency:'INR':'symbol':'1.0-0' }}
                </p>
              </div>
              <button
                type="button"
                (click)="goToOrder()"
                class="btn !py-2.5 !px-4 sm:!px-5 text-xs sm:text-sm font-semibold shadow-lg shadow-saffron/20 cursor-pointer shrink-0">
                View Order ({{ orderTotal() | currency:'INR':'symbol':'1.0-0' }}) &rarr;
              </button>
            </div>
          </div>
        } @else {
          <!-- Standard Book a table button when no dishes in order -->
          <div class="flex justify-center pointer-events-auto">
            <button
              type="button"
              (click)="goBook()"
              class="btn !rounded-full !px-7 !py-4 shadow-2xl shadow-black/60 cursor-pointer flex items-center gap-2">
              <app-icon name="table" />
              <span>Book a table</span>
            </button>
          </div>
        }
      </div>
    }

    <app-reservations-drawer />
  `,
})
export class UserLayoutPage implements OnInit {
  private mine = select(reservationStore, s => s.mine);
  private cartItems = select(orderStore, s => s.items);

  count = computed(() => this.mine().length);
  orderCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  orderTotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.food.price * item.quantity, 0));

  currentUrl = signal<string>('');

  isExcludedPage = computed(() => {
    const url = this.currentUrl();
    return url.includes('/app/tables') || url.includes('/app/order');
  });

  constructor(private router: Router) {
    this.currentUrl.set(this.router.url);
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.currentUrl.set(e.urlAfterRedirects || e.url);
    });
  }

  ngOnInit() { reservationStore.getState().fetchMine(); }
  openDrawer() { reservationStore.getState().setDrawer(true); }
  goToMenu() { this.router.navigate(['/app/menu']); }
  goToOrder() { this.router.navigate(['/app/order']); }
  goBook() { this.router.navigate(['/app/tables']); }
}
