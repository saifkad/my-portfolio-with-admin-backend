const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_URL_KEY'];

export function assertEnv() {
  const missing = REQUIRED.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
  if (missing.length > 0) {
    throw new Error(
      `Missing or empty required environment variable(s): ${missing.join(', ')}. ` +
      `Check .env.local locally, or the Environment Variables tab in Coolify.`
    );
  }
}