function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function clean(value, limit) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, limit);
}
module.exports = function handler(req, res) {
  const title = clean(req.query && req.query.title || 'موضوع تعليمي', 180);
  const text = clean(req.query && req.query.text || '', 12000);
  const date = clean(req.query && req.query.date || '', 100);
  const description = (text || 'شارك موضوعًا تعليميًا من EducaDouz.').slice(0, 400);
  const host = String(req.headers && req.headers.host || '').split(':')[0].toLowerCase();
  const allowedHosts = ['educadouz.vercel.app', 'educadouz-psi.vercel.app'];
  const origin = allowedHosts.includes(host) ? 'https://' + host : 'https://educadouz.vercel.app';
  const url = new URL(req.url || '/api/share', origin).toString();
  const body = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | EducaDouz</title><meta name="description" content="${escapeHtml(description)}"><meta property="og:type" content="article"><meta property="og:site_name" content="EducaDouz"><meta property="og:locale" content="ar_AR"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(url)}"><meta name="twitter:card" content="summary"><style>body{margin:0;background:#e6efff;color:#172554;font-family:Tahoma,Arial,sans-serif;line-height:1.9}.wrap{max-width:760px;margin:6vh auto;padding:24px}.card{background:#fff;border-radius:18px;padding:24px;box-shadow:0 6px 22px #123b9c22}h1{color:#1e3a8a;margin-top:0}.date{color:#64748b;font-size:14px}.text{white-space:pre-wrap;overflow-wrap:anywhere}.link{display:inline-block;background:#1e5bd0;color:#fff;text-decoration:none;border-radius:10px;padding:10px 16px;margin-top:18px;font-weight:bold}</style></head><body><main class="wrap"><article class="card"><h1>${escapeHtml(title)}</h1>${date ? `<p class="date">${escapeHtml(date)}</p>` : ''}<div class="text">${escapeHtml(text || 'لا يوجد نص مرفق بهذا الموضوع.')}</div><a class="link" href="${origin}/">زيارة موقع EducaDouz</a></article></main></body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).send(body);
};
