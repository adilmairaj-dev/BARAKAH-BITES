import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Food } from '../core/models';
import { IconComponent } from './icon.component';
import { select } from '../core/store-signal';
import { orderStore } from '../store/order.store';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CurrencyPipe, IconComponent],
  host: {
    class: 'flex flex-col h-full',
  },
  template: `
    <article class="card overflow-hidden group h-full flex flex-col justify-between">
      <div>
        <div class="aspect-[4/3] overflow-hidden bg-ink-800 shrink-0 relative">
          <img [src]="food().image" [alt]="food().name" loading="lazy"
               class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          @if (quantity() > 0) {
            <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-saffron text-ink-950 shadow-md">
              {{ quantity() }} in cart
            </span>
          }
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display text-xl text-white leading-snug">{{ food().name }}</h3>
            <span class="shrink-0 rounded-full bg-saffron/15 px-3 py-1 text-sm font-semibold text-saffron">
              {{ food().price | currency:'INR':'symbol':'1.0-0' }}
            </span>
          </div>
          <p class="mt-2 text-sm text-neutral-400 line-clamp-2">{{ food().description }}</p>
        </div>
      </div>

      <div class="px-5 pb-5 pt-0">
        @if (quantity() > 0) {
          <div class="flex items-center justify-between w-full rounded-xl bg-ink-800 border border-saffron/40 px-3 py-2 shadow-inner">
            <span class="text-xs font-medium text-neutral-300">Quantity</span>
            <div class="flex items-center gap-2.5">
              <button
                type="button"
                (click)="decrement($event)"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-ink-700 text-white transition hover:bg-saffron hover:text-ink-950 active:scale-95"
                title="Decrease quantity">
                <app-icon name="minus" [size]="14" />
              </button>
              <span class="text-sm font-bold text-saffron w-5 text-center">{{ quantity() }}</span>
              <button
                type="button"
                (click)="increment($event)"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-saffron text-ink-950 transition hover:bg-saffron-soft active:scale-95"
                title="Increase quantity">
                <app-icon name="plus" [size]="14" />
              </button>
            </div>
          </div>
        } @else {
          <button
            type="button"
            (click)="increment($event)"
            class="w-full flex items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-800/80 px-4 py-2.5 text-sm font-medium text-white transition hover:border-saffron hover:bg-saffron/10 hover:text-saffron active:scale-95 cursor-pointer">
            <app-icon name="plus" [size]="16" class="text-saffron" />
            <span>Add to order</span>
          </button>
        }
      </div>
    </article>`,
})
export class FoodCardComponent {
  food = input.required<Food>();
  private cartItems = select(orderStore, s => s.items);

  quantity = computed(() => {
    const item = this.cartItems().find(i => i.food._id === this.food()._id);
    return item ? item.quantity : 0;
  });

  increment(e: MouseEvent) {
    e.stopPropagation();
    orderStore.getState().addItem(this.food());
  }

  decrement(e: MouseEvent) {
    e.stopPropagation();
    orderStore.getState().updateQuantity(this.food()._id, this.quantity() - 1);
  }
}
