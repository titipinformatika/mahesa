import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pegawai } from '../../db/schema/pegawai';
import { absensi } from '../../db/schema/absensi';
import { pengajuanCuti } from '../../db/schema/cuti';
import { pengajuanDinasLuar } from '../../db/schema/dinasLuar';
import { laporanDinas } from '../../db/schema/laporan';
import { eq, and, sql, gte, lte, desc } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const laporanRoutes = new Elysia({ prefix: '/laporan' })
    .use(authPlugin)
    .get('/dinas', async ({ user, query, set }) => {
        if (!user) {
            set.status = 401;
            return { status: 'error', message: 'Unauthorized' };
        }

        const { bulan, tahun } = query as { bulan?: string, tahun?: string };
        
        // If bulan/tahun provided, calculate summary
        if (bulan && tahun) {
            const startDate = `${tahun}-${bulan.padStart(2, '0')}-01`;
            const endDate = new Date(Number(tahun), Number(bulan), 0).toISOString().split('T')[0];

            const summary = await db.select({
                total_pegawai: sql<number>`count(distinct ${pegawai.id})`,
                total_hadir: sql<number>`count(distinct ${absensi.id})`,
                total_cuti: sql<number>`count(distinct ${pengajuanCuti.id})`,
                total_dl: sql<number>`count(distinct ${pengajuanDinasLuar.id})`,
            })
            .from(pegawai)
            .leftJoin(absensi, and(eq(pegawai.id, absensi.id_pegawai), gte(absensi.tanggal, startDate), lte(absensi.tanggal, endDate)))
            .leftJoin(pengajuanCuti, and(
                eq(pegawai.id, pengajuanCuti.idPegawai),
                eq(pengajuanCuti.status, 'disetujui'),
                gte(pengajuanCuti.tanggalMulai, startDate),
                lte(pengajuanCuti.tanggalMulai, endDate)
            ))
            .leftJoin(pengajuanDinasLuar, and(
                eq(pegawai.id, pengajuanDinasLuar.id_pegawai),
                eq(pengajuanDinasLuar.status, 'disetujui'),
                gte(pengajuanDinasLuar.tanggal, startDate),
                lte(pengajuanDinasLuar.tanggal, endDate)
            ));

            return {
                status: 'success',
                data: {
                    periode: `${bulan}-${tahun}`,
                    summary: summary[0]
                }
            };
        }

        // Otherwise return history of reports
        const history = await db.select()
            .from(laporanDinas)
            .where(eq(laporanDinas.idPimpinan, user.id))
            .orderBy(desc(laporanDinas.dibuatPada));

        return {
            status: 'success',
            data: history
        };
    }, {
        query: t.Object({
            bulan: t.Optional(t.String()),
            tahun: t.Optional(t.String())
        })
    })
    .post('/dinas', async ({ user, body, set }) => {
        if (!user || user.peran !== 'pimpinan') {
            set.status = 403;
            return { status: 'error', message: 'Forbidden' };
        }

        const res = await db.insert(laporanDinas).values({
            idUnitKerja: user.id_unit_kerja!,
            idPimpinan: user.id,
            bulan: body.bulan,
            tahun: body.tahun,
            totalPegawai: body.totalPegawai,
            totalHadir: body.totalHadir,
            totalCuti: body.totalCuti,
            totalDl: body.totalDl,
            catatanPimpinan: body.catatanPimpinan,
            status: (body.status || 'draft') as 'draft' | 'dikirim' | 'diterima' | 'ditolak'
        }).returning();

        return {
            status: 'success',
            data: res[0]
        };
    }, {
        body: t.Object({
            bulan: t.Number(),
            tahun: t.Number(),
            totalPegawai: t.Number(),
            totalHadir: t.Number(),
            totalCuti: t.Number(),
            totalDl: t.Number(),
            catatanPimpinan: t.Optional(t.String()),
            status: t.Optional(t.Union([
                t.Literal('draft'),
                t.Literal('dikirim'),
                t.Literal('diterima'),
                t.Literal('ditolak')
            ]))
        })
    });
