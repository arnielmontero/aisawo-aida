const { createClient } = require('@libsql/client');

function getDb() {
  return createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

async function initSchema(db) {
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS config (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS knowledge (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        section    TEXT    NOT NULL,
        content    TEXT    NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      args: [],
    },
  ]);
}

async function getConfig(db, key) {
  const r = await db.execute({ sql: 'SELECT value FROM config WHERE key = ?', args: [key] });
  return r.rows[0]?.value ?? null;
}

async function setConfig(db, key, value) {
  await db.execute({
    sql: 'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)',
    args: [key, String(value)],
  });
}

async function getAllKnowledge(db) {
  const r = await db.execute(
    'SELECT id, section, content, sort_order FROM knowledge ORDER BY sort_order ASC, id ASC'
  );
  return r.rows;
}

module.exports = { getDb, initSchema, getConfig, setConfig, getAllKnowledge };
