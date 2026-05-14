const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body ?? {};
  const { type, fname, lname, email, phone, country } = body;

  // ── validate basic info ──
  if (!fname || !lname || !email || !country) {
    return res.status(400).json({ error: 'Missing required fields: fname, lname, email, country' });
  }

  // ── build payload based on type ──
   let payload = { type, fname, lname, email, phone: phone || 'N/A', country };

//    let payload = {
//     ...body,
//     phone: body.phone || 'N/A',
//   };

  if (type === 'technical_support') {
    const { subject, productCategory, productName, productCode, describeIssue,
            serialNumber, purchaseInvoice, issue, addProductInfo } = body;

    payload = { ...payload, subject };

    if (subject === 'Repair Inquiry' || subject === 'technical_support - Repair Inquiry') {
      payload = { ...payload, productCategory, productName, productCode, describeIssue };
    }

    if (subject === 'Replacement Request') {
      payload = { ...payload, productName, serialNumber, productCode,
                  purchaseInvoice, issue, describeIssue,
                  addProductInfo: addProductInfo || null };
    }
  }

  if (type === 'customer_support') {
    const { subject, productCategory, describeIssue, orderNumber } = body;

    payload = { ...payload, subject };

    if (subject === 'Order Status') {
      payload = { ...payload, orderNumber, describeIssue };
    } else {
      payload = { ...payload, productCategory, describeIssue };
    }
  }

  if (type === 'general_inquiry') {
    const { subject, message } = body;
    payload = { ...payload, subject, message };
  }

//   console.log('CONTACT SUBMISSION:', { type, name, email, phone, country, subject, message });
//   return res.status(200).json({ ok: true });
//   return res.status(200).json({ type, name, email, phone, country, subject, message });

  // console.log('CONTACT SUBMISSION:', JSON.stringify(payload, null, 2));

    return res.status(200).json(payload);
};

