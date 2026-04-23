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
