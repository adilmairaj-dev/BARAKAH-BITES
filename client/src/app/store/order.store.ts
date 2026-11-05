import { createStore } from 'zustand/vanilla';
import { Food } from '../core/models';
import { api } from '../core/api';

export interface OrderItem {
  food: Food;
  quantity: number;
}

export interface PlacedOrder {
  _id?: string;
  orderId: string;
  items: OrderItem[];
  customerName: string;
  phone: string;
  address: string;
  specialInstructions?: string;
  totalAmount: number;
  createdAt: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
}

interface OrderState {
  items: OrderItem[];
  lastOrder: PlacedOrder | null;
  addItem: (food: Food) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (details: {
    customerName: string;
    phone: string;
    address: string;
    specialInstructions?: string;
  }) => Promise<PlacedOrder>;
}

const STORAGE_KEY = 'barakah_bites_cart';

const loadSavedItems = (): OrderItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveItems = (items: OrderItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

export const orderStore = createStore<OrderState>()((set, get) => ({
  items: loadSavedItems(),
  lastOrder: null,

  addItem: (food: Food) => {
    const items = [...get().items];
    const idx = items.findIndex(i => i.food._id === food._id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
    } else {
      items.push({ food, quantity: 1 });
    }
    saveItems(items);
    set({ items });
  },

  removeItem: (foodId: string) => {
    const items = get().items.filter(i => i.food._id !== foodId);
    saveItems(items);
    set({ items });
  },

  updateQuantity: (foodId: string, quantity: number) => {
    let items = [...get().items];
    if (quantity <= 0) {
      items = items.filter(i => i.food._id !== foodId);
    } else {
      items = items.map(i => i.food._id === foodId ? { ...i, quantity } : i);
    }
    saveItems(items);
    set({ items });
  },

  clearCart: () => {
    saveItems([]);
    set({ items: [] });
  },

  placeOrder: async details => {
    const items = [...get().items];
    const totalAmount = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    const fallbackOrderId = 'BB-' + Math.floor(100000 + Math.random() * 900000);

    let order: PlacedOrder = {
      orderId: fallbackOrderId,
      items,
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      specialInstructions: details.specialInstructions,
      totalAmount,
      createdAt: new Date().toISOString(),
      status: 'placed',
    };

    try {
      const payload = {
        customerName: details.customerName,
        phone: details.phone,
        address: details.address,
        specialInstructions: details.specialInstructions,
        items: items.map(i => ({
          food: i.food._id,
          name: i.food.name,
          price: i.food.price,
          quantity: i.quantity,
          image: i.food.image,
        })),
        totalAmount,
      };
      const saved = await api<any>('/order/create', { method: 'POST', body: payload });
      if (saved && saved.orderId) {
        order = {
          _id: saved._id,
          orderId: saved.orderId,
          items,
          customerName: saved.customerName,
          phone: saved.phone,
          address: saved.address,
          specialInstructions: saved.specialInstructions,
          totalAmount: saved.totalAmount,
          createdAt: saved.createdAt,
          status: saved.status,
        };
      }
    } catch (e) {
      console.warn('Backend order sync failed, using local order:', e);
    }

    saveItems([]);
    set({ items: [], lastOrder: order });
    return order;
  },
}));

