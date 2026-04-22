import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_mahesa_123';

export const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
    })
  )
  .onBeforeHandle({ as: 'global' }, async ({ jwt, headers, set, request }) => {
    const path = new URL(request.url).pathname;
    
    // Abaikan rute publik jika diperlukan, tapi rute yang .use(authPlugin) biasanya butuh auth
    console.log(`🔒 Guard checking: ${path}`);
    
    const authorization = headers['authorization'];
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      set.status = 401;
      return { status: 'error', message: 'Token otentikasi tidak ditemukan atau tidak valid' };
    }

    const token = authorization.slice(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      return { status: 'error', message: 'Sesi telah berakhir atau token tidak valid' };
    }
  })
  .derive({ as: 'global' }, async ({ jwt, headers }) => {
    const authorization = headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return { user: null };
    }
    
    const token = authorization.slice(7);
    const payload = await jwt.verify(token);
    
    return {
      user: payload as {
        id: string;
        email: string;
        peran: string;
        id_pegawai?: string;
        id_unit_kerja?: string;
      },
    };
  });
