import { createStore } from 'zustand/vanilla';
import { api, errMsg } from '../core/api';
import { Restaurant, CustomerOrder, OrderStatus } from '../core/models';
import { authStore } from './auth.store';
import { catalogStore } from './catalog.store';

interface AdminState {
  busy: boolean;
  error: string | null;
  orders: CustomerOrder[];
  clearError: () => void;
  updateProfile: (fd: FormData) => Promise<boolean>;
  addFood: (fd: FormData) => Promise<boolean>;
  updateFood: (id: string, fd: FormData) => Promise<boolean>;
  addTable: (fd: FormData) => Promise<boolean>;
  deleteFood: (id: string) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
}

export const adminStore = createStore<AdminState>()((set, get) => {
  const run = async (fn: () => Promise<unknown>) => {
    set({ busy: true, error: null });
    try { await fn(); set({ busy: false }); return true; }
    catch (e) { set({ busy: false, error: errMsg(e) }); return false; }
  };

  return {
    busy: false,
    error: null,
    orders: [],
    clearError: () => set({ error: null }),

    updateProfile: fd => run(async () => {
      const r = await api<Restaurant>('/restaurant/addDetails', { method: 'POST', body: fd });
      authStore.getState().setAccount(r);
    }),

    addFood: fd => run(async () => {
      await api('/food/create', { method: 'POST', body: fd });
      await catalogStore.getState().fetchFoods();
    }),

    updateFood: (id, fd) => run(async () => {
      await api(`/food/update/${id}`, { method: 'PATCH', body: fd });
      await catalogStore.getState().fetchFoods();
    }),

    addTable: fd => run(async () => {
      await api('/table/create', { method: 'POST', body: fd });
      await catalogStore.getState().fetchTables();
    }),

    deleteFood: async id => {
      await run(async () => {
        await api(`/food/delete/${id}`, { method: 'DELETE' });
        await catalogStore.getState().fetchFoods();
      });
    },

    deleteTable: async id => {
      await run(async () => {
        await api(`/table/delete/${id}`, { method: 'DELETE' });
        await catalogStore.getState().fetchTables();
      });
    },

    fetchOrders: async () => {
      try {
        const orders = await api<CustomerOrder[]>('/order/restaurant');
        set({ orders: orders || [] });
      } catch (e) {
        console.warn('Failed to fetch orders:', e);
      }
    },

    updateOrderStatus: (id, status) => run(async () => {
      await api(`/order/${id}/status`, { method: 'PATCH', body: { status } });
      const orders = get().orders.map(o => (o._id === id ? { ...o, status } : o));
      set({ orders });
    }),

    deleteOrder: id => run(async () => {
      await api(`/order/${id}`, { method: 'DELETE' });
      const orders = get().orders.filter(o => o._id !== id);
      set({ orders });
    }),
  };
});
