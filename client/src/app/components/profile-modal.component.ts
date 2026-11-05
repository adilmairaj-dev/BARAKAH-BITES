import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../core/models';
import { select } from '../core/store-signal';
import { adminStore } from '../store/admin.store';
import { authStore } from '../store/auth.store';
import { FilePickerComponent } from './file-picker.component';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [FormsModule, ModalShellComponent, FilePickerComponent],
  template: `
    <app-modal-shell title="Edit restaurant profile" (close)="close.emit()">
      <div class="space-y-3">
        <input class="field" placeholder="Restaurant name" [(ngModel)]="name" />
        <input class="field" placeholder="Address" [(ngModel)]="address" />
        <input class="field" placeholder="Phone" [(ngModel)]="phone" />
        <div class="grid grid-cols-2 gap-3">
          <label class="text-xs text-neutral-400">Opens <input type="time" class="field mt-1" [(ngModel)]="opening" /></label>
          <label class="text-xs text-neutral-400">Closes <input type="time" class="field mt-1" [(ngModel)]="closing" /></label>
        </div>
        <textarea class="field min-h-24" placeholder="About the restaurant" [(ngModel)]="description"></textarea>
        <app-file-picker label="Building photo (leave to keep current)" [current]="image" (picked)="file = $event" />
      </div>
      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }
      <button class="btn mt-5 w-full" [disabled]="busy() || !valid()" (click)="submit()">
        {{ busy() ? 'Saving…' : 'Save changes' }}
      </button>
    </app-modal-shell>`,
})
export class ProfileModalComponent {
  close = output<void>();
  busy = select(adminStore, s => s.busy);
  error = select(adminStore, s => s.error);
  file: File | null = null;

  private r = authStore.getState().account as Restaurant | null;
  name = this.r?.name ?? '';
  address = this.r?.address ?? '';
  phone = this.r?.phone ?? '';
  opening = this.r?.opening_Time ?? '';
  closing = this.r?.closing_Time ?? '';
  description = this.r?.description ?? '';
  image = this.r?.image ?? '';

  constructor() { adminStore.getState().clearError(); }

  valid = () => !!(this.name && this.address && this.phone && this.opening && this.closing && this.description);

  async submit() {
    const fd = new FormData();
    fd.append('name', this.name);
    fd.append('address', this.address);
    fd.append('phone', this.phone);
    fd.append('opening_Time', this.opening);
    fd.append('closing_Time', this.closing);
    fd.append('description', this.description);
    if (this.file) fd.append('image', this.file);
    if (await adminStore.getState().updateProfile(fd)) this.close.emit();
  }
}
