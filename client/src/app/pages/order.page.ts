import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { IconComponent } from '../components/icon.component';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';
import { orderStore, PlacedOrder } from '../store/order.store';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, IconComponent],
  template: `
    <main class="mx-auto max-w-6xl px-6 py-8 pb-32">
      <button class="btn-ghost" (click)="goBack()">
        <app-icon name="back" [size]="16" />Back to menu
      </button>

      @if (orderSuccess(); as order) {
        <!-- Order Confirmation Screen -->
        <section class="mt-8 max-w-2xl mx-auto card p-8 sm:p-10 border-emerald-500/30 text-center animate-fade-in">
          <div class="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
            <app-icon name="check" [size]="32" />
          </div>

          <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
            Order Confirmed
          </span>

          <h1 class="font-display text-3xl sm:text-4xl text-white mt-4">Thank you for your order!</h1>
          <p class="text-neutral-400 mt-2 text-sm sm:text-base">
            Your order <strong class="text-saffron">#{{ order.orderId }}</strong> has been placed and sent to the kitchen.
          </p>

          <div class="mt-8 rounded-xl bg-ink-800 p-5 text-left border border-ink-700/60 space-y-3">
            <div class="flex justify-between items-center text-sm border-b border-ink-700/60 pb-3">
              <span class="text-neutral-400">Estimated Delivery</span>
              <span class="text-emerald-400 font-semibold flex items-center gap-1.5">
                <app-icon name="clock" [size]="15" /> 30–40 mins
              </span>
            </div>
            <div class="flex justify-between items-center text-sm border-b border-ink-700/60 pb-3">
              <span class="text-neutral-400">Delivering To</span>
              <span class="text-white font-medium text-right max-w-xs truncate">{{ order.customerName }} • {{ order.phone }}</span>
            </div>
            <div class="flex justify-between items-center text-sm border-b border-ink-700/60 pb-3">
              <span class="text-neutral-400">Address</span>
              <span class="text-neutral-300 text-right max-w-xs text-xs">{{ order.address }}</span>
            </div>
            <div class="flex justify-between items-center text-base pt-1">
              <span class="text-white font-medium">Total Paid</span>
              <span class="text-saffron font-bold">{{ order.totalAmount | currency:'INR':'symbol':'1.0-0' }}</span>
            </div>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button class="btn" (click)="goToMenu()">
              <app-icon name="utensils" [size]="18" />Order more food
            </button>
            <button class="btn-ghost" (click)="goToHome()">
              Back to Home
            </button>
          </div>
        </section>
      } @else if (!items().length) {
        <!-- Empty Cart State -->
        <section class="mt-12 max-w-lg mx-auto card p-12 text-center">
          <div class="h-16 w-16 mx-auto rounded-full bg-ink-800 border border-ink-700 text-neutral-400 flex items-center justify-center mb-5">
            <app-icon name="cart" [size]="28" class="text-neutral-500" />
          </div>
          <h2 class="font-display text-2xl text-white">Your order is empty</h2>
          <p class="text-neutral-400 mt-2 text-sm">
            You haven't added any dishes yet. Explore our mouth-watering menu and pick your favorites.
          </p>
          <button class="btn mt-6 !px-6" (click)="goToMenu()">
            <app-icon name="utensils" [size]="18" />Browse Menu
          </button>
        </section>
      } @else {
        <!-- Active Order Checkout (Matches Reference) -->
        <div class="mt-6">
          <div class="flex items-center gap-3 mb-8">
            <app-icon name="cart" [size]="28" class="text-saffron" />
            <h1 class="font-display text-3xl sm:text-4xl text-white">
              Your Order <span class="text-xl font-sans font-normal text-neutral-400">({{ totalQuantity() }} items)</span>
            </h1>
          </div>

          <div class="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
            <!-- Left Column: Dishes Added -->
            <div class="card p-6 sm:p-7 border border-ink-700/80">
              <div class="flex items-center justify-between pb-4 border-b border-ink-700">
                <h2 class="font-display text-xl text-white">Dishes Added</h2>
                <button
                  type="button"
                  (click)="clearAll()"
                  class="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer">
                  <app-icon name="trash" [size]="14" />
                  <span>Clear All</span>
                </button>
              </div>

              <!-- List of added items -->
              <div class="divide-y divide-ink-800">
                @for (item of items(); track item.food._id) {
                  <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <img [src]="item.food.image" [alt]="item.food.name" class="h-14 w-14 rounded-lg object-cover bg-ink-800 shrink-0" />
                      <div>
                        <h3 class="font-medium text-white text-base leading-snug">{{ item.food.name }}</h3>
                        <p class="text-xs text-neutral-400 mt-0.5">
                          {{ item.food.price | currency:'INR':'symbol':'1.0-0' }} per item
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center justify-between sm:justify-end gap-5">
                      <!-- Quantity Stepper -->
                      <div class="flex items-center gap-2 rounded-lg bg-ink-800 border border-ink-700 px-2 py-1">
                        <button
                          type="button"
                          (click)="updateQty(item.food._id, item.quantity - 1)"
                          class="h-6 w-6 rounded flex items-center justify-center text-neutral-300 hover:bg-ink-700 hover:text-white transition cursor-pointer">
                          <app-icon name="minus" [size]="13" />
                        </button>
                        <span class="text-sm font-bold text-saffron px-1.5 min-w-[20px] text-center">{{ item.quantity }}</span>
                        <button
                          type="button"
                          (click)="updateQty(item.food._id, item.quantity + 1)"
                          class="h-6 w-6 rounded flex items-center justify-center text-neutral-300 hover:bg-ink-700 hover:text-white transition cursor-pointer">
                          <app-icon name="plus" [size]="13" />
                        </button>
                      </div>

                      <!-- Subtotal for item -->
                      <span class="text-base font-semibold text-white min-w-[70px] text-right">
                        {{ (item.food.price * item.quantity) | currency:'INR':'symbol':'1.0-0' }}
                      </span>

                      <!-- Remove item -->
                      <button
                        type="button"
                        (click)="removeItem(item.food._id)"
                        class="text-neutral-500 hover:text-rose-400 transition cursor-pointer p-1"
                        title="Remove dish">
                        <app-icon name="x" [size]="18" />
                      </button>
                    </div>
                  </div>
                }
              </div>

              <!-- Add More Dishes Button -->
              <div class="mt-6 pt-4 border-t border-ink-800">
                <button class="btn-ghost !px-4 !py-2 text-sm" (click)="goToMenu()">
                  <app-icon name="plus" [size]="15" />Add More Dishes
                </button>
              </div>
            </div>

            <!-- Right Column: Delivery Information & Summary -->
            <div class="card p-6 sm:p-7 border border-ink-700/80 space-y-6">
              <div class="flex items-center gap-2 pb-3 border-b border-ink-700">
                <app-icon name="pin" [size]="18" class="text-saffron" />
                <h2 class="font-display text-xl text-white">Delivery Information</h2>
              </div>

              <!-- Book a table option right inside checkout -->
              <div class="rounded-xl bg-ink-800 border border-saffron/30 p-3.5 flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <app-icon name="table" [size]="18" class="text-saffron shrink-0" />
                  <div>
                    <p class="text-xs font-semibold text-white">Want to dine in?</p>
                    <p class="text-[11px] text-neutral-400">Book your table for this meal</p>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="goToTables()"
                  class="btn-ghost !px-3 !py-1.5 text-xs font-semibold text-saffron border-saffron/40 hover:bg-saffron hover:text-ink-950 shrink-0 cursor-pointer">
                  Book a table &rarr;
                </button>
              </div>

              <!-- Form Inputs -->
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-neutral-300 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="customerName"
                    placeholder="e.g. Asad Khan"
                    class="field"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-300 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    [(ngModel)]="phone"
                    placeholder="e.g. 9876543210"
                    class="field"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-300 mb-1.5">Delivery Address *</label>
                  <textarea
                    [(ngModel)]="address"
                    rows="3"
                    placeholder="House/Flat No., Street, Landmark, City..."
                    class="field resize-none"></textarea>
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-400 mb-1.5">Special Instructions (Optional)</label>
                  <input
                    type="text"
                    [(ngModel)]="specialInstructions"
                    placeholder="e.g. Extra spicy, ring the bell, etc."
                    class="field"
                  />
                </div>
              </div>

              <!-- Bill Summary -->
              <div class="pt-4 border-t border-ink-700 space-y-3">
                <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Bill Summary</h3>

                <div class="flex justify-between text-sm text-neutral-300">
                  <span>Item Total ({{ totalQuantity() }} items)</span>
                  <span>{{ itemsTotal() | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>

                <div class="flex justify-between text-sm text-neutral-300">
                  <span>Delivery Charges</span>
                  <span class="text-emerald-400 font-semibold">FREE</span>
                </div>

                <div class="flex justify-between text-sm text-neutral-300">
                  <span>Restaurant Packaging & Taxes</span>
                  <span class="text-neutral-400">₹0.00</span>
                </div>

                <div class="pt-3 border-t border-ink-700/80 flex justify-between items-center text-lg font-bold text-white">
                  <span>To Pay</span>
                  <span class="text-saffron text-2xl font-display">{{ itemsTotal() | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>

              <!-- Place Order Button -->
              @if (validationError) {
                <p class="text-sm text-rose-400">{{ validationError }}</p>
              }

              <button
                type="button"
                (click)="submitOrder()"
                [disabled]="submitting()"
                class="btn w-full !py-3.5 text-base font-semibold shadow-lg shadow-saffron/20 cursor-pointer">
                {{ submitting() ? 'Placing Order…' : 'Place Order (' + (itemsTotal() | currency:'INR':'symbol':'1.0-0') + ')' }}
              </button>
            </div>
          </div>
        </div>
      }
    </main>
  `,
})
export class OrderPage {
  items = select(orderStore, s => s.items);
  account = select(authStore, s => s.account);

