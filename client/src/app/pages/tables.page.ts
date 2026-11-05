import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingModalComponent } from '../components/booking-modal.component';
import { IconComponent } from '../components/icon.component';
import { TableCardComponent } from '../components/table-card.component';
import { Table } from '../core/models';
import { select } from '../core/store-signal';
import { catalogStore } from '../store/catalog.store';
import { reservationStore } from '../store/reservation.store';

@Component({
  selector: 'app-tables-page',
  standalone: true,
  imports: [TableCardComponent, BookingModalComponent, IconComponent],
  template: `
    <main class="mx-auto max-w-6xl px-6 py-8 pb-24">
      <button class="btn-ghost" (click)="back()"><app-icon name="back" [size]="16" />Back</button>

      <h1 class="mt-8 font-display text-4xl text-white">Choose your table</h1>
      <p class="mt-2 text-neutral-400">{{ available().length }} of {{ tables().length }} tables are free right now.</p>

      @if (available().length) {
        <h2 class="mt-10 mb-4 flex items-center gap-2 text-lg text-emerald-400"><app-icon name="check" [size]="18" />Available</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (t of available(); track t._id) { <app-table-card [table]="t" (book)="selected.set($event)" /> }
        </div>
      }

      @if (reserved().length) {
        <h2 class="mt-12 mb-4 flex items-center gap-2 text-lg text-rose-400"><app-icon name="lock" [size]="18" />Already reserved</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (t of reserved(); track t._id) { <app-table-card [table]="t" /> }
        </div>
      }

      @if (!tables().length && !loading()) { <p class="mt-10 text-neutral-400">No tables have been added yet.</p> }
      @if (error()) { <p class="mt-6 text-rose-400">{{ error() }}</p> }
    </main>

    @if (selected(); as t) {
      <app-booking-modal [table]="t" (close)="selected.set(null)" (booked)="openDrawer()" />
    }
  `,
})
export class TablesPage implements OnInit {
  tables = select(catalogStore, s => s.tables);
  loading = select(catalogStore, s => s.loading);
  error = select(catalogStore, s => s.error);
  selected = signal<Table | null>(null);

  available = computed(() => this.tables().filter(t => t.status === 'available'));
  reserved = computed(() => this.tables().filter(t => t.status === 'reserved'));

  constructor(private router: Router) {}
  ngOnInit() { catalogStore.getState().fetchTables(); }
  back() { this.router.navigate(['/app']); }
  openDrawer() { reservationStore.getState().setDrawer(true); }
}
