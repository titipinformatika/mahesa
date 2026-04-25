import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { skemaDinasLuar, pengajuanDinasLuar, logLokasiPegawai } from '../../db/schema/dinasLuar';
import { pegawai } from '../../db/schema/pegawai';
import { eq, and, desc, sql } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import { sendFCMNotification } from '../../lib/notifikasi';
import { TEMPLATE_SKEMA } from '../../lib/skemaAbsensiTemplates';

export const dinasLuarRoutes = new Elysia({ prefix: '/v1/dinas-luar' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 🗺️ MONITORING PETA (Real-time)
  // -----------------------------------------------------------
  .get('/peta-langsung', async ({ user, set }: any) => {
    try {
      const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
      if (!allowedRoles.includes(user?.peran)) {
        set.status = 403;
        return { status: 'error', message: 'Hanya pimpinan/admin yang dapat memantau peta' };
      }

      const data = await db.execute(sql`
        SELECT DISTINCT ON (pdl.id)
          pdl.id as id,
          p.nama_lengkap,
          p.id_unit_kerja,
          pdl.nama_tujuan as tujuan,
          llp.latitude,
          llp.longitude,
          llp.dicatat_pada as waktu_log
        FROM pengajuan_dinas_luar pdl
        JOIN pegawai p ON pdl.id_pegawai = p.id
        JOIN log_lokasi_pegawai llp ON pdl.id = llp.id_pengajuan_dl
        WHERE pdl.status = 'disetujui'
        AND current_date = pdl.tanggal
        ORDER BY pdl.id, llp.dicatat_pada DESC
      `);

      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 📋 MASTER SKEMA DL
  // -----------------------------------------------------------
  .get('/skema', async ({ user, query }: any) => {
    try {
      const { eq, or, inArray } = await import('drizzle-orm');
      let conditions;

      if (user.peran === 'admin_dinas') {
        if (query.id_unit_kerja) {
          conditions = eq(skemaDinasLuar.id_unit_kerja, query.id_unit_kerja);
        } else {
          // Admin dinas melihat semua skema
          const data = await db.select().from(skemaDinasLuar);
          return { status: 'success', data };
        }
      } else if (user.peran === 'admin_upt' && user.id_unit_kerja) {
        // Admin UPT melihat unitnya sendiri dan unit bawahannya
        const subordinateUnits = await db.select({ id: require('../../db/schema/organisasi').unitKerja.id })
          .from(require('../../db/schema/organisasi').unitKerja)
          .where(eq(require('../../db/schema/organisasi').unitKerja.id_induk_unit, user.id_unit_kerja));
        
        const unitIds = [user.id_unit_kerja, ...subordinateUnits.map(u => u.id)];
        conditions = inArray(skemaDinasLuar.id_unit_kerja, unitIds);
      } else if (user.id_unit_kerja) {
        conditions = eq(skemaDinasLuar.id_unit_kerja, user.id_unit_kerja);
      } else {
        return { status: 'success', data: [] };
      }

      const data = await db.select().from(skemaDinasLuar).where(conditions);
      return { status: 'success', data };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  })

  .post('/skema', async ({ body, set, user }: any) => {
    const allowedRoles = ['admin_dinas', 'admin_upt'];
    if (!allowedRoles.includes(user.peran)) {
      set.status = 403;
      return { status: 'error', message: 'Hanya Admin Dinas/UPT yang dapat mengelola skema' };
    }

    const kode = body.kode_skema as keyof typeof TEMPLATE_SKEMA;
    if (!TEMPLATE_SKEMA[kode]) {
      set.status = 400;
      return { status: 'error', message: 'Kode skema tidak valid' };
    }

    try {
      let target_units = body.id_unit_kerja_list || [];
      
      if (target_units.length === 0) {
        if (user.id_unit_kerja) {
          target_units = [user.id_unit_kerja];
        } else {
           set.status = 400;
           return { status: 'error', message: 'ID Unit Kerja wajib diisi' };
        }
      }
      
      // Validasi akses untuk Admin UPT
      if (user.peran === 'admin_upt') {
        const subordinateUnits = await db.select({ id: require('../../db/schema/organisasi').unitKerja.id })
          .from(require('../../db/schema/organisasi').unitKerja)
          .where(eq(require('../../db/schema/organisasi').unitKerja.id_induk_unit, user.id_unit_kerja));
        
        const allowedUnitIds = [user.id_unit_kerja, ...subordinateUnits.map((u: any) => u.id)];
        
        const invalidUnits = target_units.filter((id: string) => !allowedUnitIds.includes(id));
        if (invalidUnits.length > 0) {
           set.status = 403;
           return { status: 'error', message: 'Anda mencoba mengatur skema untuk unit di luar wilayah Anda' };
        }
      }

      let successCount = 0;
      let skipCount = 0;

      for (const id_unit of target_units) {
        try {
          await db.insert(skemaDinasLuar).values({
            id_unit_kerja: id_unit,
            kode_skema: body.kode_skema,
            label: body.label || body.kode_skema.toUpperCase().replace(/_/g, ' '),
            titik_titik: TEMPLATE_SKEMA[kode],
            aktif: true,
          });
          successCount++;
        } catch (error: any) {
          if (error.message.includes('unique') || error.message.includes('duplicate key value')) {
            skipCount++;
          } else {
            throw error;
          }
        }
      }

      return { 
        status: 'success', 
        message: `Berhasil membuat ${successCount} skema, ${skipCount} dilewati karena sudah ada`
      };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  }, {
    body: t.Object({
      id_unit_kerja_list: t.Array(t.String()),
      kode_skema: t.String(),
      label: t.Optional(t.String()),
    })
  })

  .patch('/skema/:id/toggle', async ({ params: { id }, user, set }: any) => {
    const allowedRoles = ['admin_dinas', 'admin_upt'];
    if (!allowedRoles.includes(user.peran)) {
      set.status = 403;
      return { status: 'error', message: 'Anda tidak memiliki akses' };
    }

    const current = await db.select().from(skemaDinasLuar).where(eq(skemaDinasLuar.id, id)).limit(1);
    if (current.length === 0) {
      set.status = 404;
      return { status: 'error', message: 'Skema tidak ditemukan' };
    }

    const updated = await db.update(skemaDinasLuar)
      .set({ aktif: !current[0].aktif, diperbarui_pada: new Date() })
      .where(eq(skemaDinasLuar.id, id))
      .returning();

    return { status: 'success', data: updated[0] };
  })

  // -----------------------------------------------------------
  // 📝 PENGAJUAN DL
  // -----------------------------------------------------------
  .post('/', async ({ body, user, set }: any) => {
    try {
      if (!user.id_pegawai) {
        set.status = 400;
        return { status: 'error', message: 'Hanya pegawai yang dapat mengajukan DL' };
      }

      const inserted = await db.insert(pengajuanDinasLuar).values({
        id_pegawai: user.id_pegawai,
        tanggal: body.tanggal,
        skema: body.skema,
        nama_tujuan: body.nama_tujuan,
        latitude_tujuan: body.latitude_tujuan.toString(),
        longitude_tujuan: body.longitude_tujuan.toString(),
        radius_tujuan_meter: body.radius_tujuan_meter || 200,
        keperluan: body.keperluan,
        url_surat_tugas: body.url_surat_tugas,
        status: 'menunggu',
      }).returning();

      return { status: 'success', message: 'Pengajuan DL berhasil dikirim', data: inserted[0] };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  }, {
    body: t.Object({
      tanggal: t.String(),
      skema: t.String(),
      nama_tujuan: t.String(),
      latitude_tujuan: t.Number(),
      longitude_tujuan: t.Number(),
      radius_tujuan_meter: t.Optional(t.Number()),
      keperluan: t.String(),
      url_surat_tugas: t.Optional(t.String()),
    })
  })

  .get('/', async ({ user, query }: any) => {
    const isPimpinan = ['pimpinan', 'admin_unit', 'admin_upt', 'admin_dinas'].includes(user.peran);
    
    let conditions;
    if (isPimpinan && query.all === 'true') {
      // In production, add unit filtering for pimpinan
      conditions = undefined;
    } else {
      conditions = eq(pengajuanDinasLuar.id_pegawai, user.id_pegawai);
    }

    const data = await db.select()
      .from(pengajuanDinasLuar)
      .where(conditions)
      .orderBy(desc(pengajuanDinasLuar.dibuat_pada));

    return { status: 'success', data };
  })

  .put('/:id/persetujuan', async ({ params: { id }, body, user, set }: any) => {
    const isPimpinan = ['pimpinan', 'admin_unit', 'admin_upt', 'admin_dinas'].includes(user.peran);
    if (!isPimpinan) {
      set.status = 403;
      return { status: 'error', message: 'Anda tidak memiliki akses persetujuan' };
    }

    const updated = await db.update(pengajuanDinasLuar).set({
      status: body.status,
      alasan_penolakan: body.alasan_penolakan,
      id_penyetuju: user.id_pegawai,
      waktu_persetujuan: new Date(),
      diperbarui_pada: new Date(),
    }).where(eq(pengajuanDinasLuar.id, id)).returning();

    if (updated.length === 0) {
      set.status = 404;
      return { status: 'error', message: 'Pengajuan tidak ditemukan' };
    }

    const statusText = body.status === 'disetujui' ? 'DISETUJUI' : 'DITOLAK';
    await sendFCMNotification(
      updated[0].id_pegawai,
      `Status Dinas Luar ${statusText}`,
      `Pengajuan DL Anda ke ${updated[0].nama_tujuan} telah ${body.status}.`
    );

    return { status: 'success', message: `Pengajuan berhasil ${body.status}`, data: updated[0] };
  }, {
    body: t.Object({
      status: t.String(),
      alasan_penolakan: t.Optional(t.String()),
    })
  })

  // -----------------------------------------------------------
  // 📍 PELACAKAN LOKASI (Ping)
  // -----------------------------------------------------------
  .post('/lokasi', async ({ body, set, user }: any) => {
    const inserted = await db.insert(logLokasiPegawai).values({
      id_pegawai: user.id_pegawai,
      id_pengajuan_dl: body.id_pengajuan_dl,
      latitude: body.latitude.toString(),
      longitude: body.longitude.toString(),
      akurasi: body.akurasi?.toString(),
    }).returning();
    return { status: 'success', data: inserted[0] };
  }, {
    body: t.Object({
      id_pengajuan_dl: t.Optional(t.String()),
      latitude: t.Number(),
      longitude: t.Number(),
      akurasi: t.Optional(t.Number()),
    })
  })

  .get('/:id/lokasi', async ({ params: { id } }: any) => {
    const data = await db.select()
      .from(logLokasiPegawai)
      .where(eq(logLokasiPegawai.id_pengajuan_dl, id))
      .orderBy(logLokasiPegawai.dicatat_pada);
    
    return { status: 'success', data };
  });
