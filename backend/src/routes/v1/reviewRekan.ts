import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { reviewRekan } from '../../db/schema/lhkp';
import { pegawai } from '../../db/schema/pegawai';
import { eq, and, ne } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const reviewRekanRoutes = new Elysia({ prefix: '/v1/review-rekan' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 👥 GET /v1/review-rekan/target
  // Daftar rekan satu unit untuk dinilai
  // -----------------------------------------------------------
  .get('/target', async ({ user, set }: any) => {
    if (!user.id_pegawai || !user.id_unit_kerja) {
      set.status = 400;
      return { status: 'error', message: 'Data pegawai tidak lengkap' };
    }

    const data = await db.select({
      id: pegawai.id,
      nama: pegawai.nama_lengkap
    })
    .from(pegawai)
    .where(and(
      eq(pegawai.id_unit_kerja, user.id_unit_kerja),
      ne(pegawai.id, user.id_pegawai)
    ));

    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // ⭐ POST /v1/review-rekan
  // Kirim penilaian rekan
  // -----------------------------------------------------------
  .post('/', async ({ body, user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }

    const { idTarget, rating, komentar } = body;

    if (idTarget === user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'Anda tidak bisa menilai diri sendiri' };
    }

    const [newReview] = await db.insert(reviewRekan).values({
      idPenilai: user.id_pegawai,
      idTarget,
      rating,
      komentar
    }).returning();

    return { status: 'success', data: newReview };
  }, {
    body: t.Object({
      idTarget: t.String(),
      rating: t.Number(),
      komentar: t.Optional(t.String())
    })
  })

  // -----------------------------------------------------------
  // 📈 GET /v1/review-rekan
  // Lihat review yang saya terima
  // -----------------------------------------------------------
  .get('/', async ({ user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }

    const data = await db.select({
      id: reviewRekan.id,
      rating: reviewRekan.rating,
      komentar: reviewRekan.komentar,
      tanggal: reviewRekan.createdAt
    })
    .from(reviewRekan)
    .where(eq(reviewRekan.idTarget, user.id_pegawai));

    return { status: 'success', data };
  });
