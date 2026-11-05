import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';
import { reservationStore } from '../store/reservation.store';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-reservations-drawer',
  standalone: true,
  imports: [DatePipe, IconComponent],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-30 bg-black/50" (click)="close()"></div>
    }
    <aside class="fixed right-0 top-0 z-40 flex h-full w-full sm:w-80 lg:w-1/4 lg:min-w-[340px] flex-col border-l border-ink-700 bg-ink-900 transition-transform duration-300"
           [class.translate-x-full]="!open()" [attr.aria-hidden]="!open()">
      <header class="flex items-center justify-between border-b border-ink-700 p-5">
        <h2 class="font-display text-xl text-white">My bookings</h2>
        <button class="text-neutral-400 hover:text-white" (click)="close()" aria-label="Close"><app-icon name="x" /></button>
      </header>

      <div class="flex-1 space-y-3 overflow-y-auto p-5">
        @for (r of items(); track r._id) {
          <div class="rounded-xl border border-ink-700 bg-ink-800 p-4">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-white">Table {{ r.table.tableNumber }}</h3>
              <span class="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-400">{{ r.status }}</span>
            </div>
            <p class="mt-1 text-sm text-neutral-400">{{ r.restaurant.name }}</p>
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-300">
              <span class="flex items-center gap-1.5"><app-icon name="calendar" [size]="14" />{{ r.date | date:'d MMM y' }}</span>
              <span class="flex items-center gap-1.5"><app-icon name="clock" [size]="14" />{{ r.time }}</span>
              <span class="flex items-center gap-1.5"><app-icon name="users" [size]="14" />{{ r.table.capacity }} seats</span>
              <span class="flex items-center gap-1.5"><app-icon name="layers" [size]="14" />Floor {{ r.table.floor }}</span>
            </div>
            <button class="btn-ghost mt-4 w-full !text-rose-400 hover:!bg-rose-500/10" [disabled]="busy()"
                    (click)="cancel(r._id)">
              <app-icon name="trash" [size]="16" />Cancel booking
            </button>
          </div>
        } @empty {
          <div class="mt-16 text-center text-neutral-400">
            <app-icon name="calendar" [size]="36" class="mx-auto text-ink-700" />
            <p class="mt-3 text-white">No bookings yet</p>
            <p class="text-sm">Book a table and it will show up here.</p>
          </div>
        }
      </div>

      <footer class="border-t border-ink-700 p-5">
        <button class="btn-ghost w-full" (click)="logout()">
          <app-icon name="logout" [size]="16" />Log out
        </button>
      </footer>
    </aside>`,
})
export class ReservationsDrawerComponent {
  open = select(reservationStore, s => s.drawerOpen);
  items = select(reservationStore, s => s.mine);
  busy = select(reservationStore, s => s.busy);
  close = () => reservationStore.getState().setDrawer(false);
  cancel = (id: string) => reservationStore.getState().cancel(id);

  constructor(private router: Router) {}

  async logout() {
    this.close();
    await authStore.getState().logout();
    this.router.navigate(['/login']);
  }
}