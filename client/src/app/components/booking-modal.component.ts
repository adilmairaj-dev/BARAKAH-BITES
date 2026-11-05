import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table } from '../core/models';
import { select } from '../core/store-signal';
import { reservationStore } from '../store/reservation.store';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" (click)="close.emit()">
      <div class="card w-full max-w-md overflow-hidden" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        <img [src]="table().image" alt="" class="h-40 w-full object-cover" />
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-2xl text-white">Book Table {{ table().tableNumber }}</h3>
            <button class="text-neutral-400 hover:text-white" (click)="close.emit()" aria-label="Close"><app-icon name="x" /></button>
          </div>
          <p class="mt-1 text-sm text-neutral-400">Seats {{ table().capacity }} · Floor {{ table().floor }}</p>

          <div class="mt-5 space-y-3">
            <label class="block text-sm">Date
              <input type="date" class="field mt-1" [min]="today" [(ngModel)]="date" />
            </label>
            <label class="block text-sm">Time
              <input type="time" class="field mt-1" [(ngModel)]="time" />
            </label>
          </div>

          @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }

          <button class="btn w-full mt-6" [disabled]="!date || !time || busy()" (click)="submit()">
            {{ busy() ? 'Booking…' : 'Confirm booking' }}
          </button>
        </div>
      </div>
    </div>`,
})
export class BookingModalComponent {
  table = input.required<Table>();
  close = output<void>();
  booked = output<void>();

  today = new Date().toISOString().split('T')[0];
  date = '';
  time = '';
  busy = select(reservationStore, s => s.busy);
  error = select(reservationStore, s => s.error);

  async submit() {
    const t = this.table();
    const ok = await reservationStore.getState().book({
      tableId: t._id, restaurantId: t.restaurant, date: this.date, time: this.time,
    });
    if (ok) { this.booked.emit(); this.close.emit(); }
  }
}
