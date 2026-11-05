import { Component, OnInit, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Food } from '../core/models';
import { select } from '../core/store-signal';
import { adminStore } from '../store/admin.store';
import { FilePickerComponent } from './file-picker.component';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  selector: 'app-food-edit-modal',
  standalone: true,
  imports: [FormsModule, ModalShellComponent, FilePickerComponent],
  template: `
    <app-modal-shell title="Edit dish & price" (close)="close.emit()">
      <div class="space-y-3">
        <!-- Current dish summary -->
        <div class="flex items-center gap-3 p-3 rounded-xl bg-ink-800/70 border border-ink-700/60">
          <img [src]="food().image" [alt]="food().name" class="h-14 w-14 rounded-lg object-cover shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-white truncate">{{ food().name }}</p>
            <span class="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium" [class]="categoryBadge(food().category).class">
              {{ categoryBadge(food().category).label }}
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs text-neutral-400 block">Current</span>
            <span class="text-sm font-semibold text-saffron">₹{{ food().price }}</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-300 mb-1">
            Price (₹) <span class="text-saffron font-normal">— update price here</span>
          </label>
          <input
            class="field text-base font-semibold text-saffron focus:ring-1 focus:ring-saffron"
            type="number"
            min="0"
            placeholder="Price (₹)"
            [(ngModel)]="price"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Dish Name</label>
          <input class="field" placeholder="Dish name" [(ngModel)]="name" />
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Category</label>
          <select class="field bg-ink-800 text-white cursor-pointer" [(ngModel)]="category">
            <option value="starters" class="bg-ink-900 text-white">🥗 Appetizers & Starters</option>
            <option value="main" class="bg-ink-900 text-white">🍛 Main Course</option>
            <option value="desserts" class="bg-ink-900 text-white">🍰 Desserts</option>
            <option value="beverages" class="bg-ink-900 text-white">🍹 Beverages</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Short Description</label>
          <textarea class="field min-h-20" placeholder="Description" [(ngModel)]="description"></textarea>
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Replace Photo (Optional)</label>
          <app-file-picker label="Choose replacement photo" (picked)="file = $event" />
        </div>
      </div>

      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }

      <div class="mt-5 flex gap-3">
        <button class="btn-ghost flex-1" type="button" (click)="close.emit()">
          Cancel
        </button>
        <button
          class="btn flex-1"
          type="button"
          [disabled]="busy() || !name || price === null || price < 0"
          (click)="submit()"
        >
          {{ busy() ? 'Updating…' : 'Save changes' }}
        </button>
      </div>
    </app-modal-shell>`,
})
export class FoodEditModalComponent implements OnInit {
  food = input.required<Food>();
  close = output<void>();

  busy = select(adminStore, s => s.busy);
  error = select(adminStore, s => s.error);

  name = '';
  category = 'main';
  description = '';
  price: number | null = null;
  file: File | null = null;

  constructor() {
    adminStore.getState().clearError();
  }

  ngOnInit() {
    const f = this.food();
    this.name = f.name;
    this.category = f.category || 'main';
    this.description = f.description;
    this.price = f.price;
  }

  categoryBadge(category?: string) {
    switch (category) {
      case 'starters':
        return { label: 'Starters', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' };
      case 'desserts':
        return { label: 'Desserts', class: 'bg-pink-500/15 text-pink-300 border border-pink-500/30' };
      case 'beverages':
        return { label: 'Beverages', class: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' };
      case 'main':
      default:
        return { label: 'Main Course', class: 'bg-saffron/15 text-saffron border border-saffron/30' };
    }
  }

  async submit() {
    const fd = new FormData();
    fd.append('name', this.name);
    fd.append('category', this.category);
    fd.append('description', this.description);
    fd.append('price', String(this.price));
    if (this.file) {
      fd.append('image', this.file);
    }
    if (await adminStore.getState().updateFood(this.food()._id, fd)) {
      this.close.emit();
    }
  }
}

