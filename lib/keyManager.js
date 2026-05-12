const { getConfig, setConfig } = require('./db');

async function getActiveKey(db) {
  return await getConfig(db, 'api_key');
}

// On 401: swap in the backup key from env, persist it, return it.
// If no backup key is configured, returns null (caller should surface an error).
async function tryRotateKey(db) {
  const backup = process.env.OPENROUTER_BACKUP_KEY;
  if (!backup) return null;
  await setConfig(db, 'api_key', backup);
  return backup;
}

module.exports = { getActiveKey, tryRotateKey };
