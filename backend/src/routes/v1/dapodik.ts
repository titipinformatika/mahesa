import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pegawai } from '../../db/schema/pegawai';
import { eq, and, sql } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const dapodikRoutes = new Elysia({ prefix: '/dapodik' })
    .use(authPlugin)
    .post('/diff', async ({ user, body, set }) => {
        if (!user || user.peran !== 'admin_dinas') {
            set.status = 403;
            return { status: 'error', message: 'Forbidden' };
        }
        
        const data = body.data; // List of objects from CSV
        const results = {
            new: [] as any[],
            updated: [] as any[],
            removed: [] as any[]
        };

        const existingStaff = await db.select().from(pegawai);
        const existingNips = new Set(existingStaff.map(s => s.nip));

        for (const item of data) {
            if (existingNips.has(item.nip)) {
                const current = existingStaff.find(s => s.nip === item.nip);
                if (current && (current.nama_lengkap !== item.nama || current.jabatan !== item.jabatan)) {
                    results.updated.push({ old: current, new: item });
                }
            } else {
                results.new.push(item);
            }
        }

        return { status: 'success', data: results };
    }, {
        body: t.Object({
            data: t.Array(t.Object({
                nip: t.String(),
                nama: t.String(),
                jabatan: t.String(),
                idUnit: t.String()
            }))
        })
    })
    .post('/sinkronisasi', async ({ user, body, set }) => {
        if (!user || user.peran !== 'admin_dinas') {
            set.status = 403;
            return { status: 'error', message: 'Forbidden' };
        }
        
        const { additions, updates } = body;

        await db.transaction(async (tx) => {
            if (additions.length > 0) {
                await tx.insert(pegawai).values(additions.map((a: any) => ({
                    nip: a.nip,
                    nama_lengkap: a.nama,
                    jabatan: a.jabatan,
                    id_unit_kerja: a.idUnit,
                    // Minimal required fields
                    nik: a.nip.length >= 16 ? a.nip.substring(0, 16) : a.nip.padEnd(16, '0'),
                    jenis_kelamin: 'Laki-laki', // Placeholder
                    tanggal_masuk: new Date().toISOString().split('T')[0],
                    aktif: true
                })));
            }

            for (const u of updates) {
                await tx.update(pegawai)
                    .set({ 
                        nama_lengkap: u.nama, 
                        jabatan: u.jabatan, 
                        id_unit_kerja: u.idUnit,
                        diperbarui_pada: new Date()
                    })
                    .where(eq(pegawai.nip, u.nip));
            }
        });

        return { status: 'success', message: 'Sinkronisasi berhasil' };
    }, {
        body: t.Object({
            additions: t.Array(t.Any()),
            updates: t.Array(t.Any())
        })
    });
