import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { dinas, unitKerja, levelUnitKerja } from '../../db/schema/organisasi';
import { pegawai } from '../../db/schema/pegawai';
import { eq, count } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const organisasiRoutes = new Elysia({ prefix: '/v1/organisasi' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 🏢 MODUL DINAS (Hanya ada 1 record master Dinas)
  // -----------------------------------------------------------
  .get('/dinas', async ({ set }: any) => {
    try {
      const result = await db.select().from(dinas).limit(1);
      if (result.length === 0) {
        return { status: 'success', data: null, message: 'Data dinas belum disiapkan.' };
      }
      return { status: 'success', data: result[0] };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Terjadi kesalahan saat mengambil data dinas' };
    }
  })

  .put(
    '/dinas',
    async ({ body, set }: any) => {
      try {
        const dinasList = await db.select().from(dinas).limit(1);

        if (dinasList.length === 0) {
          const inserted = await db.insert(dinas).values({
            nama: body.nama,
            kode: body.kode,
            alamat: body.alamat,
            telepon: body.telepon,
            email: body.email,
            latitude: body.latitude?.toString(),
            longitude: body.longitude?.toString(),
          }).returning();
          return { status: 'success', message: 'Dinas berhasil dibuat', data: inserted[0] };
        } else {
          const masterDinas = dinasList[0];
          const updated = await db.update(dinas).set({
            nama: body.nama,
            kode: body.kode,
            alamat: body.alamat,
            telepon: body.telepon,
            email: body.email,
            latitude: body.latitude?.toString(),
            longitude: body.longitude?.toString(),
            diperbarui_pada: new Date(),
          }).where(eq(dinas.id, masterDinas.id)).returning();
          return { status: 'success', message: 'Data dinas berhasil diperbarui', data: updated[0] };
        }
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        nama: t.String(),
        kode: t.String(),
        alamat: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        email: t.Optional(t.String()),
        latitude: t.Optional(t.Number()),
        longitude: t.Optional(t.Number()),
      })
    }
  )

  // -----------------------------------------------------------
  // 🏢 MODUL LEVEL UNIT KERJA
  // -----------------------------------------------------------
  .get('/level-unit', async ({ set }: any) => {
    try {
      const data = await db.select().from(levelUnitKerja).orderBy(levelUnitKerja.level);
      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  .post(
    '/level-unit',
    async ({ body, user, set }: any) => {
      try {
        if (!['admin_dinas', 'admin_upt'].includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Hanya Admin Dinas atau Admin UPT yang dapat menambah level' };
        }

        const inserted = await db.insert(levelUnitKerja).values({
          level: body.level,
          nama: body.nama,
          keterangan: body.keterangan,
        }).returning();

        return { status: 'success', message: 'Level Unit Kerja berhasil ditambahkan', data: inserted[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        level: t.Number(),
        nama: t.String(),
        keterangan: t.Optional(t.String()),
      })
    }
  )

  .put(
    '/level-unit/:id',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        if (!['admin_dinas', 'admin_upt'].includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Hanya Admin Dinas atau Admin UPT yang dapat mengubah level' };
        }

        const updated = await db.update(levelUnitKerja).set({
          level: body.level,
          nama: body.nama,
          keterangan: body.keterangan,
        }).where(eq(levelUnitKerja.id, id)).returning();

        if (updated.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Level tidak ditemukan' };
        }

        return { status: 'success', message: 'Level Unit Kerja berhasil diperbarui', data: updated[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        level: t.Optional(t.Number()),
        nama: t.Optional(t.String()),
        keterangan: t.Optional(t.String()),
      })
    }
  )

  .delete(
    '/level-unit/:id',
    async ({ params: { id }, user, set }: any) => {
      try {
        if (!['admin_dinas', 'admin_upt'].includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Hanya Admin Dinas atau Admin UPT yang dapat menghapus level' };
        }

        // Cek penggunaan di unit_kerja
        const usage = await db.select({ total: count() }).from(unitKerja).where(eq(unitKerja.id_level_unit, id));
        if (Number(usage[0].total) > 0) {
          set.status = 400;
          return { status: 'error', message: 'Level ini sedang digunakan oleh unit kerja dan tidak dapat dihapus' };
        }

        const deleted = await db.delete(levelUnitKerja).where(eq(levelUnitKerja.id, id)).returning();
        if (deleted.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Level tidak ditemukan' };
        }

        return { status: 'success', message: 'Level Unit Kerja berhasil dihapus' };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    }
  )

  // -----------------------------------------------------------
  // 🏫 MODUL UNIT KERJA
  // -----------------------------------------------------------
  .get('/unit-kerja', async ({ user, set }: any) => {
    try {
      if (!user) {
        set.status = 401;
        return { status: 'error', message: 'Unauthorized' };
      }

      const role = user.peran;
      const myUnitId = user.id_unit_kerja;

      if (role === 'admin_dinas') {
        const data = await db.select().from(unitKerja);
        return { status: 'success', data };
      }

      if (role === 'admin_upt' && myUnitId) {
        // Ambil unit UPT itu sendiri dan semua unit di bawahnya (id_induk_unit = myUnitId)
        const { and, or, eq } = await import('drizzle-orm');
        const data = await db.select().from(unitKerja).where(
          or(
            eq(unitKerja.id, myUnitId),
            eq(unitKerja.id_induk_unit, myUnitId)
          )
        );
        return { status: 'success', data };
      }

      if (role === 'admin_unit' && myUnitId) {
        const { eq } = await import('drizzle-orm');
        const data = await db.select().from(unitKerja).where(eq(unitKerja.id, myUnitId));
        return { status: 'success', data };
      }

      return { status: 'success', data: [] };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  .get('/unit-kerja-upt', async ({ set }: any) => {
    try {
      const { eq } = await import('drizzle-orm');
      // Get level 2 ID (UPT)
      const level2 = await db.select().from(levelUnitKerja).where(eq(levelUnitKerja.level, 2)).limit(1);
      if (level2.length === 0) return { status: 'success', data: [] };
      const data = await db.select().from(unitKerja).where(eq(unitKerja.id_level_unit, level2[0].id));
      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  .get('/unit-kerja-by-induk/:id', async ({ params: { id }, set }: any) => {
    try {
      const { eq } = await import('drizzle-orm');
      const data = await db.select().from(unitKerja).where(eq(unitKerja.id_induk_unit, id));
      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  .post(
    '/unit-kerja',
    async ({ body, user, set }: any) => {
      try {
        if (user?.peran !== 'admin_dinas') {
          set.status = 403;
          return { status: 'error', message: 'Hanya Admin Dinas yang dapat menambah unit kerja' };
        }

        // Validasi level: tidak boleh menambah level 1 (Dinas)
        const checkLevel = await db.select().from(levelUnitKerja).where(eq(levelUnitKerja.id, body.id_level_unit)).limit(1);
        if (checkLevel.length === 0) {
          set.status = 400;
          return { status: 'error', message: 'Level unit tidak valid' };
        }

        if (checkLevel[0].level === 1) {
          set.status = 403;
          return { status: 'error', message: 'Unit Kerja Level 1 (Dinas) tidak dapat ditambah secara manual' };
        }

        const inserted = await db.insert(unitKerja).values({
          id_dinas: body.id_dinas,
          id_level_unit: body.id_level_unit,
          id_induk_unit: body.id_induk_unit,
          nama: body.nama,
          kode: body.kode,
          jenis: body.jenis,
          alamat: body.alamat,
          telepon: body.telepon,
          email: body.email,
          latitude: body.latitude.toString(),
          longitude: body.longitude.toString(),
          radius_absensi_meter: body.radius_absensi_meter,
        }).returning();
        return { status: 'success', message: 'Unit Kerja berhasil ditambahkan', data: inserted[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        id_dinas: t.String(),
        id_level_unit: t.String(),
        id_induk_unit: t.Optional(t.String()),
        nama: t.String(),
        kode: t.String(),
        jenis: t.String(),
        alamat: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        email: t.Optional(t.String()),
        latitude: t.Number(),
        longitude: t.Number(),
        radius_absensi_meter: t.Optional(t.Number()),
      })
    }
  )

  .put(
    '/unit-kerja/:id',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        if (user?.peran !== 'admin_dinas') {
          set.status = 403;
          return { status: 'error', message: 'Hanya Admin Dinas yang dapat mengubah unit kerja' };
        }

        const updated = await db.update(unitKerja).set({
          ...body,
          latitude: body.latitude?.toString(),
          longitude: body.longitude?.toString(),
          diperbarui_pada: new Date(),
        }).where(eq(unitKerja.id, id)).returning();

        if (updated.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Unit kerja tidak ditemukan' };
        }
        return { status: 'success', message: 'Unit Kerja diperbarui', data: updated[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        nama: t.Optional(t.String()),
        kode: t.Optional(t.String()),
        jenis: t.Optional(t.String()),
        alamat: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        email: t.Optional(t.String()),
        latitude: t.Optional(t.Number()),
        longitude: t.Optional(t.Number()),
        radius_absensi_meter: t.Optional(t.Number()),
        aktif: t.Optional(t.Boolean()),
        id_level_unit: t.Optional(t.String()),
        id_induk_unit: t.Optional(t.String()),
      })
    }
  )

  .delete('/unit-kerja/:id', async ({ params: { id }, user, set }: any) => {
    try {
      if (user?.peran !== 'admin_dinas') {
        set.status = 403;
        return { status: 'error', message: 'Hanya Admin Dinas yang dapat menghapus unit kerja' };
      }

      // Validasi relasi ke bawah (induk dari unit lain)
      const children = await db.select().from(unitKerja).where(eq(unitKerja.id_induk_unit, id)).limit(1);
      // Validasi relasi pegawai
      const employees = await db.select().from(pegawai).where(eq(pegawai.id_unit_kerja, id)).limit(1);

      if (children.length > 0 || employees.length > 0) {
        set.status = 400;
        return { 
          status: 'error', 
          message: 'Unit kerja tidak dapat dihapus permanen karena masih memiliki bawahan atau pegawai terdaftar. Silakan gunakan fitur Nonaktifkan.' 
        };
      }

      const deleted = await db.delete(unitKerja).where(eq(unitKerja.id, id)).returning();
      if (deleted.length === 0) {
        set.status = 404;
        return { status: 'error', message: 'Unit kerja tidak ditemukan' };
      }
      return { status: 'success', message: 'Unit kerja berhasil dihapus permanen' };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 👥 MODUL PEGAWAI UNIT
  // -----------------------------------------------------------
  .get('/unit-kerja/:id/pegawai', async ({ params: { id }, set }: any) => {
    try {
      const daftarPegawai = await db.select().from(pegawai).where(eq(pegawai.id_unit_kerja, id));
      return { status: 'success', data: daftarPegawai };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal mengambil data pegawai unit' };
    }
  })

  // -----------------------------------------------------------
  // 🌳 MODUL POHON ORGANISASI
  // -----------------------------------------------------------
  .get('/pohon-organisasi', async ({ set }: any) => {
    try {
      const dataDinas = await db.select().from(dinas).limit(1);
      if (dataDinas.length === 0) {
        return { status: 'success', data: [] };
      }

      const semuaUnit = await db.select().from(unitKerja).where(eq(unitKerja.aktif, true));

      const buildTree = (parentId: string | null): any[] => {
        return semuaUnit
          .filter(u => u.id_induk_unit === parentId)
          .map(u => ({
            ...u,
            anak_unit: buildTree(u.id),
          }));
      };

      const pohon = {
        ...dataDinas[0],
        anak_unit: buildTree(null),
      };

      return { status: 'success', data: pohon };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal membangun pohon organisasi' };
    }
  });
