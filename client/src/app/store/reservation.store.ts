import { createStore } from 'zustand/vanilla';
import { api, errMsg } from '../core/api';
import { RestaurantReservation, UserReservation } from '../core/models';
import { catalogStore } from './catalog.store';

interface ReservationState {
  mine: UserReservation[];
  forRestaurant: RestaurantReservation[];
  drawerOpen: boolean;
  busy: boolean;
  error: string | null;
  setDrawer: (open: boolean) => void;
  fetchMine: () => Promise<void>;
  fetchForRestaurant: () => Promise<void>;
  book: (d: { tableId: string; restaurantId: string; date: string; time: string }) => Promise<boolean>;
  cancel: (id: string) => Promise<void>;
}

export const reservationStore = createStore<ReservationState>()((set, get) => ({
  mine: [],
  forRestaurant: [],
  drawerOpen: false,
  busy: false,
  error: null,

  setDrawer: open => set({ drawerOpen: open }),

  fetchMine: async () => {
    try { set({ mine: await api<UserReservation[]>('/reservation/user') }); }
    catch (e) { set({ error: errMsg(e) }); }
  },

  fetchForRestaurant: async () => {
    try { set({ forRestaurant: await api<RestaurantReservation[]>('/reservation/restaurant') }); }
    catch (e) { set({ error: errMsg(e) }); }
  },

  book: async body => {
    set({ busy: true, error: null });
    try {
      await api('/reservation/create', { method: 'POST', body });
      await Promise.all([get().fetchMine(), catalogStore.getState().fetchTables()]);
      set({ busy: false });
      return true;
    } catch (e) {
      set({ busy: false, error: errMsg(e) });
      return false;
    }
  },

  cancel: async id => {
    set({ busy: true, error: null });
    try {
      await api(`/reservation/delete/${id}`, { method: 'DELETE' });
      await Promise.all([get().fetchMine(), catalogStore.getState().fetchTables()]);
    } catch (e) {
      set({ error: errMsg(e) });
    }
    set({ busy: false });
  },
}));
