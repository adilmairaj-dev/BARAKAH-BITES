import { Component, output } from '@angular/core';
import { IconComponent } from './icon.component';

export type AdminAction = 'profile' | 'food' | 'table';

@Component({
  selector: 'app-admin-dock',
  standalone: true,
  imports: [IconComponent],
  template: `
    <nav class="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full border border-ink-700 bg-ink-900/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur"
         aria-label="Restaurant actions">
      <button class="flex items-center gap-2 rounded-full px-4 py-3 text-sm text-neutral-200 transition hover:bg-ink-800" (click)="pick.emit('profile')">
        <app-icon name="edit" [size]="18" /><span class="hidden sm:inline">Edit profile</span>
      </button>
      <button class="flex items-center gap-2 rounded-full px-4 py-3 text-sm text-neutral-200 transition hover:bg-ink-800" (click)="pick.emit('food')">
        <app-icon name="utensils" [size]="18" /><span class="hidden sm:inline">Add food</span>
      </button>
      <button class="flex items-center gap-2 rounded-full bg-saffron px-4 py-3 text-sm font-semibold text-ink-950 transition hover:bg-saffron-soft" (click)="pick.emit('table')">
        <app-icon name="table" [size]="18" /><span class="hidden sm:inline">Add table</span>
      </button>
    </nav>`,
})
export class AdminDockComponent {
  pick = output<AdminAction>();
}
