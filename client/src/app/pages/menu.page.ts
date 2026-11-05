import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FoodCardComponent } from '../components/food-card.component';
import { IconComponent } from '../components/icon.component';
import { Food } from '../core/models';
import { select } from '../core/store-signal';
import { catalogStore } from '../store/catalog.store';

const CURATED_MENU_ITEMS: Food[] = [
  // Appetizers & Starters requested
  {
    _id: 'starter-chicken-roast',
    name: 'Chicken Roast',
    description: 'Crispy golden oven-roasted chicken glazed with roasted spices, garlic, fresh herbs, and a subtle lemon zest.',
    price: 320,
    image: '/food-chicken-roast.jpg',
    category: 'starters',
  },
  {
    _id: 'starter-white-sauce-pasta',
    name: 'Chicken White Sauce Pasta',
    description: 'Al dente penne pasta bathed in rich velvety garlic white sauce with tender grilled chicken slices and grated parmesan.',
    price: 350,
    image: '/food-white-sauce-pasta.jpg',
    category: 'starters',
  },
  {
    _id: 'starter-chicken-corn-momos',
    name: "Momo's Chicken Corn",
    description: 'Steamed Himalayan dumplings packed with juicy minced chicken, sweet golden corn, and herbs, served with spicy chili-sesame dip.',
    price: 240,
    image: '/food-chicken-corn-momos.jpg',
    category: 'starters',
  },

  // Desserts requested
  {
    _id: 'dessert-black-forest-cake',
    name: 'Black Forest Cake',
    description: 'Classic layered chocolate sponge infused with rich cherry compote, fresh chantilly cream, and dark chocolate curls.',
    price: 220,
    image: '/food-black-forest-cake.jpg',
    category: 'desserts',
  },
  {
    _id: 'dessert-red-velvet-cake',
    name: 'Red Velvet Cake',
    description: 'Silky crimson cocoa sponge layered with luscious Madagascar vanilla cream cheese frosting and fine velvet crumb dust.',
    price: 240,
    image: '/food-red-velvet-cake.jpg',
    category: 'desserts',
  },

  // Beverages requested
  {
    _id: 'beverage-lime-lemon-mojito',
    name: 'Lime Lemon Mojito',
    description: 'Refreshing muddled fresh mint, zesty lime wedges, sparkling soda, and crushed ice with a touch of raw cane sweetness.',
    price: 160,
    image: '/food-lime-lemon-mojito.jpg',
    category: 'beverages',
  },
  {
    _id: 'beverage-mix-fruit-kiwi',
    name: 'Mix Fruit Juice with Smashed Kiwi',
    description: 'Freshly cold-pressed tropical fruits layered over freshly smashed ripe kiwi pulp and crushed ice for a zesty, vitamin-rich booster.',
    price: 190,
    image: '/food-mix-fruit-kiwi.jpg',
    category: 'beverages',
  },
];

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [FormsModule, FoodCardComponent, IconComponent],
  template: `
    <main class="mx-auto max-w-6xl px-6 py-8 pb-36">
      <button class="btn-ghost" (click)="back()">
        <app-icon name="back" [size]="16" />Back to home
      </button>

      <header class="mt-8 mb-10">
        <p class="text-sm font-semibold uppercase tracking-wider text-saffron">Culinary Collection</p>
        <h1 class="font-display text-4xl sm:text-5xl text-white mt-1">Our Full Menu</h1>
        <p class="mt-2 text-neutral-400 max-w-xl text-base">
          Every dish is prepared fresh using traditional recipes, fragrant spices, and farm-fresh ingredients.
        </p>

        <!-- Search bar -->
        <div class="mt-6 max-w-md relative">
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search dishes or ingredients..."
            class="field !pl-4"
          />
        </div>

        <!-- Filter tabs -->
        <div class="mt-6 flex flex-wrap gap-2">
          @for (cat of categories; track cat.id) {
            <button
              type="button"
              (click)="selectCategory(cat.id)"
              class="rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
              [class]="selectedCategory() === cat.id
                ? 'bg-saffron text-ink-950 shadow-md font-semibold'
                : 'bg-ink-800 text-neutral-300 border border-ink-700 hover:border-saffron hover:text-white'">
              {{ cat.label }}
            </button>
          }
        </div>
      </header>

      <!-- Category Spotlight (when "all" is selected) -->
      @if (selectedCategory() === 'all' && !searchQuery()) {
        <section class="mb-14">
          <h2 class="font-display text-2xl text-white mb-6">Menu Courses</h2>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            @for (cat of courseCards; track cat.id) {
              <div
                (click)="selectCategory(cat.id)"
                class="card overflow-hidden group cursor-pointer h-full flex flex-col justify-between transition-all duration-300 hover:border-saffron/60 hover:-translate-y-1 shadow-lg">
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
                    <h3 class="font-display text-lg text-white group-hover:text-saffron transition-colors">{{ cat.title }}</h3>
                    <p class="mt-1 text-xs text-neutral-400 leading-relaxed">{{ cat.description }}</p>
                  </div>
                  <span class="mt-3 text-xs font-medium text-saffron flex items-center gap-1">
                    Select category &rarr;
                  </span>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Dishes Grid -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-display text-2xl text-white">
            {{ currentCategoryLabel() }}
            <span class="text-sm font-sans font-normal text-neutral-400 ml-2">({{ filteredFoods().length }} items)</span>
          </h2>
          @if (selectedCategory() !== 'all') {
            <button class="btn-ghost !px-3 !py-1.5 text-xs" (click)="selectCategory('all')">
              Show all dishes
            </button>
          }
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          @for (f of filteredFoods(); track f._id) {
            <app-food-card [food]="f" />
          }
        </div>

        @if (!filteredFoods().length && !loading()) {
          <div class="card p-12 text-center mt-6">
            <p class="text-neutral-400 text-base">No dishes found matching your selection.</p>
            <button class="btn-ghost mt-4 !px-4 !py-2 text-xs" (click)="selectCategory('all'); searchQuery.set('')">
              Reset filters
            </button>
          </div>
        }

        @if (error()) {
          <p class="mt-6 text-rose-400">{{ error() }}</p>
        }
      </section>
    </main>
  `,
})
export class MenuPage implements OnInit {
  foods = select(catalogStore, s => s.foods);
  loading = select(catalogStore, s => s.loading);
  error = select(catalogStore, s => s.error);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');

  categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'starters', label: 'Appetizers & Starters' },
    { id: 'main', label: 'Main Course' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Beverages' },
  ];

  courseCards = [
    {
      id: 'starters',
      tag: '01',
      title: 'Appetizers & Starters',
      description: 'Chicken Roast, White Sauce Pasta, Momos & more.',
      image: '/menu-starters.jpg',
    },
    {
      id: 'main',
      tag: '02',
      title: 'Main Course',
      description: 'Signature grills, slow-cooked curries & chef specials.',
      image: '/menu-main.jpg',
    },
    {
      id: 'desserts',
      tag: '03',
      title: 'Desserts',
      description: 'Black Forest Cake, Red Velvet Cake & sweet delights.',
      image: '/menu-dessert.jpg',
    },
    {
      id: 'beverages',
      tag: '04',
      title: 'Beverages',
      description: 'Lime Lemon Mojito, Kiwi Fruit Juice & refreshers.',
      image: '/menu-beverages.jpg',
    },
  ];

  currentCategoryLabel = computed(() => {
    const cat = this.categories.find(c => c.id === this.selectedCategory());
    return cat ? cat.label : 'All Dishes';
  });

  allMenuFoods = computed<Food[]>(() => {
    const apiFoods = this.foods().map(f => ({
      ...f,
      category: f.category || 'main',
    }));

    const existingNames = new Set(apiFoods.map(f => f.name.toLowerCase()));
    const curated = CURATED_MENU_ITEMS.filter(d => !existingNames.has(d.name.toLowerCase()));

    return [...apiFoods, ...curated];
  });

  filteredFoods = computed(() => {
    let list = this.allMenuFoods();

    const cat = this.selectedCategory();
    if (cat && cat !== 'all') {
      list = list.filter(f => f.category === cat);
    }

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
      );
    }
    return list;
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    catalogStore.getState().fetchFoods();
    this.route.queryParams.subscribe(params => {
      const cat = params['category'];
      if (cat && this.categories.some(c => c.id === cat)) {
        this.selectedCategory.set(cat);
      }
    });
  }

  selectCategory(id: string) {
    this.selectedCategory.set(id);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: id === 'all' ? {} : { category: id },
      queryParamsHandling: 'merge',
    });
  }

  back() {
    this.router.navigate(['/app']);
  }

  goBook() {
    this.router.navigate(['/app/tables']);
  }
}


