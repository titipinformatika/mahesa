import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pegawai } from '../../db/schema/pegawai';
import { absensi } from '../../db/schema/absensi';
import { pengajuanCuti } from '../../db/schema/cuti';
import { pengajuanDinasLuar } from '../../db/schema/dinasLuar';
import { eq, and, sql } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const statistikRoutes = new Elysia({ prefix: '/statistik' })
    .use(authPlugin)
    .get('/dasbor', async ({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { status: 'error', message: 'Unauthorized' };
        }

        const role = user.peran;
        const idUnit = user.id_unit_kerja;

        // Base query conditions
        const unitCondition = (role === 'admin_unit' || role === 'pimpinan') && idUnit 
            ? eq(pegawai.id_unit_kerja, idUnit) 
            : undefined;

        // 1. Total Pegawai
        const totalPegawaiQuery = db.select({ count: sql<number>`count(*)` }).from(pegawai);
        if (unitCondition) totalPegawaiQuery.where(unitCondition);
        const [totalPegawai] = await totalPegawaiQuery;

        // 2. Kehadiran Hari Ini
        const today = new Date().toISOString().split('T')[0];
        const hadirHariIniQuery = db.select({ count: sql<number>`count(distinct ${absensi.id_pegawai})` })
            .from(absensi)
            .innerJoin(pegawai, eq(absensi.id_pegawai, pegawai.id))
            .where(and(
                eq(absensi.tanggal, today),
                unitCondition ? unitCondition : sql`true`
            ));
        const [hadirHariIni] = await hadirHariIniQuery;

        // 3. Pegawai Cuti Hari Ini
        const cutiHariIniQuery = db.select({ count: sql<number>`count(distinct ${pengajuanCuti.idPegawai})` })
            .from(pengajuanCuti)
            .innerJoin(pegawai, eq(pengajuanCuti.idPegawai, pegawai.id))
            .where(and(
                eq(pengajuanCuti.status, 'disetujui'),
                sql`${today} BETWEEN ${pengajuanCuti.tanggalMulai} AND ${pengajuanCuti.tanggalSelesai}`,
                unitCondition ? unitCondition : sql`true`
            ));
        const [cutiHariIni] = await cutiHariIniQuery;

        // 4. Pegawai Dinas Luar Hari Ini
        const dlHariIniQuery = db.select({ count: sql<number>`count(distinct ${pengajuanDinasLuar.id_pegawai})` })
            .from(pengajuanDinasLuar)
            .innerJoin(pegawai, eq(pengajuanDinasLuar.id_pegawai, pegawai.id))
            .where(and(
                eq(pengajuanDinasLuar.status, 'disetujui'),
                eq(pengajuanDinasLuar.tanggal, today),
                unitCondition ? unitCondition : sql`true`
            ));
        const [dlHariIni] = await dlHariIniQuery;

        return {
            status: 'success',
            data: {
                total_pegawai: Number(totalPegawai.count),
                hadir_hari_ini: Number(hadirHariIni.count),
                cuti_hari_ini: Number(cutiHariIni.count),
                dl_hari_ini: Number(dlHariIni.count),
                persentase_kehadiran: totalPegawai.count > 0 
                    ? Math.round((hadirHariIni.count / totalPegawai.count) * 100) 
                    : 0
            }
        };
    })
    .get('/pantau', async ({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { status: 'error', message: 'Unauthorized' };
        }
        
        const idUnit = user.id_unit_kerja;
        const role = user.peran;
        const today = new Date().toISOString().split('T')[0];

        // Get all staff in unit (or all if admin_dinas)
        const staffQuery = db.select({
            id: pegawai.id,
            nama: pegawai.nama_lengkap,
            jabatan: pegawai.jabatan,
        }).from(pegawai);
        
        if ((role === 'admin_unit' || role === 'pimpinan') && idUnit) {
            staffQuery.where(eq(pegawai.id_unit_kerja, idUnit));
        }

        const allStaff = await staffQuery;

        // Get presence today
        const presensiToday = await db.select().from(absensi).where(eq(absensi.tanggal, today));
        
        // Get active leave
        const activeCuti = await db.select().from(pengajuanCuti).where(and(
            eq(pengajuanCuti.status, 'disetujui'),
            sql`${today} BETWEEN ${pengajuanCuti.tanggalMulai} AND ${pengajuanCuti.tanggalSelesai}`
        ));

        // Get active DL
        const activeDL = await db.select().from(pengajuanDinasLuar).where(and(
            eq(pengajuanDinasLuar.status, 'disetujui'),
            eq(pengajuanDinasLuar.tanggal, today)
        ));

        const data = allStaff.map(s => {
            let status = 'Belum Presensi';
            const hasPresensi = presensiToday.find(p => p.id_pegawai === s.id);
            const hasCuti = activeCuti.find(c => c.idPegawai === s.id);
            const hasDL = activeDL.find(d => d.id_pegawai === s.id);

            if (hasPresensi) status = 'Hadir';
            else if (hasCuti) status = 'Cuti';
            else if (hasDL) status = 'Dinas Luar';

            return { ...s, status };
        });

        return {
            status: 'success',
            data
        };
    });
