import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { select } from '../core/store-signal';
import { adminStore } from '../store/admin.store';
import { FilePickerComponent } from './file-picker.component';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  selector: 'app-food-modal',
  standalone: true,
  imports: [FormsModule, ModalShellComponent, FilePickerComponent],
  template: `
    <app-modal-shell title="Add a dish" (close)="close.emit()">
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Dish Name</label>
          <input class="field" placeholder="e.g. Butter Chicken" [(ngModel)]="name" />
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
          <textarea class="field min-h-20" placeholder="Short description of ingredients, flavors..." [(ngModel)]="description"></textarea>
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Price (₹)</label>
          <input class="field" type="number" min="0" placeholder="Price (₹)" [(ngModel)]="price" />
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-400 mb-1">Photo</label>
          <app-file-picker label="Dish photo" (picked)="file = $event" />
        </div>
      </div>
      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }
      <button class="btn mt-5 w-full" [disabled]="busy() || !name || !description || !price || !file" (click)="submit()">
        {{ busy() ? 'Adding…' : 'Add dish' }}
      </button>
    </app-modal-shell>`,
})
export class FoodModalComponent {
  close = output<void>();
  busy = select(adminStore, s => s.busy);
  error = select(adminStore, s => s.error);
  name = '';
  category = 'main';
  description = '';
  price: number | null = null;
  file: File | null = null;

  constructor() { adminStore.getState().clearError(); }

  async submit() {
    const fd = new FormData();
    fd.append('name', this.name);
    fd.append('category', this.category);
    fd.append('description', this.description);
    fd.append('price', String(this.price));
    fd.append('image', this.file!);
    if (await adminStore.getState().addFood(fd)) this.close.emit();
  }
}
