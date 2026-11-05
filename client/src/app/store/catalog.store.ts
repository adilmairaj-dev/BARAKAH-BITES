import { createStore } from 'zustand/vanilla';
import { api, errMsg } from '../core/api';
import { Food, Restaurant, Table } from '../core/models';

interface CatalogState {
  restaurant: Restaurant | null;
  foods: Food[];
  tables: Table[];
  loading: boolean;
  error: string | null;
  fetchHome: () => Promise<void>;
  fetchTables: () => Promise<void>;
  fetchFoods: () => Promise<void>;
}

export const catalogStore = createStore<CatalogState>()(set => ({
  restaurant: null,
  foods: [],
  tables: [],
  loading: false,
  error: null,

  fetchHome: async () => {
    set({ loading: true, error: null });
    try {
      const [restaurant, foods] = await Promise.all([
        api<Restaurant>('/restaurant/info'),
        api<Food[]>('/food/all'),
      ]);
      set({ restaurant, foods, loading: false });
    } catch (e) {
      set({ loading: false, error: errMsg(e) });
    }
  },

  fetchTables: async () => {
    set({ loading: true, error: null });
    try {
      set({ tables: await api<Table[]>('/table/all'), loading: false });
    } catch (e) {
      set({ loading: false, error: errMsg(e) });
    }
  },

  fetchFoods: async () => {
    try { set({ foods: await api<Food[]>('/food/all') }); }
    catch (e) { set({ error: errMsg(e) }); }
  },
}));
