const { getDb, initSchema, getAllKnowledge } = require('../../lib/db');

function authCheck(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  return token && token === process.env.ADMIN_TOKEN;
}

module.exports = async function handler(req, res) {
  if (!authCheck(req)) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  await initSchema(db);

  if (req.method === 'GET') {
    const rows = await getAllKnowledge(db);
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { section, content, sort_order = 0 } = req.body ?? {};
    if (!section?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'section and content are required' });
    }
    await db.execute({
      sql: 'INSERT INTO knowledge (section, content, sort_order) VALUES (?, ?, ?)',
      args: [section.trim(), content.trim(), Number(sort_order)],
    });
    return res.status(201).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
