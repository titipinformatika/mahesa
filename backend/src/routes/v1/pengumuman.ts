import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pengumuman } from '../../db/schema/informasi';
import { eq, and, sql, or, gte, lte } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const pengumumanRoutes = new Elysia({ prefix: '/pengumuman' })
    .use(authPlugin)
    .get('/', async ({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { status: 'error', message: 'Unauthorized' };
        }

        const role = user.peran;
        const idUnit = user.id_unit_kerja;
        const today = new Date().toISOString().split('T')[0];

        // Filter based on role, unit and date
        const filters = [
            lte(pengumuman.tanggalBerlaku, today),
            gte(pengumuman.tanggalBerakhir, today),
            eq(pengumuman.aktif, true)
        ];

        // Target filtering
        const targetFilters = [
            sql`${pengumuman.idUnit} IS NULL`,
            sql`${pengumuman.peranTarget} IS NULL`
        ];

        if (idUnit) targetFilters.push(eq(pengumuman.idUnit, idUnit));
        if (role) targetFilters.push(eq(pengumuman.peranTarget, role));

        const list = await db.select()
            .from(pengumuman)
            .where(and(
                ...filters,
                or(...targetFilters)
            ));

        return { status: 'success', data: list };
    })
    .post('/', async ({ user, body, set }) => {
        if (!user || (user.peran !== 'admin_dinas' && user.peran !== 'admin_unit')) {
            set.status = 403;
            return { status: 'error', message: 'Forbidden' };
        }
        
        const [inserted] = await db.insert(pengumuman).values({
            judul: body.judul,
            konten: body.konten,
            tanggalBerlaku: body.tanggalBerlaku,
            tanggalBerakhir: body.tanggalBerakhir,
            idUnit: user.peran === 'admin_unit' ? user.id_unit_kerja : body.idUnit,
            peranTarget: body.peranTarget
        }).returning();

        return { status: 'success', data: inserted };
    }, {
        body: t.Object({
            judul: t.String(),
            konten: t.String(),
            tanggalBerlaku: t.String(),
            tanggalBerakhir: t.String(),
            idUnit: t.Optional(t.String()),
            peranTarget: t.Optional(t.String())
        })
    })
    .put('/:id', async ({ user, params, body, set }) => {
        if (!user || (user.peran !== 'admin_dinas' && user.peran !== 'admin_unit')) {
            set.status = 403;
            return { status: 'error', message: 'Forbidden' };
        }
        
        const [updated] = await db.update(pengumuman)
            .set({ 
                judul: body.judul,
                konten: body.konten,
                tanggalBerlaku: body.tanggalBerlaku,
                tanggalBerakhir: body.tanggalBerakhir,
                idUnit: body.idUnit,
                peranTarget: body.peranTarget,
                diperbaruiPada: new Date() 
            })
            .where(eq(pengumuman.id, params.id))
            .returning();

        if (!updated) {
            set.status = 404;
            return { status: 'error', message: 'Not Found' };
        }
        return { status: 'success', data: updated };
    }, {
        body: t.Object({
            judul: t.Optional(t.String()),
            konten: t.Optional(t.String()),
            tanggalBerlaku: t.Optional(t.String()),
            tanggalBerakhir: t.Optional(t.String()),
            idUnit: t.Optional(t.String()),
            peranTarget: t.Optional(t.String())
        })
    })
    .delete('/:id', async ({ user, params, set }) => {
        if (!user || (user.peran !== 'admin_dinas' && user.peran !== 'admin_unit')) {
            set.status = 403;
            return { status: 'error', message: 'Forbidden' };
        }
        
        const [deleted] = await db.delete(pengumuman)
            .where(eq(pengumuman.id, params.id))
            .returning();

        if (!deleted) {
            set.status = 404;
            return { status: 'error', message: 'Not Found' };
        }
        return { status: 'success', data: deleted };
    });
