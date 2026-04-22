import { Elysia } from 'elysia';
import { authPlugin } from './authGuard';

// Fungsi pabrik untuk menghasilkan guard berdasarkan peran yang diizinkan
export const roleGuard = (allowedRoles: string[]) => {
  return new Elysia()
    .use(authPlugin)
    .onBeforeHandle(({ user, set }: any) => {
      if (!allowedRoles.includes(user.peran)) {
        set.status = 403;
        throw new Error('Anda tidak memiliki akses untuk melakukan tindakan ini');
      }
    });
};
