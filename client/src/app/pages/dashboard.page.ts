import { Component, OnInit, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAction, AdminDockComponent } from '../components/admin-dock.component';
import { FoodModalComponent } from '../components/food-modal.component';
import { FoodEditModalComponent } from '../components/food-edit-modal.component';
import { IconComponent } from '../components/icon.component';
import { ProfileModalComponent } from '../components/profile-modal.component';
import { TableModalComponent } from '../components/table-modal.component';
import { Table, RestaurantReservation, Food, CustomerOrder, OrderStatus } from '../core/models';
import { select } from '../core/store-signal';
import { adminStore } from '../store/admin.store';
import { authStore } from '../store/auth.store';
import { catalogStore } from '../store/catalog.store';
import { reservationStore } from '../store/reservation.store';

interface Row { table: Table; booking?: RestaurantReservation }

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    FormsModule,
    IconComponent,
    AdminDockComponent,
    ProfileModalComponent,
    FoodModalComponent,
    FoodEditModalComponent,
    TableModalComponent,
  ],
  template: `
    <main class="mx-auto max-w-5xl px-6 py-8 pb-32">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="font-display text-3xl text-white">{{ account()?.name || "Barakah Bite's" }} dashboard</h1>
          <p class="text-sm text-neutral-400">Live view of your tables.</p>
        </div>
        <button class="btn-ghost" (click)="logout()"><app-icon name="logout" [size]="16" />Log out</button>
      </header>

      @if (adminError()) { <p class="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-400">{{ adminError() }}</p> }

      <section class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-ink-800 p-3 text-neutral-300"><app-icon name="table" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ total() }}</p><p class="text-sm text-neutral-400">Total tables</p></div>
        </div>
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-rose-500/15 p-3 text-rose-400"><app-icon name="lock" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ booked() }}</p><p class="text-sm text-neutral-400">Booked</p></div>
        </div>
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-emerald-500/15 p-3 text-emerald-400"><app-icon name="check" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ free() }}</p><p class="text-sm text-neutral-400">Not booked</p></div>
        </div>
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-saffron/15 p-3 text-saffron"><app-icon name="cart" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ activeOrdersCount() }}</p><p class="text-sm text-neutral-400">Active Orders</p></div>
        </div>
      </section>

      <div class="card mt-4 p-5">
        <div class="mb-2 flex justify-between text-sm text-neutral-400">
          <span>Occupancy</span><span class="text-white">{{ occupancy() }}%</span>
        </div>
        <div class="h-2.5 overflow-hidden rounded-full bg-ink-800">
          <div class="h-full rounded-full bg-saffron transition-all duration-700" [style.width.%]="occupancy()"></div>
        </div>
      </div>

      <!-- Customer Orders Section -->
      <section class="mt-12">
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-display text-white">Customer Orders</h2>
              @if (activeOrdersCount() > 0) {
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-saffron/20 text-saffron border border-saffron/30 animate-pulse">
                  {{ activeOrdersCount() }} Active
                </span>
              }
            </div>
            <p class="text-xs text-neutral-400">Live food orders placed by customers for takeout & delivery.</p>
          </div>

          <!-- Order Status Filter Tabs -->
          <div class="flex flex-wrap items-center gap-1.5">
            @for (st of orderFilterTabs; track st.id) {
              <button
                type="button"
                (click)="selectedOrderFilter.set(st.id)"
                class="px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
                [class]="selectedOrderFilter() === st.id
                  ? 'bg-saffron text-ink-950 font-semibold shadow-sm'
                  : 'bg-ink-800 text-neutral-300 hover:bg-ink-700 border border-ink-700'">
                {{ st.label }} ({{ orderStatusCount(st.id) }})
              </button>
            }
            <button
              type="button"
              (click)="refreshOrders()"
              title="Refresh orders"
              class="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-ink-800 hover:bg-ink-700 border border-ink-700 text-neutral-300 transition cursor-pointer flex items-center gap-1">
              <app-icon name="clock" [size]="14" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div class="space-y-4">
          @for (o of filteredOrders(); track o._id || o.orderId) {
            <div class="card p-5 border transition hover:border-ink-600"
                 [class.border-saffron/40]="o.status === 'placed'"
                 [class.border-orange-500/40]="o.status === 'preparing'"
                 [class.border-ink-700]="o.status === 'delivered' || o.status === 'cancelled'">
              <!-- Order Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ink-800">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="font-display text-lg text-white font-semibold">#{{ o.orderId }}</span>
                  <span class="text-xs text-neutral-400 flex items-center gap-1">
                    <app-icon name="clock" [size]="13" />
                    {{ o.createdAt | date:'d MMM y, h:mm a' }}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize" [class]="orderBadge(o.status).class">
                    {{ orderBadge(o.status).label }}
                  </span>
                </div>

                <!-- Status Select Changer & Delete -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-neutral-400">Update status:</span>
                  <select
                    class="rounded-xl bg-ink-800 text-xs font-medium text-white border border-ink-700 px-3 py-1.5 cursor-pointer focus:border-saffron focus:outline-none"
                    [ngModel]="o.status"
                    (ngModelChange)="updateOrderStatus(o._id, $event)">
                    <option value="placed" class="bg-ink-900 text-white">🟡 Placed (New)</option>
                    <option value="preparing" class="bg-ink-900 text-white">🟠 Preparing in Kitchen</option>
                    <option value="out_for_delivery" class="bg-ink-900 text-white">🔵 Out for Delivery</option>
                    <option value="delivered" class="bg-ink-900 text-white">🟢 Delivered</option>
                    <option value="cancelled" class="bg-ink-900 text-rose-400">🔴 Cancelled</option>
                  </select>
                  <button
                    type="button"
                    title="Delete order"
                    [disabled]="busy()"
                    (click)="removeOrder(o._id, o.orderId)"
                    class="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer">
                    <app-icon name="trash" [size]="16" />
                  </button>
                </div>
              </div>

              <!-- Customer info & Ordered items grid -->
              <div class="mt-4 grid sm:grid-cols-2 gap-4">
                <!-- Customer Details -->
                <div class="space-y-1.5 text-sm">
                  <p class="text-neutral-400 text-xs uppercase tracking-wider font-semibold">Customer Details</p>
                  <p class="text-white font-medium flex items-center gap-2">
                    <app-icon name="user" [size]="15" class="text-neutral-400" />
                    {{ o.customerName }}
                  </p>
                  <p class="text-neutral-300 flex items-center gap-2">
                    <app-icon name="phone" [size]="15" class="text-neutral-400" />
                    <a [href]="'tel:' + o.phone" class="hover:text-saffron transition">{{ o.phone }}</a>
                  </p>
                  <p class="text-neutral-400 text-xs flex items-start gap-2 pt-0.5">
                    <app-icon name="pin" [size]="15" class="text-neutral-400 shrink-0 mt-0.5" />
                    <span>{{ o.address }}</span>
                  </p>
                  @if (o.specialInstructions) {
                    <div class="mt-2 p-2.5 rounded-lg bg-ink-800/80 border border-ink-700/60 text-xs text-amber-200/90">
                      <span class="font-semibold text-amber-400">Note:</span> {{ o.specialInstructions }}
                    </div>
                  }
                </div>

                <!-- Items ordered -->
                <div class="space-y-2">
                  <p class="text-neutral-400 text-xs uppercase tracking-wider font-semibold">Dishes Ordered</p>
                  <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    @for (item of o.items; track item.name) {
                      <div class="flex items-center justify-between text-xs py-1 border-b border-ink-800/80">
                        <div class="flex items-center gap-2 min-w-0">
                          @if (item.image) {
                            <img [src]="item.image" [alt]="item.name" class="h-7 w-7 rounded object-cover shrink-0" />
                          }
                          <span class="text-neutral-200 truncate">{{ item.name }}</span>
                          <span class="text-neutral-400 font-medium">×{{ item.quantity }}</span>
                        </div>
                        <span class="text-neutral-300 font-semibold shrink-0 ml-2">
                          {{ (item.price * item.quantity) | currency:'INR':'symbol':'1.0-0' }}
                        </span>
                      </div>
                    }
                  </div>
                  <div class="pt-2 flex justify-between items-center text-sm font-semibold border-t border-ink-700">
                    <span class="text-white">Total Amount</span>
                    <span class="text-saffron text-base font-bold">{{ o.totalAmount | currency:'INR':'symbol':'1.0-0' }}</span>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="rounded-2xl border border-dashed border-ink-700 p-8 text-center">
              <div class="h-12 w-12 mx-auto rounded-full bg-ink-800 text-neutral-400 flex items-center justify-center mb-3">
                <app-icon name="cart" [size]="20" />
              </div>
              <p class="text-neutral-400 text-sm">No orders found in this filter.</p>
              <p class="text-neutral-500 text-xs mt-1">When customers place food orders from the menu, orders will appear here in real time.</p>
            </div>
          }
        </div>
      </section>

      <h2 class="mt-10 mb-4 text-lg text-white">Table details</h2>
      <div class="space-y-3">
        @for (row of rows(); track row.table._id) {
          <div class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
               [class.border-rose-500/40]="row.table.status === 'reserved'">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-800 font-display text-xl text-white">{{ row.table.tableNumber }}</div>
              <div class="text-sm text-neutral-400">
                <p class="flex items-center gap-1.5"><app-icon name="users" [size]="14" />{{ row.table.capacity }} seats</p>
                <p class="flex items-center gap-1.5"><app-icon name="layers" [size]="14" />Floor {{ row.table.floor }}</p>
              </div>
            </div>

            @if (row.booking; as b) {
              <div class="text-sm sm:text-right">
                <p class="text-white">{{ b.user.name }}</p>
                <p class="text-neutral-400">{{ b.user.email }}</p>
                <p class="mt-1 text-neutral-300">{{ b.date | date:'d MMM y' }} · {{ b.time }}</p>
              </div>
            }

            <div class="flex items-center gap-3 self-start sm:self-center">
              <span class="rounded-full px-3 py-1 text-xs font-medium"
                    [class]="row.table.status === 'reserved' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'">
                {{ row.table.status === 'reserved' ? 'Booked' : 'Not booked' }}
              </span>
              <button class="rounded-lg p-2 text-neutral-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                      aria-label="Delete table" [disabled]="busy()" (click)="removeTable(row.table)">
                <app-icon name="trash" [size]="18" />
              </button>
            </div>
          </div>
        } @empty {
          <p class="text-neutral-400">No tables yet. Use "Add table" below to create your first one.</p>
        }
      </div>

      <div class="mt-12 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-xl font-display text-white">Menu & Dishes</h2>
          <p class="text-xs text-neutral-400">Manage your menu catalog categorized by courses.</p>
        </div>

        <!-- Category filter tabs -->
        <div class="flex flex-wrap gap-1.5">
          @for (c of menuCategories; track c.id) {
            <button
              type="button"
              (click)="selectedMenuCategory.set(c.id)"
              class="px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              [class]="selectedMenuCategory() === c.id
                ? 'bg-saffron text-ink-950 font-semibold shadow-sm'
                : 'bg-ink-800 text-neutral-300 hover:bg-ink-700 border border-ink-700'">
              {{ c.label }} ({{ categoryCount(c.id) }})
            </button>
          }
        </div>
      </div>

      <div class="space-y-3">
        @for (f of filteredFoods(); track f._id) {
          <div class="card flex items-center gap-4 p-3">
            <img [src]="f.image" [alt]="f.name" class="h-16 w-16 rounded-xl object-cover shrink-0" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="truncate text-white font-medium">{{ f.name }}</p>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-medium" [class]="categoryBadge(f.category).class">
                  {{ categoryBadge(f.category).label }}
                </span>
              </div>
              <p class="truncate text-sm text-neutral-400 mt-0.5">{{ f.description }}</p>
            </div>
            <span class="text-sm font-semibold text-saffron shrink-0">{{ f.price | currency:'INR':'symbol':'1.0-0' }}</span>
            <div class="flex items-center gap-1 shrink-0">
              <button class="rounded-lg p-2 text-neutral-400 transition hover:bg-saffron/15 hover:text-saffron"
                      aria-label="Edit dish" title="Edit dish or price" [disabled]="busy()" (click)="editingFood.set(f)">
                <app-icon name="edit" [size]="18" />
              </button>
              <button class="rounded-lg p-2 text-neutral-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                      aria-label="Delete dish" title="Delete dish" [disabled]="busy()" (click)="removeFood(f._id, f.name)">
                <app-icon name="trash" [size]="18" />
              </button>
            </div>
          </div>
        } @empty {
          <div class="rounded-2xl border border-dashed border-ink-700 p-8 text-center">
            <p class="text-neutral-400 text-sm">No dishes found in this category.</p>
            <p class="text-neutral-500 text-xs mt-1">Click "Add food" below to add a dish to this category.</p>
          </div>
        }
      </div>
    </main>

    <app-admin-dock (pick)="modal.set($event)" />

    @switch (modal()) {
      @case ('profile') { <app-profile-modal (close)="modal.set(null)" /> }
      @case ('food') { <app-food-modal (close)="modal.set(null)" /> }
      @case ('table') { <app-table-modal (close)="modal.set(null)" /> }
    }

    @if (editingFood(); as ef) {
      <app-food-edit-modal [food]="ef" (close)="editingFood.set(null)" />
    }`,
})
export class DashboardPage implements OnInit {
  account = select(authStore, s => s.account);
  tables = select(catalogStore, s => s.tables);
  foods = select(catalogStore, s => s.foods);
  bookings = select(reservationStore, s => s.forRestaurant);
  orders = select(adminStore, s => s.orders);
  busy = select(adminStore, s => s.busy);
  adminError = select(adminStore, s => s.error);
  modal = signal<AdminAction | null>(null);
  editingFood = signal<Food | null>(null);
  selectedMenuCategory = signal<string>('all');
  selectedOrderFilter = signal<string>('all');

