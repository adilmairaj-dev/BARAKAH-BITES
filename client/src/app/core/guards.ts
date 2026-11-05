import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, authStore } from '../store/auth.store';

export const roleGuard = (role: Exclude<Role, null>): CanActivateFn => () => {
  const router = inject(Router);
  return (async () => {
    await authStore.getState().init();
    const s = authStore.getState();
    if (s.role === role && s.account) return true;
    return router.createUrlTree([role === 'user' ? '/login' : '/restaurant/login']);
  })();
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  return (async () => {
    await authStore.getState().init();
    const { role, account } = authStore.getState();
    if (!account) return true;
    return router.createUrlTree([role === 'restaurant' ? '/restaurant/dashboard' : '/app']);
  })();
};
