import { Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [IconComponent],
  template: `
    <main class="min-h-screen grid lg:grid-cols-2">
      <section class="hidden lg:flex flex-col justify-between p-12 bg-ink-900 border-r border-ink-700 relative overflow-hidden select-none">
        <!-- Ambient portrait food photography -->
        <img
          src="/auth-food.jpg"
          alt="Signature dining at Barakah Bite's"
          class="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
        />

        <!-- Atmospheric dark gradient & vignette overlay for crisp readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/65 to-ink-950/40"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-ink-950/30"></div>
        <div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-saffron/20 blur-3xl pointer-events-none"></div>

        <!-- Top brand badge -->
        <div class="relative z-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <app-icon name="utensils" [size]="28" class="text-saffron drop-shadow-md" />
            <span class="font-display text-2xl text-saffron tracking-wide drop-shadow-md">Barakah Bite's</span>
          </div>
          <span class="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-ink-950/70 backdrop-blur-md border border-saffron/30 text-saffron-soft shadow-sm">
            Reserve & Dine
          </span>
        </div>

        <!-- Bottom hero copy -->
        <div class="relative z-10">
          <h1 class="font-display text-5xl leading-tight text-white max-w-md drop-shadow-lg">Your table is waiting.</h1>
          <p class="mt-4 text-neutral-300 max-w-sm text-base leading-relaxed drop-shadow">Pick a table, choose a time, and walk in knowing it's yours.</p>
        </div>
      </section>
      <section class="flex items-center justify-center p-6">
        <div class="w-full max-w-sm">
          <div class="flex items-center gap-2 mb-6 lg:hidden text-saffron font-display text-xl">
            <app-icon name="utensils" [size]="22" />
            <span>Barakah Bite's</span>
          </div>
          <h2 class="font-display text-3xl text-white">{{ title() }}</h2>
          <p class="mt-1 mb-8 text-sm text-neutral-400">{{ subtitle() }}</p>
          <ng-content />
        </div>
      </section>
    </main>`,
})
export class AuthShellComponent {
  title = input.required<string>();
  subtitle = input('');
}
