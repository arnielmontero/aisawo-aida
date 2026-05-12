const { getDb, initSchema, setConfig } = require('../../lib/db');

function authCheck(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  return token && token === process.env.ADMIN_TOKEN;
}

const SYSTEM_PROMPT_INTRO = `You are Maya, a friendly and knowledgeable customer support specialist at SAWO Inc. (sawo.com), a premium Finnish sauna company. You genuinely love saunas and care about helping customers.

YOUR PERSONALITY:
- Warm, conversational, and natural — like a real person chatting, not a robot listing facts.
- Enthusiastic about saunas but never over the top.
- Use natural language with contractions and casual transitions like Sure!, Great question!, Absolutely!, Happy to help! — but don't overuse them.
- When someone asks a simple question, give a simple human answer. Don't turn everything into a bullet list.
- Use bullet points ONLY when listing multiple distinct items. For single-topic answers, write in natural flowing sentences.
- Show empathy when relevant: That's a great choice!, I totally get that.

STRICT RULES:
1. You ONLY answer using the knowledge base provided below. No outside knowledge.
2. If something is NOT in the knowledge base, say it naturally: Hmm, I don't have that info on hand — I'd recommend reaching out to our team at info@sawo.com or visiting sawo.com directly, they'll be happy to help!
3. Never make up prices, specs, or details not in the knowledge base.
4. Never repeat or rephrase the user's question. Just answer naturally.
5. Keep answers concise — don't over-explain unless the topic needs depth.
6. At the end of every answer, naturally weave in a reference like a real person would. For example: "You can find more details on that here 👉 https://www.sawo.com/page/" or "Check it out on our site: https://www.sawo.com/page/" — vary the phrasing, keep it natural and conversational, never just drop a bare link.

REFERENCE URL MAP (pick the most relevant):
- General / About SAWO → https://www.sawo.com/about-us/
- All products overview → https://www.sawo.com/sawo-products/
- Sauna heaters (general) → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/
- Wall-mounted heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/wall-mounted-series/
- Tower heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/tower-series/
- Stone heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/stone-series/
- Floor heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/floor-series/
- Combi heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/combi-series/
- Dragonfire heaters → https://www.sawo.com/sawo-products/finnish-sauna/sauna-heaters/dragonfire-series/
- Sauna controls → https://www.sawo.com/sawo-products/finnish-sauna/sauna-controls/
- Sauna accessories → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/
- Pails & Ladles → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/pails-ladles/
- Thermometers → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/thermometers-combined-meters/
- Clocks & Sandtimers → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/clocks-sandtimers/
- Sauna lights → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/sauna-light/
- Headrests & Backrests → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/headrests-backrests/
- Doors & Handles → https://www.sawo.com/sawo-products/finnish-sauna/sauna-accessories/doors-handles/
- Benches & Floor Tiles → https://www.sawo.com/benches-and-floor-tiles/
- Kivistone → https://www.sawo.com/kivistone/
- Sauna rooms → https://www.sawo.com/sauna-rooms/
- Sauna interior designs → https://www.sawo.com/sauna-rooms/interior-designs/
- Wood panels & timbers → https://www.sawo.com/sauna-rooms/wood-panels-timbers/
- Steam products → https://www.sawo.com/sawo-products/steam-sauna/
- Steam generators → https://www.sawo.com/sawo-products/steam-sauna/steam-generators/
- Steam controls → https://www.sawo.com/sawo-products/steam-sauna/steam-controls/
- Steam accessories → https://www.sawo.com/sawo-products/steam-sauna/steam-accessories/
- Infrared sauna → https://www.sawo.com/sawo-products/infrared-sauna/
- FAQ / usage / maintenance → https://www.sawo.com/frequently-asked-questions/
- User manuals → https://www.sawo.com/user-manuals/
- Product catalogue → https://www.sawo.com/wp-content/uploads/2026/05/SAWO-Product-Catalogue-040526.pdf
- Contact / support → https://www.sawo.com/contact/
- Distributors → https://www.sawo.com/distributors/
- Careers → https://www.sawo.com/careers/
- Sustainability → https://www.sawo.com/about-us/sustainability/
- Latest news → https://www.sawo.com/latest-news/`;

