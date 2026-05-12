const { getDb, initSchema, getConfig, setConfig } = require('../../lib/db');

const ALLOWED_KEYS = ['system_prompt_intro', 'model', 'base_url', 'max_tokens', 'api_key'];

function authCheck(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  return token && token === process.env.ADMIN_TOKEN;
}

module.exports = async function handler(req, res) {
  if (!authCheck(req)) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  await initSchema(db);

  if (req.method === 'GET') {
    const pairs = await Promise.all(ALLOWED_KEYS.map(async k => [k, await getConfig(db, k)]));
    return res.status(200).json(Object.fromEntries(pairs));
  }

  if (req.method === 'PUT') {
    const body = req.body ?? {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_KEYS.includes(key) && value !== undefined) {
        await setConfig(db, key, value);
      }
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
