import * as Sentry from '@sentry/node';

export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 0.2, // 20% transaksi di-trace
      // Jangan kirim data sensitif
      beforeSend(event) {
        // Hapus data request body yang mungkin mengandung password
        if (event.request?.data) {
          const data = event.request.data as Record<string, unknown>;
          if (data.password) data.password = '[REDACTED]';
        }
        return event;
      },
    });
    console.log('✅ Sentry initialized');
  }
}

export { Sentry };
