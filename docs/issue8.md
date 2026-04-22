# 📋 Eksekusi Issue #8: Integrasi MinIO & API Upload Foto Profil

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #8]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu.

---

## 📚 Konteks Penting (Baca Dulu!)

### Apa yang akan dibuat?
1. **Helper penyimpanan** (`src/lib/penyimpanan.ts`) — modul terpisah untuk upload/delete file ke MinIO (S3-Compatible storage).
2. **Endpoint upload foto** (`PUT /v1/pegawai/:id/foto`) — menerima file gambar via `multipart/form-data`, mengompresi, menyimpan ke MinIO, dan mengupdate kolom `url_foto` di database.

### File yang Sudah Ada (JANGAN diubah kecuali disebutkan)
- `backend/src/db/schema/pegawai.ts` — Kolom `url_foto: varchar('url_foto', { length: 500 })` sudah ada.
- `backend/src/routes/v1/pegawai.ts` — Endpoint pegawai yang sudah berjalan. Kita akan **menambahkan** endpoint baru di file ini.
- `backend/src/middleware/authGuard.ts` — Plugin JWT, sudah digunakan di `pegawai.ts`.

### Variabel Lingkungan MinIO (Tambahkan ke file `.env`)
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=mahesa-uploads
```

> **⚠️ Prasyarat:** Anda harus punya MinIO server yang jalan. Jika belum, jalankan via Docker:
> ```bash
> docker run -d --name minio -p 9000:9000 -p 9001:9001 \
>   -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin \
>   minio/minio server /data --console-address ":9001"
> ```

---

## 🛠️ Langkah 1: Install Dependencies

Jalankan di folder `backend/`:
```bash
bun add @aws-sdk/client-s3 sharp
bun add -d @types/sharp
```

**Penjelasan:**
- `@aws-sdk/client-s3` — Library resmi AWS untuk berkomunikasi dengan S3/MinIO.
- `sharp` — Library kompresi dan resize gambar yang sangat cepat.

---

## 🛠️ Langkah 2: Buat Helper Penyimpanan

Buat file baru di `backend/src/lib/penyimpanan.ts` dan masukkan kode berikut:

**File: `backend/src/lib/penyimpanan.ts`**
```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// Konfigurasi S3 Client untuk MinIO
const s3Client = new S3Client({
  region: 'us-east-1', // Wajib ada tapi tidak relevan untuk MinIO
  endpoint: `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // WAJIB untuk MinIO (berbeda dengan AWS S3)
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'mahesa-uploads';

/**
 * Upload file ke MinIO.
 * @param key - Nama file di bucket (misal: "foto-profil/uuid-pegawai.webp")
 * @param body - Buffer data file
 * @param contentType - MIME type file (misal: "image/webp")
 * @returns URL publik file yang diupload
 */
export async function uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(command);

  // Bangun URL publik
  const endpoint = `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`;
  return `${endpoint}/${BUCKET_NAME}/${key}`;
}

/**
 * Hapus file dari MinIO.
 * @param key - Nama file di bucket yang akan dihapus
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
}

/**
 * Ambil key dari URL lengkap.
 * Contoh: "http://localhost:9000/mahesa-uploads/foto-profil/abc.webp" -> "foto-profil/abc.webp"
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Path format: /bucket-name/key
    const parts = urlObj.pathname.split('/');
    // Hapus string kosong pertama dan bucket name
    parts.shift(); // ""
    parts.shift(); // bucket name
    return parts.join('/');
  } catch {
    return null;
  }
}
```

---

## 🛠️ Langkah 3: Tambahkan Endpoint Upload Foto di `pegawai.ts`

Buka file `backend/src/routes/v1/pegawai.ts`. Lakukan 2 perubahan:

### 3a. Tambahkan Import

Di bagian **paling atas** file, tambahkan import berikut:
```typescript
import { uploadFile, deleteFile, extractKeyFromUrl } from '../../lib/penyimpanan';
```

### 3b. Tambahkan Endpoint Sebelum `.delete()`

Tambahkan blok kode berikut **SEBELUM** baris `.delete('/:id', ...)` (sebelum endpoint delete, setelah endpoint PUT):

```typescript
  // -----------------------------------------------------------
  // 📸 PUT /v1/pegawai/:id/foto
  // Upload foto profil pegawai.
  // Menerima multipart/form-data dengan field "foto".
  // -----------------------------------------------------------
  .put(
    '/:id/foto',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        // Cek apakah pegawai boleh upload (hanya admin atau diri sendiri)
        if (user.peran === 'pegawai' && user.id_pegawai !== id) {
          set.status = 403;
          return { status: 'error', message: 'Anda hanya bisa mengubah foto diri sendiri' };
        }

        const file = body.foto;
        if (!file) {
          set.status = 400;
          return { status: 'error', message: 'File foto tidak ditemukan. Kirim dengan field name "foto".' };
        }

        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          set.status = 400;
          return { status: 'error', message: 'Hanya file JPEG, PNG, atau WebP yang diizinkan' };
        }

        // Validasi ukuran file (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          set.status = 400;
          return { status: 'error', message: 'Ukuran file melebihi batas (maks 5MB)' };
        }

        // Baca file menjadi buffer
        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        // Kompresi gambar menggunakan sharp (opsional, bisa diaktifkan jika sharp terinstal)
        try {
          const sharp = (await import('sharp')).default;
          buffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' }) // Resize ke 400x400 crop tengah
            .webp({ quality: 80 }) // Kompres ke format WebP
            .toBuffer();
        } catch (sharpError) {
          // Jika sharp gagal diimpor/dijalankan, gunakan file asli
          console.warn('⚠️ Sharp tidak tersedia, menggunakan file asli tanpa kompresi.');
        }

        // Hapus foto lama jika ada
        const existing = await db.select({ url_foto: pegawai.url_foto }).from(pegawai).where(eq(pegawai.id, id)).limit(1);
        if (existing[0]?.url_foto) {
          const oldKey = extractKeyFromUrl(existing[0].url_foto);
          if (oldKey) {
            try { await deleteFile(oldKey); } catch { /* Abaikan jika gagal hapus */ }
          }
        }

        // Upload ke MinIO
        const key = `foto-profil/${id}.webp`;
        const url = await uploadFile(key, buffer, 'image/webp');

        // Update database
        await db.update(pegawai).set({
          url_foto: url,
          diperbarui_pada: new Date(),
        }).where(eq(pegawai.id, id));

        return { status: 'success', message: 'Foto profil berhasil diperbarui', data: { url_foto: url } };
      } catch (error: any) {
        console.error('Upload foto error:', error);
        set.status = 500;
        return { status: 'error', message: error.message || 'Gagal mengunggah foto profil' };
      }
    },
    {
      body: t.Object({
        foto: t.File({ maxSize: '5m', type: ['image/jpeg', 'image/png', 'image/webp'] }),
      })
    }
  )
```

---

## 🛠️ Langkah 4: Pastikan Folder `src/lib/` Ada

Jika folder `backend/src/lib/` belum ada, buat secara manual atau biarkan editor/AI membuatnya saat membuat file `penyimpanan.ts`.

---

## 🧪 Langkah 5: Pengujian (Testing)

### Verifikasi Kompilasi
```bash
bunx tsc --noEmit
```
Pastikan output: **0 Error**.

### Jalankan Server
```bash
bun run dev
```

### Skenario Pengujian (Gunakan Postman/ThunderClient)

**Skenario 1: Upload tanpa token (harus 401)**
- `PUT http://localhost:3000/v1/pegawai/some-uuid/foto` (tanpa header Authorization) → Expect `401`

**Skenario 2: Upload dengan token valid (jika MinIO belum jalan)**
- Login terlebih dahulu via `POST /v1/otentikasi/masuk` untuk mendapatkan token.
- `PUT http://localhost:3000/v1/pegawai/{id_pegawai}/foto` dengan form-data field `foto` berisi file gambar → Expect `500` dengan pesan error koneksi MinIO (ini normal jika MinIO belum dijalankan).

**Skenario 3: Upload dengan MinIO aktif**
- Jalankan MinIO via Docker (lihat prasyarat di atas).
- Pastikan bucket `mahesa-uploads` ada (bisa buat via MinIO Console di `http://localhost:9001`).
- Upload file gambar → Expect `200` dan field `url_foto` terisi di response.

**Skenario 4: Validasi file**
- Kirim file `.txt` (bukan gambar) → Expect `400` dengan pesan "Hanya file JPEG, PNG, atau WebP yang diizinkan".
- Kirim file > 5MB → Expect `400`.

Jika semua skenario berjalan sesuai ekspektasi, **Issue #8 dinyatakan SELESAI**.
