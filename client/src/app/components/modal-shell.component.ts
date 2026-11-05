import { Component, input, output } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" (click)="close.emit()">
      <div class="card max-h-[90vh] w-full max-w-md overflow-y-auto p-6" (click)="$event.stopPropagation()"
           role="dialog" aria-modal="true">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-display text-2xl text-white">{{ title() }}</h3>
          <button class="text-neutral-400 hover:text-white" (click)="close.emit()" aria-label="Close"><app-icon name="x" /></button>
        </div>
        <ng-content />
      </div>
    </div>`,
})
export class ModalShellComponent {
  title = input.required<string>();
  close = output<void>();
}
