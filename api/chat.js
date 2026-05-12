const { getDb, initSchema, getConfig, getAllKnowledge } = require('../lib/db');
const { getActiveKey, tryRotateKey } = require('../lib/keyManager');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function buildSystemPrompt(intro, sections) {
  const kb = sections
    .map(s => `--- ${s.section} ---\n${s.content}`)
    .join('\n\n');
  return `${intro}\n\n=== SAWO KNOWLEDGE BASE ===\n\n${kb}\n\n=== END OF KNOWLEDGE BASE ===`;
}

async function callOpenRouter({ apiKey, model, baseURL, maxTokens, systemPrompt, messages }) {
  return fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://sawo.com',
      'X-Title': 'SAWO Chat Widget',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });
}

module.exports = async function handler(req, res) {
  // CORS preflight
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  const db = getDb();
  await initSchema(db);

  const [intro, model, baseURL, maxTokensStr, sections, apiKey] = await Promise.all([
    getConfig(db, 'system_prompt_intro'),
    getConfig(db, 'model'),
    getConfig(db, 'base_url'),
    getConfig(db, 'max_tokens'),
    getAllKnowledge(db),
    getConfig(db, 'api_key'),
  ]);

  if (!apiKey) return res.status(503).json({ error: 'No API key configured. Visit /admin to set one.' });

  const opts = {
    apiKey,
    model:      model    || 'openai/gpt-4o-mini',
    baseURL:    baseURL  || 'https://openrouter.ai/api/v1',
    maxTokens:  parseInt(maxTokensStr || '4096'),
    systemPrompt: buildSystemPrompt(intro || '', sections),
    messages,
  };

  let apiRes = await callOpenRouter(opts);

  // Auto-rotate key on auth failure and retry once
  if (apiRes.status === 401) {
    const newKey = await tryRotateKey(db);
    if (newKey) {
      apiRes = await callOpenRouter({ ...opts, apiKey: newKey });
    }
  }

  if (!apiRes.ok) {
    const errText = await apiRes.text();
    return res.status(apiRes.status).json({ error: `OpenRouter ${apiRes.status}: ${errText}` });
  }

  const data = await apiRes.json();
  const reply = data?.choices?.[0]?.message?.content ?? '(no response)';
  return res.status(200).json({ reply });
};
