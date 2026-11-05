import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { select } from '../core/store-signal';
import { adminStore } from '../store/admin.store';
import { FilePickerComponent } from './file-picker.component';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  selector: 'app-table-modal',
  standalone: true,
  imports: [FormsModule, ModalShellComponent, FilePickerComponent],
  template: `
    <app-modal-shell title="Add a table" (close)="close.emit()">
      <div class="space-y-3">
        <input class="field" type="number" min="1" placeholder="Table number" [(ngModel)]="tableNumber" />
        <div class="grid grid-cols-2 gap-3">
          <input class="field" type="number" min="1" placeholder="Seats" [(ngModel)]="capacity" />
          <input class="field" type="number" min="0" placeholder="Floor" [(ngModel)]="floor" />
        </div>
        <app-file-picker label="Table photo" (picked)="file = $event" />
      </div>
      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }
      <button class="btn mt-5 w-full" [disabled]="busy() || !tableNumber || !capacity || floor === null || !file" (click)="submit()">
        {{ busy() ? 'Adding…' : 'Add table' }}
      </button>
    </app-modal-shell>`,
})
export class TableModalComponent {
  close = output<void>();
  busy = select(adminStore, s => s.busy);
  error = select(adminStore, s => s.error);
  tableNumber: number | null = null; capacity: number | null = null; floor: number | null = null;
  file: File | null = null;

  constructor() { adminStore.getState().clearError(); }

  async submit() {
    const fd = new FormData();
    fd.append('tableNumber', String(this.tableNumber));
    fd.append('capacity', String(this.capacity));
    fd.append('floor', String(this.floor));
    fd.append('image', this.file!);
    if (await adminStore.getState().addTable(fd)) this.close.emit();
  }
}
