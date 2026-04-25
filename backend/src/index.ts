import { initSentry, Sentry } from './lib/sentry';
initSentry();
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger';
import { logger } from './lib/logger';
import { otentikasiRoutes } from "./routes/v1/otentikasi";
import { organisasiRoutes } from "./routes/v1/organisasi";
import { pegawaiRoutes } from "./routes/v1/pegawai";
import { biodataRoutes } from "./routes/v1/biodata";
import { absensiRoutes } from "./routes/v1/absensi";
import { dinasLuarRoutes } from "./routes/v1/dinasLuar";
import { cutiRoutes } from "./routes/v1/cuti";
import { lhkpRoutes } from "./routes/v1/lhkp";
import { reviewRekanRoutes } from "./routes/v1/reviewRekan";
import { statistikRoutes } from "./routes/v1/statistik";
import { exportRoutes } from "./routes/v1/export";
import { laporanRoutes } from "./routes/v1/laporan";
import { dapodikRoutes } from "./routes/v1/dapodik";
import { pengumumanRoutes } from "./routes/v1/pengumuman";
import { initCronJobs } from "./lib/cron";
import { db } from "./db";
import { sql } from "drizzle-orm";

initCronJobs();

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || '*',
  })) // Mengizinkan akses dari domain luar (CORS)
  .use(swagger({
    documentation: {
      info: {
        title: 'MAHESA API',
        version: '1.0.0',
        description: 'API untuk Sistem Manajemen Kepegawaian MAHESA',
      },
      tags: [
        { name: 'Otentikasi', description: 'Login, profil, dan manajemen token' },
        { name: 'Pegawai', description: 'CRUD data pegawai' },
        { name: 'Absensi', description: 'Clock-in/out, riwayat, dan rekap' },
        { name: 'Dinas Luar', description: 'Pengajuan dan tracking dinas luar' },
        { name: 'Cuti', description: 'Pengajuan cuti dan saldo' },
        { name: 'LHKP', description: 'Laporan Harian Kinerja Pegawai' },
        { name: 'Statistik', description: 'Dashboard statistik dan analytics' },
        { name: 'Laporan', description: 'Rekap dan export laporan' },
        { name: 'Dapodik', description: 'Sinkronisasi data Dapodik' },
        { name: 'Pengumuman', description: 'Manajemen pengumuman' },
      ],
    },
  }))
  .onError(({ code, error, set }) => {
    console.error(`[ERROR ${code}]`, error);
    // Kirim ke Sentry
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error);
    }
    if (process.env.NODE_ENV === 'production') {
      set.status = 500;
      return { status: 'error', message: 'Terjadi kesalahan internal server.' };
    }
    set.status = 500;
    const errorAny = error as any;
    return { 
      status: 'error', 
      message: errorAny?.message || 'Terjadi kesalahan internal', 
      stack: error instanceof Error ? error.stack : undefined 
    };
  })
  .onRequest(({ request }) => {
    logger.info('Request received', {
      method: request.method,
      url: request.url,
    });
  })
  // Mendaftarkan grup rute otentikasi
  .use(otentikasiRoutes)
  .use(organisasiRoutes)
  .use(pegawaiRoutes)
  .use(biodataRoutes)
  .use(absensiRoutes)
  .use(dinasLuarRoutes)
  .use(cutiRoutes)
  .use(lhkpRoutes)
  .use(reviewRekanRoutes)
  .use(statistikRoutes)
  .use(exportRoutes)
  .use(laporanRoutes)
  .use(dapodikRoutes)
  .use(pengumumanRoutes)
  
  // Endpoint root untuk cek kesehatan server
  .get("/", () => "Hello MAHESA Backend is Running!")
  .get("/health", async ({ set }) => {
    const checks: Record<string, string> = {};
    let allOk = true;

    // Check Database
    try {
      await db.execute(sql`SELECT 1`);
      checks.database = "ok";
    } catch {
      checks.database = "error";
      allOk = false;
    }

    // Check Memory Usage
    const mem = process.memoryUsage();
    const memMb = Math.round(mem.heapUsed / 1024 / 1024);
    checks.memory = `${memMb}MB`;

    // Check Uptime
    checks.uptime = `${Math.round(process.uptime())}s`;

    set.status = allOk ? 200 : 503;
    return {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: checks,
    };
  })
  
  .listen({
    port: 3000,
    hostname: '0.0.0.0'
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
