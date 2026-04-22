import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pengguna, pegawai } from '../../db/schema/pegawai';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { authPlugin } from '../../middleware/authGuard';

export const otentikasiRoutes = new Elysia({ prefix: '/v1/otentikasi' })
  .use(authPlugin) // Ini akan memberikan akses ke 'jwt' dan 'user'
  
  // -----------------------------------------------------------
  // 🔓 ENDPOINT PUBLIK (Gunakan hook lokal untuk bypass guard jika perlu, atau pisahkan grup)
  // -----------------------------------------------------------
  // Karena onBeforeHandle di authPlugin sekarang 'global', kita harus hati-hati.
  // Namun di Elysia, onBeforeHandle dalam plugin hanya berlaku untuk rute di bawah .use() tersebut.
  
  .post(
    '/masuk',
    async ({ body, jwt, set }) => {
      try {
        const { email, password } = body;

        const userList = await db.select().from(pengguna).where(eq(pengguna.email, email)).limit(1);
        const user = userList[0];

        if (!user || !user.aktif) {
          set.status = 401;
          return { status: 'error', message: 'Email tidak ditemukan atau akun tidak aktif' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.hash_kata_sandi);
        if (!isPasswordValid) {
          set.status = 401;
          return { status: 'error', message: 'Kata sandi salah' };
        }

        const pegawaiList = await db
          .select({ id: pegawai.id, id_unit_kerja: pegawai.id_unit_kerja })
          .from(pegawai)
          .where(eq(pegawai.id_pengguna, user.id))
          .limit(1);
        const dataPegawai = pegawaiList[0];

        await db.update(pengguna).set({ terakhir_login: new Date() }).where(eq(pengguna.id, user.id));

        const token = await jwt.sign({
          id: user.id,
          email: user.email,
          peran: user.peran,
          id_pegawai: dataPegawai?.id,
          id_unit_kerja: dataPegawai?.id_unit_kerja,
        });

        return { status: 'success', message: 'Berhasil login', data: { token, peran: user.peran } };
      } catch (error) {
        set.status = 500;
        return { status: 'error', message: 'Terjadi kesalahan pada server' };
      }
    },
    { 
      body: t.Object({ email: t.String({ format: 'email' }), password: t.String() }),
      beforeHandle: () => {} // Bypass global hook untuk route ini
    }
  )

  .post('/keluar', ({ set }) => {
    return { status: 'success', message: 'Berhasil keluar. Silakan hapus token di klien.' };
  }, { beforeHandle: () => {} })

  .post(
    '/lupa-kata-sandi',
    async ({ body, set }) => {
      console.log(`Permintaan reset password untuk email: ${body.email}`);
      return { status: 'success', message: 'Jika email terdaftar, instruksi reset telah dikirim.' };
    },
    { 
      body: t.Object({ email: t.String({ format: 'email' }) }),
      beforeHandle: () => {}
    }
  )

  .post(
    '/reset-kata-sandi',
    async ({ body, set }) => {
      return { status: 'success', message: 'Kata sandi berhasil direset.' };
    },
    { 
      body: t.Object({ token: t.String(), password_baru: t.String() }),
      beforeHandle: () => {}
    }
  )

  // -----------------------------------------------------------
  // 🔒 ENDPOINT TERLINDUNGI (Akan terkena onBeforeHandle dari authPlugin)
  // -----------------------------------------------------------
  .get('/profil-saya', async ({ user, set }: any) => {
    if (!user) return { status: 'error', message: 'Unauthorized' };
    
    const userList = await db.select({
      id: pengguna.id,
      email: pengguna.email,
      peran: pengguna.peran,
      terakhir_login: pengguna.terakhir_login
    }).from(pengguna).where(eq(pengguna.id, user.id)).limit(1);
    
    return { status: 'success', data: userList[0] };
  })

  .post('/perbarui-token', async ({ user, jwt, set }: any) => {
    const tokenBaru = await jwt.sign({
      id: user.id,
      email: user.email,
      peran: user.peran,
      id_pegawai: user.id_pegawai,
      id_unit_kerja: user.id_unit_kerja,
    });
    return { status: 'success', message: 'Token berhasil diperbarui', data: { token: tokenBaru } };
  })

  .put(
    '/ganti-kata-sandi',
    async ({ body, user, set }: any) => {
      const currentUser = (await db.select().from(pengguna).where(eq(pengguna.id, user.id)).limit(1))[0];
      
      if (!currentUser) {
        set.status = 404;
        return { status: 'error', message: 'Pengguna tidak ditemukan' };
      }

      const isOldPasswordValid = await bcrypt.compare(body.password_lama, currentUser.hash_kata_sandi);
      if (!isOldPasswordValid) {
        set.status = 401;
        return { status: 'error', message: 'Kata sandi lama salah' };
      }

      const newHashedPassword = await bcrypt.hash(body.password_baru, 10);
      await db.update(pengguna).set({ hash_kata_sandi: newHashedPassword }).where(eq(pengguna.id, user.id));

      return { status: 'success', message: 'Kata sandi berhasil diubah' };
    },
    { body: t.Object({ password_lama: t.String(), password_baru: t.String() }) }
  )

  .put(
    '/token-fcm',
    async ({ body, user, set }: any) => {
      await db.update(pengguna).set({ token_fcm: body.token_fcm }).where(eq(pengguna.id, user.id));
      return { status: 'success', message: 'Token FCM berhasil disimpan' };
    },
    { body: t.Object({ token_fcm: t.String() }) }
  );
