import { Component, computed, input, output } from '@angular/core';
import { Table } from '../core/models';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [IconComponent],
  host: {
    class: 'flex flex-col h-full',
  },
  template: `
    <article class="card overflow-hidden transition h-full flex flex-col justify-between" [class.opacity-60]="reserved()"
             [class.hover:border-saffron]="!reserved()">
      <div class="relative aspect-[16/10] bg-ink-800">
        <img [src]="table().image" [alt]="'Table ' + table().tableNumber" loading="lazy"
             class="h-full w-full object-cover" [class.grayscale]="reserved()" />
        <span class="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur"
              [class]="reserved() ? 'bg-rose-500/80 text-white' : 'bg-emerald-500/90 text-ink-950'">
          {{ reserved() ? 'Reserved' : 'Available' }}
        </span>
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <h3 class="font-display text-2xl text-white">Table {{ table().tableNumber }}</h3>
          <div class="flex items-center gap-4 text-sm text-neutral-400">
            <span class="flex items-center gap-1.5"><app-icon name="users" [size]="16" />{{ table().capacity }}</span>
            <span class="flex items-center gap-1.5"><app-icon name="layers" [size]="16" />Floor {{ table().floor }}</span>
          </div>
        </div>
        <button class="btn w-full mt-4" [disabled]="reserved()" (click)="book.emit(table())">
          <app-icon name="calendar" [size]="16" />{{ reserved() ? 'Already booked' : 'Book this table' }}
        </button>
      </div>
    </article>`,
})
export class TableCardComponent {
  table = input.required<Table>();
  book = output<Table>();
  reserved = computed(() => this.table().status === 'reserved');
}