  customerName = '';
  phone = '';
  address = '';
  specialInstructions = '';
  validationError = '';

  orderSuccess = signal<PlacedOrder | null>(null);

  totalQuantity = computed(() => this.items().reduce((acc, i) => acc + i.quantity, 0));
  itemsTotal = computed(() => this.items().reduce((sum, i) => sum + i.food.price * i.quantity, 0));

  constructor(private router: Router) {
    const user = this.account();
    if (user) {
      this.customerName = user.name || '';
    }
  }

  updateQty(foodId: string, qty: number) {
    orderStore.getState().updateQuantity(foodId, qty);
  }

  removeItem(foodId: string) {
    orderStore.getState().removeItem(foodId);
  }

  clearAll() {
    orderStore.getState().clearCart();
  }

  goBack() {
    this.router.navigate(['/app/menu']);
  }

  goToMenu() {
    this.router.navigate(['/app/menu']);
  }

  goToHome() {
    this.router.navigate(['/app']);
  }

  goToTables() {
    this.router.navigate(['/app/tables']);
  }

  submitting = signal(false);

  async submitOrder() {
    this.validationError = '';
    if (!this.customerName.trim()) {
      this.validationError = 'Please enter your name.';
      return;
    }
    if (!this.phone.trim()) {
      this.validationError = 'Please enter your phone number.';
      return;
    }
    if (!this.address.trim()) {
      this.validationError = 'Please enter your delivery address.';
      return;
    }

    this.submitting.set(true);
    try {
      const order = await orderStore.getState().placeOrder({
        customerName: this.customerName.trim(),
        phone: this.phone.trim(),
        address: this.address.trim(),
        specialInstructions: this.specialInstructions.trim() || undefined,
      });

      this.orderSuccess.set(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.submitting.set(false);
    }
  }
}