const KNOWLEDGE_SECTIONS = [
  {
    section: 'ABOUT SAWO',
    content: `- SAWO stands for "Sauna World" — a comprehensive sauna provider.
- First major European sauna company to start manufacturing in Asia, beginning year 2000.
- Over 600 dedicated Filipino and Finnish professionals.
- Serves over 90 countries worldwide.
- Finnish management ensures authenticity and top quality.
- Member of Sauna from Finland association.
- Certifications: ISO 9001:2015 (Quality Management), ISO 14001:2015 (Environmental Management), PEFC (sustainable forestry).
- Social media: Facebook (SAWOsaunaworld), Instagram (@sawosauna), LinkedIn, YouTube (@SAWOsauna), TikTok (@sawosauna).`,
    sort_order: 1,
  },
  {
    section: 'PRODUCTS & CATEGORIES',
    content: `SAUNA HEATER SERIES:
Wall-Mounted Heaters: Nordex Ni2, Nordex Black Ni2, Nordex NS, Nordex Black NS, Nordex NB, Nordex Black NB, Nordex Mini Ni2, Nordex Mini Black Ni2, Nordex Mini NS, Nordex Mini Black NS, Nordex Mini NB, Nordex Mini Black NB, Nordex Combi NS, Nordex Combi Black NS, Nordex Mini Combi NS, Nordex Mini Combi Black NS, Mini NB, Mini Fibercoated NB, Mini X NS, Mini X NB, Mini X Fibercoated NS, Mini X Fibercoated NB, Mini Combi NS, Mini Combi Fibercoated NS, Scandia NS, Scandia NB, Scandia Fibercoated NS, Scandia Fibercoated NB, Scandia Combi NS, Scandia Combi Fibercoated NS, Krios Ni2, Krios NS, Krios NB.
Tower Heaters: SAWO30 Round/Wall/Corner (Ni2/NS/NB/Black variants), Tower Round/Wall/Corner (Ni2/Ni/NS/NB), Aries Round/Wall/Corner (Ni2/NS/NB/Black variants), Cubos Ni2/NS/NB, Phoenix Ni2/NS.
Stone Heaters: Cumulus Ni2/NS/NB, Nimbus NS, Nimbus Combi NS.
Floor Heaters: Taurus D NS, Helius NS, Krios Floor NS, Savonia NS/Fibercoated/Combi variants, Nordex Pro NS/Combi, Nordex S NS/Black/Combi variants, Nordex Floor NS/Black NS.
Combi Heaters: Taurus D Combi, Nordex Combi NS/Black, Nordex S Combi NS/Black, Nordex Mini Combi NS/Black, Nimbus Combi NS, Mini Combi NS/Fibercoated, Savonia Combi NS/Fibercoated.
Dragonfire Heaters: Heaterking Corner/Wall/Round NS, Fiberjungle NS, Scandifire Red/Black NS/NB, Minidragon Black/Red NS/NB.

SAUNA CONTROLS: Saunova 2.0 UI, Saunova 2.0 Built-In, Saunova 2.0 Power Controller, Saunova 2.0 Contactor Unit, Saunova Simple, Innova Classic 2.0, Innova Classic 2.0 Built-In, Innova 2.0 Power Controller, Innova 2.0 Contactor Unit, Innova Stainless Steel Touch, Innova Classic, Innova Classic Built-In.

SAUNA ACCESSORIES: Accessory Sets, Pails & Ladles, Thermometers & Combined Meters, Clocks & Sandtimers, Sauna Light and Covers, Headrest & Backrest, Doors & Handles, Benches & Floor Mat Tiles, Kivistone sauna stones.

SAUNA ROOMS: Standard and Glass Front Sauna Rooms. Cedar, aspen, spruce. 1-3 person to 6+ person. Built-in vents, moisture-resistant insulation, dimmable LED lighting, kiln-dried timber benches (straight and L-type). 30+ years building saunas in Finland.

STEAM PRODUCTS: Generators: STN-S, STN-W, STN, STE. Controls: Steam 2.0, Steam Stainless Touch, Steam STE. Accessories: Steam Door, Aroma Pump, Installation Stand, Venturi Pipe L/Straight, Demand Button.

INFRARED PRODUCTS: Infrared Sauna Room (cedar/aspen/spruce), Infrared Panels, Infrared Backrest, Interface Holder. Controls: Infrared 2.0 UI, Power Controller, Built-In Control.

SPARE PARTS & SENSORS: Innova & Saunova 2.0 Spare RJ12 Cables, Innova Light Extension Module, Silicon Wire, Humidity Sensor & Temperature for Bench, Second Temperature Sensor for Bench, Temperature Sensor.`,
    sort_order: 2,
  },
  {
    section: 'FINNISH SAUNA',
    content: `- Wooden room (walls, ceiling, benches) for relaxation.
- Heat source: electric heater or wood-burning heater warms sauna stones.
- "Löyly" = pouring water on hot stones — the defining Finnish sauna act.
- Electric heaters most common: convenient, fast, customizable.
- Recommended temperature: 60–90°C.
- Heating time: under 1 hour with proper insulation.`,
    sort_order: 3,
  },
  {
    section: 'BEST WOODS FOR SAUNA',
    content: `- Western Red Cedar: warm reddish color, moisture-resistant, great for outdoor saunas, natural insect/mold repelling scent.
- Common Aspen: creamy white, knotless, resistant to moisture/bacteria/fungi — great for commercial/public saunas.
- Finnish Spruce: light-yellow, even grain, durable, forest-like aroma aids breathing and relaxation.`,
    sort_order: 4,
  },
  {
    section: 'INSTALLATION FAQ',
    content: `- Ideal location: dry, good ventilation, waterproof floor (tile/cement/vinyl), floor drain recommended.
- Upper benches = hotter, lower benches = cooler.
- Do NOT paint or seal wood panels — leave bare.
- Floor drain not required but highly recommended.
- Indoor modular sauna: leave small gap between sauna and house walls for airflow.`,
    sort_order: 5,
  },
  {
    section: 'HEATER & STONES FAQ',
    content: `- Heater safe if installed by a qualified electrician. All SAWO heaters tested before delivery.
- Stones: store energy, vaporize water. Check yearly or every 500 hours. Replace crumbled stones.
- NEVER run heater without stones — fire risk.
- Use only SAWO-recommended stones. No ceramic or artificial stones — voids warranty.
- Water for stones: household-quality only. No chlorinated (pool) or seawater — damages heater.`,
    sort_order: 6,
  },
  {
    section: 'SAUNA USAGE FAQ',
    content: `- How often: as often as you like; most go 2–3x per week.
- How long: stay as long as comfortable. Leave immediately if uncomfortable.
- Do NOT use: full stomach, alcohol, heart problems or acute illness without doctor advice.
- Children: allowed under adult supervision; few minutes, moderate temp, lower benches.`,
    sort_order: 7,
  },
  {
    section: 'SAUNA MAINTENANCE',
    content: `Every session: use bench towels; after session leave heater on 30 min to dry, then open vents and door; empty pail, lift ladle to bench.
1-4x per year: check/clean/replace stones; check heating elements (replace ALL if any cracked/bent); wash surfaces with warm water + detergent (no ammonia/chlorine); can apply paraffin or sauna-safe wood oil to benches; clean heater with mild soap or SAWO Decalcifying solution; clean glass with window cleaner; tighten screws; clean floor drain.`,
    sort_order: 8,
  },
  {
    section: 'HEALTH BENEFITS',
    content: `- Lowers risk of stroke, hypertension, dementia, Alzheimer's.
- Detoxifies, improves circulation, accelerates muscle recovery.
- Eases stress, deepens sleep, improves brain and mental health, boosts immune system.`,
    sort_order: 9,
  },
  {
    section: 'CUSTOMIZED SOLUTIONS',
    content: `- Tailored sauna solutions for homes, offices, wellness areas.
- Guides from design to installation.
- International shipping available; times and costs vary by location.`,
    sort_order: 10,
  },
  {
    section: 'DISTRIBUTORS',
    content: `- Invite retail/online shops to join global distribution network.
- Apply at: sawo.com/distributors`,
    sort_order: 11,
  },
  {
    section: 'CONTACT',
    content: `- Technical Support: WhatsApp +63 949 759 4450 | help@sawo.com
- Global / Philippines: MEZ2 Estate, Basak, Lapu-Lapu City 6015, Cebu | Tel: +63 32 341 2233 | info@sawo.com
- Nordics / Finland: Satakunnankatu 31, 33210 Tampere | Tel: +358 40 038 3265 | finland@sawo.com
- Asia / Hong Kong: 2302, 23F, Cable TV Tower, 9 Hoi Shing Road, Tsuen Wan | Tel: +852 2417 1188 | hongkong@sawo.com
- Europe / Netherlands: De Vest 24, 5555 XL Valkenswaard | Tel: +358 40 016 8269 | europehub@sawo.com
- Website: sawo.com`,
    sort_order: 12,
  },
];

module.exports = async function handler(req, res) {
  if (!authCheck(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const db = getDb();
  await initSchema(db);

  // Seed config defaults
  await Promise.all([
    setConfig(db, 'system_prompt_intro', SYSTEM_PROMPT_INTRO),
    setConfig(db, 'model',    'openai/gpt-4o-mini'),
    setConfig(db, 'base_url', 'https://openrouter.ai/api/v1'),
    setConfig(db, 'max_tokens', '4096'),
  ]);

  // Clear existing knowledge rows and re-insert
  await db.execute('DELETE FROM knowledge');
  for (const row of KNOWLEDGE_SECTIONS) {
    await db.execute({
      sql: 'INSERT INTO knowledge (section, content, sort_order) VALUES (?, ?, ?)',
      args: [row.section, row.content, row.sort_order],
    });
  }

  return res.status(200).json({ ok: true, seeded: KNOWLEDGE_SECTIONS.length });
};
