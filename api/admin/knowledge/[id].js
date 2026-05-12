const { getDb } = require('../../../lib/db');

function authCheck(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  return token && token === process.env.ADMIN_TOKEN;
}

module.exports = async function handler(req, res) {
  if (!authCheck(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const db = getDb();

  if (req.method === 'PUT') {
    const { section, content, sort_order = 0 } = req.body ?? {};
    if (!section?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'section and content are required' });
    }
    await db.execute({
      sql: 'UPDATE knowledge SET section = ?, content = ?, sort_order = ? WHERE id = ?',
      args: [section.trim(), content.trim(), Number(sort_order), id],
    });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM knowledge WHERE id = ?', args: [id] });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
