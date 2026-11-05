import { DestroyRef, Signal, inject, signal } from '@angular/core';
import type { StoreApi } from 'zustand/vanilla';

export function select<T, U>(store: StoreApi<T>, selector: (s: T) => U): Signal<U> {
  const sig = signal(selector(store.getState()));
  const unsub = store.subscribe(s => sig.set(selector(s)));
  inject(DestroyRef).onDestroy(unsub);
  return sig.asReadonly();
}