  readonly orderFilterTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'placed', label: 'New' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
  ] as const;

  readonly menuCategories = [
    { id: 'all', label: 'All' },
    { id: 'starters', label: 'Starters' },
    { id: 'main', label: 'Main Course' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Beverages' },
  ] as const;

  total = computed(() => this.tables().length);
  booked = computed(() => this.tables().filter(t => t.status === 'reserved').length);
  free = computed(() => this.total() - this.booked());
  occupancy = computed(() => (this.total() ? Math.round((this.booked() / this.total()) * 100) : 0));
  activeOrdersCount = computed(() => this.orders().filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length);

  orderStatusCount(filterId: string): number {
    if (filterId === 'all') return this.orders().length;
    return this.orders().filter(o => o.status === filterId).length;
  }

  filteredOrders = computed(() => {
    const list = this.orders();
    const filter = this.selectedOrderFilter();
    if (filter === 'all') return list;
    return list.filter(o => o.status === filter);
  });

  orderBadge(status: OrderStatus | string) {
    switch (status) {
      case 'placed':
        return { label: 'New Order', class: 'bg-amber-500/15 text-amber-300 border border-amber-500/30' };
      case 'preparing':
        return { label: 'In Kitchen', class: 'bg-orange-500/15 text-orange-300 border border-orange-500/30' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', class: 'bg-sky-500/15 text-sky-300 border border-sky-500/30' };
      case 'delivered':
        return { label: 'Delivered', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' };
      case 'cancelled':
      default:
        return { label: 'Cancelled', class: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' };
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    await adminStore.getState().updateOrderStatus(id, status);
  }

  refreshOrders() {
    adminStore.getState().fetchOrders();
  }

  async removeOrder(id: string, orderId: string) {
    if (confirm(`Delete order #${orderId}? This cannot be undone.`)) {
      await adminStore.getState().deleteOrder(id);
    }
  }

  filteredFoods = computed(() => {
    const list = this.foods();
    const cat = this.selectedMenuCategory();
    if (cat === 'all') return list;
    return list.filter(f => (f.category || 'main') === cat);
  });

  categoryCount(catId: string): number {
    if (catId === 'all') return this.foods().length;
    return this.foods().filter(f => (f.category || 'main') === catId).length;
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

  rows = computed<Row[]>(() => {
    const byTable = new Map<string, RestaurantReservation>();
    this.bookings().filter(b => b.status !== 'cancelled').forEach(b => byTable.set(b.table._id, b));
    return this.tables()
      .map(table => ({ table, booking: byTable.get(table._id) }))
      .sort((a, b) => Number(b.table.status === 'reserved') - Number(a.table.status === 'reserved') || a.table.tableNumber - b.table.tableNumber);
  });

  constructor(private router: Router) {}

  ngOnInit() {
    catalogStore.getState().fetchTables();
    catalogStore.getState().fetchFoods();
    reservationStore.getState().fetchForRestaurant();
    adminStore.getState().fetchOrders();
  }

  removeTable(t: Table) {
    if (confirm(`Delete table ${t.tableNumber}? This can't be undone.`))
      adminStore.getState().deleteTable(t._id);
  }
  removeFood(id: string, name: string) {
    if (confirm(`Delete "${name}" from the menu?`)) adminStore.getState().deleteFood(id);
  }

  async logout() {
    await authStore.getState().logout();
    this.router.navigate(['/restaurant/login']);
  }
}
