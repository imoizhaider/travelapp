const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[DB] FATAL: DATABASE_URL is not set');
}

const redactedUrl = DATABASE_URL
  ? DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
  : 'MISSING';
console.log('[DB] DATABASE_URL:', redactedUrl);
console.log('[DB] NODE_ENV:', process.env.NODE_ENV);

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected database pool error:', err.message);
});

module.exports = pool;