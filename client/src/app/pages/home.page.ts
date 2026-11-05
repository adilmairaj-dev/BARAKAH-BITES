import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FoodCardComponent } from '../components/food-card.component';
import { IconComponent } from '../components/icon.component';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';
import { catalogStore } from '../store/catalog.store';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FoodCardComponent, IconComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between">
      <!-- Hero: building photo -->
      <header class="relative flex-1 min-h-[380px] w-full overflow-hidden bg-ink-900">
        @if (restaurant(); as r) {
          <img [src]="r.image" [alt]="r.name" class="absolute inset-0 h-full w-full object-cover brightness-90" />
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/20"></div>
          <div class="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-6 pb-8 md:pb-10">
            <p class="text-sm font-medium text-saffron drop-shadow">Welcome, {{ firstName() }}</p>
            <h1 class="font-display text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-md">{{ r.name || "Barakah Bite's" }}</h1>
          </div>
        } @else {
          <div class="absolute inset-0 animate-pulse bg-ink-800"></div>
        }
      </header>

      @if (restaurant(); as r) {
        <div class="mx-auto w-full max-w-6xl px-6 py-8 md:py-10">
          <section class="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 class="font-display text-2xl md:text-3xl text-white">About us</h2>
              <p class="mt-3 max-w-prose leading-relaxed text-neutral-300">{{ r.description }}</p>
            </div>
            <ul class="card space-y-3.5 p-6 text-sm text-neutral-200">
              <li class="flex items-center gap-3"><app-icon name="pin" [size]="18" class="text-saffron shrink-0" /><span>{{ r.address }}</span></li>
              <li class="flex items-center gap-3"><app-icon name="phone" [size]="18" class="text-saffron shrink-0" /><span>{{ r.phone }}</span></li>
              <li class="flex items-center gap-3"><app-icon name="mail" [size]="18" class="text-saffron shrink-0" /><span>{{ r.email }}</span></li>
              <li class="flex items-start gap-3">
                <app-icon name="clock" [size]="18" class="text-saffron shrink-0 mt-0.5" />
                <div class="leading-snug">
                  <p class="text-neutral-200">{{ formattedTiming() }} (All day)</p>
                  <p class="text-xs text-rose-400 font-medium mt-0.5 flex items-center gap-1.5">
                    <span class="inline-block h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                    Friday closed
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      }
    </div>

    <!-- Scrollable content below the fold -->
    <main class="mx-auto max-w-6xl px-6 pt-16 pb-40 space-y-20">
      <section>
        <div>
          <h2 class="font-display text-3xl text-white">From our kitchen</h2>
          <p class="mt-1 text-sm text-neutral-400">Freshly prepared highlights from today's kitchen</p>
        </div>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          @for (f of foods(); track f._id) { <app-food-card [food]="f" /> }
        </div>
        @if (!foods().length && !loading()) {
          <p class="mt-8 text-neutral-400">The menu is being updated. Check back soon.</p>
        }
        @if (error()) { <p class="mt-6 text-rose-400">{{ error() }}</p> }
      </section>

      <!-- Menu Section -->
      <section>
        <div>
          <h2 class="font-display text-3xl md:text-4xl text-white">Menu</h2>
          <p class="mt-1 text-sm text-neutral-400">Explore our curated courses, crafted for every craving</p>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          @for (cat of menuCategories; track cat.id) {
            <article (click)="goToMenu(cat.id)"
                     class="card cursor-pointer overflow-hidden group h-full flex flex-col justify-between transition-all duration-300 hover:border-saffron/60 hover:-translate-y-1 shadow-lg">
              <div class="relative aspect-[4/3] overflow-hidden bg-ink-800 shrink-0">
                <img [src]="cat.image" [alt]="cat.title" loading="lazy"
                     class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80"></div>
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-ink-950/80 backdrop-blur-md border border-ink-700 text-saffron">
                  {{ cat.tag }}
                </span>
              </div>
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-display text-xl text-white group-hover:text-saffron transition-colors">{{ cat.title }}</h3>
                  <p class="mt-2 text-sm text-neutral-400 leading-relaxed">{{ cat.description }}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-ink-800 flex items-center justify-between text-xs text-neutral-400">
                  <span class="text-neutral-500 font-medium">{{ cat.badge }}</span>
                  <span class="text-saffron font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            </article>
          }
        </div>
      </section>
    </main>
  `,
})
export class HomePage implements OnInit {
  restaurant = select(catalogStore, s => s.restaurant);
  foods = select(catalogStore, s => s.foods);
  loading = select(catalogStore, s => s.loading);
  error = select(catalogStore, s => s.error);
  account = select(authStore, s => s.account);
  firstName = () => this.account()?.name?.split(' ')[0] ?? '';

  menuCategories = [
    {
      id: 'starters',
      tag: '01',
      title: 'Appetizers & Starters',
      description: 'Crispy bites, skewers & artisan platters crafted to awaken the palate.',
      image: '/menu-starters.jpg',
      badge: 'Fresh & Crisp',
    },
    {
      id: 'main',
      tag: '02',
      title: 'Main Course',
      description: 'Signature grills, slow-cooked curries & handcrafted culinary masterpieces.',
      image: '/menu-main.jpg',
      badge: 'Chef Specials',
    },
    {
      id: 'desserts',
      tag: '03',
      title: 'Desserts',
      description: 'Black Forest Cake, Red Velvet Cake & sweet confections.',
      image: '/menu-dessert.jpg',
      badge: 'Sweet Bites',
    },
    {
      id: 'beverages',
      tag: '04',
      title: 'Beverages',
      description: 'Lime Lemon Mojito, Kiwi Fruit Juice & brewed sips.',
      image: '/menu-beverages.jpg',
      badge: 'Craft & Brews',
    },
  ];

  formattedTiming = computed(() => {
    const r = this.restaurant();
    if (!r) return '10:00 AM – 10:00 PM';
    const open = this.formatTime(r.opening_Time);
    const close = this.formatTime(r.closing_Time);
    return open && close ? `${open} – ${close}` : '10:00 AM – 10:00 PM';
  });

  private formatTime(timeStr?: string): string {
    if (!timeStr) return '';
    const clean = timeStr.trim();
    if (clean.toLowerCase().includes('am') || clean.toLowerCase().includes('pm')) return clean;
    const parts = clean.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] ? parts[1].padStart(2, '0') : '00';
    if (isNaN(h)) return clean;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  }

  constructor(private router: Router) {}
  ngOnInit() { catalogStore.getState().fetchHome(); }
  goBook() { this.router.navigate(['/app/tables']); }
  goToMenu(categoryId?: string) {
    if (categoryId) {
      this.router.navigate(['/app/menu'], { queryParams: { category: categoryId } });
    } else {
      this.router.navigate(['/app/menu']);
    }
  }
}
