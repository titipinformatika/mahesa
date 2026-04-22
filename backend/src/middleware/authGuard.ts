import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

// Secret key untuk JWT (Idealnya ditaruh di .env)
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_mahesa_123';

export const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
    })
  )
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers['authorization'];
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Token otentikasi tidak ditemukan atau tidak valid');
    }

    const token = authorization.slice(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      throw new Error('Sesi telah berakhir atau token tidak valid');
    }

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
