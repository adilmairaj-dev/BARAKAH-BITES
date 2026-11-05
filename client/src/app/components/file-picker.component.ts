import { Component, input, output, signal } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-file-picker',
  standalone: true,
  imports: [IconComponent],
  template: `
    <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink-700 bg-ink-800 p-3 transition hover:border-saffron">
      @if (preview() || current()) {
        <img [src]="preview() || current()" alt="" class="h-14 w-14 rounded-lg object-cover" />
      } @else {
        <div class="flex h-14 w-14 items-center justify-center rounded-lg bg-ink-900 text-neutral-500"><app-icon name="upload" /></div>
      }
      <span class="text-sm text-neutral-400">{{ fileName() || label() }}</span>
      <input type="file" accept="image/*" class="hidden" (change)="onChange($event)" />
    </label>`,
})
export class FilePickerComponent {
  label = input('Choose an image');
  current = input<string>('');
  picked = output<File>();
  preview = signal('');
  fileName = signal('');

  onChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.fileName.set(f.name);
    this.preview.set(URL.createObjectURL(f));
    this.picked.emit(f);
  }
}
