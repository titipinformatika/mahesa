import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pegawai } from '../../db/schema/pegawai';
import { absensi } from '../../db/schema/absensi';
import { pengajuanCuti } from '../../db/schema/cuti';
import { pengajuanDinasLuar } from '../../db/schema/dinasLuar';
import { eq, and, sql, gte, lte, or } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import ExcelJS from 'exceljs';

export const exportRoutes = new Elysia({ prefix: '/export' })
    .use(authPlugin)
    .get('/absensi', async ({ user, query, set }) => {
        if (!user) {
            set.status = 401;
            return { status: 'error', message: 'Unauthorized' };
        }

        const { bulan, tahun } = query as { bulan?: string, tahun?: string };
        const targetBulan = bulan || (new Date().getMonth() + 1).toString();
        const targetTahun = tahun || new Date().getFullYear().toString();

        const startDate = `${targetTahun}-${targetBulan.padStart(2, '0')}-01`;
        const endDate = new Date(Number(targetTahun), Number(targetBulan), 0).toISOString().split('T')[0];

        const idUnit = user.id_unit_kerja;
        const role = user.peran;

        const staffQuery = db.select({
            id: pegawai.id,
            nama: pegawai.nama_lengkap,
            jabatan: pegawai.jabatan,
        }).from(pegawai);

        if ((role === 'admin_unit' || role === 'pimpinan') && idUnit) {
            staffQuery.where(eq(pegawai.id_unit_kerja, idUnit));
        }

        const staffList = await staffQuery;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rekap Absensi');

        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Nama Pegawai', key: 'nama', width: 30 },
            { header: 'Jabatan', key: 'jabatan', width: 25 },
            { header: 'Hadir', key: 'hadir', width: 10 },
            { header: 'Cuti', key: 'cuti', width: 10 },
            { header: 'DL', key: 'dl', width: 10 },
        ];

        for (let i = 0; i < staffList.length; i++) {
            const s = staffList[i];
            
            const [countHadir] = await db.select({ count: sql<number>`count(*)` })
                .from(absensi)
                .where(and(
                    eq(absensi.id_pegawai, s.id),
                    gte(absensi.tanggal, startDate),
                    lte(absensi.tanggal, endDate)
                ));

            const [countCuti] = await db.select({ count: sql<number>`count(*)` })
                .from(pengajuanCuti)
                .where(and(
                    eq(pengajuanCuti.idPegawai, s.id),
                    eq(pengajuanCuti.status, 'disetujui'),
                    or(
                        and(gte(pengajuanCuti.tanggalMulai, startDate), lte(pengajuanCuti.tanggalMulai, endDate)),
                        and(gte(pengajuanCuti.tanggalSelesai, startDate), lte(pengajuanCuti.tanggalSelesai, endDate))
                    )
                ));

            const [countDL] = await db.select({ count: sql<number>`count(*)` })
                .from(pengajuanDinasLuar)
                .where(and(
                    eq(pengajuanDinasLuar.id_pegawai, s.id),
                    eq(pengajuanDinasLuar.status, 'disetujui'),
                    gte(pengajuanDinasLuar.tanggal, startDate),
                    lte(pengajuanDinasLuar.tanggal, endDate)
                ));

            worksheet.addRow({
                no: i + 1,
                nama: s.nama,
                jabatan: s.jabatan,
                hadir: Number(countHadir.count),
                cuti: Number(countCuti.count),
                dl: Number(countDL.count),
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        
        set.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        set.headers['Content-Disposition'] = `attachment; filename="Rekap_Absensi_${targetBulan}_${targetTahun}.xlsx"`;

        return buffer;
    }, {
        query: t.Object({
            bulan: t.Optional(t.String()),
            tahun: t.Optional(t.String())
        })
    });
