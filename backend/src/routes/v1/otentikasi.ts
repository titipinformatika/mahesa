import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pengguna, pegawai } from '../../db/schema/pegawai';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { jwt } from '@elysiajs/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_mahesa_123';

export const otentikasiRoutes = new Elysia({ prefix: '/v1/otentikasi' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '1d', // Token berlaku 1 hari
    })
  )
  .post(
    '/masuk',
    async ({ body, jwt, set }) => {
      try {
        const { email, password } = body;

        // 1. Cari pengguna berdasarkan email
        const userList = await db
          .select()
          .from(pengguna)
          .where(eq(pengguna.email, email))
          .limit(1);

        const user = userList[0];

        if (!user || !user.aktif) {
          set.status = 401;
          return { status: 'error', message: 'Email tidak ditemukan atau akun tidak aktif' };
        }

        // 2. Verifikasi Password
        const isPasswordValid = await bcrypt.compare(password, user.hash_kata_sandi);
        if (!isPasswordValid) {
          set.status = 401;
          return { status: 'error', message: 'Kata sandi salah' };
        }

        // 3. Ambil data pegawai (jika ada) untuk mendapatkan id_unit_kerja
        const pegawaiList = await db
          .select({
            id: pegawai.id,
            id_unit_kerja: pegawai.id_unit_kerja,
          })
          .from(pegawai)
          .where(eq(pegawai.id_pengguna, user.id))
          .limit(1);

        const dataPegawai = pegawaiList[0];

        // 4. Update waktu terakhir login
        await db
          .update(pengguna)
          .set({ terakhir_login: new Date() })
          .where(eq(pengguna.id, user.id));

        // 5. Generate JWT Token
        const token = await jwt.sign({
          id: user.id,
          email: user.email,
          peran: user.peran,
          id_pegawai: dataPegawai?.id,
          id_unit_kerja: dataPegawai?.id_unit_kerja,
        });

        return {
          status: 'success',
          message: 'Berhasil login',
          data: {
            token,
            peran: user.peran,
          },
        };
      } catch (error) {
        set.status = 500;
        return { status: 'error', message: 'Terjadi kesalahan pada server' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  );
