require('dotenv').config(); // load .env variables
const { Pool } = require('pg');

let pool = null;

/**
 * Initialize or return existing PostgreSQL pool
 * @returns {Pool} - PostgreSQL connection pool
 */
function init() {
  if (pool) return pool;

  const connectionString = process.env.POSTGRES_URL || 
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

  pool = new Pool({ connectionString });

  pool.on('error', (err) => {
    console.error('❌ Unexpected Postgres pool error', err);
    // Optionally exit process on fatal error:
    // process.exit(-1);
  });

  console.log('✅ Postgres pool initialized');
  return pool;
}

module.exports = { init };
