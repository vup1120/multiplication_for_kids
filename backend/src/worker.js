// Visitor and game counter for 小豬快回家！
//   POST /e        record one event  (body: {"n":"start-normal","l":"de"})
//   GET  /stats    JSON totals, needs "Authorization: Bearer <STATS_TOKEN>"
//   GET  /         dashboard page
import dashboard from './dashboard.html';

const EVENTS = new Set(['pageview', 'start-normal', 'finish-normal', 'start-challenge', 'finish-challenge']);
const LANGS = new Set(['zh', 'de']);

const today = (offset = 0) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function cors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return allowed.includes(origin) ? {'Access-Control-Allow-Origin': origin, 'Vary': 'Origin'} : null;
}

const bump = (env, day, name, lang) => env.DB.prepare(
  'INSERT INTO counts (day, name, lang, count) VALUES (?1, ?2, ?3, 1) ON CONFLICT (day, name, lang) DO UPDATE SET count = count + 1'
).bind(day, name, lang);

async function record(request, env) {
  const headers = cors(request, env);
  if (!headers) return new Response('forbidden', {status: 403});
  let body;
  try { body = JSON.parse(await request.text()); } catch { return new Response('bad request', {status: 400, headers}); }
  const name = String(body?.n || ''), lang = String(body?.l || '');
  if (!EVENTS.has(name) || !LANGS.has(lang)) return new Response('bad request', {status: 400, headers});

  const day = today();
  const writes = [bump(env, day, name, lang)];
  if (name === 'pageview') {
    // Unique visitor per day: hash of IP + browser + daily salt; the raw values are never stored.
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const ua = request.headers.get('User-Agent') || '';
    const hash = await sha256(`${env.HASH_SECRET || ''}|${day}|${ip}|${ua}`);
    const inserted = await env.DB.prepare('INSERT OR IGNORE INTO visitors (day, hash) VALUES (?1, ?2)').bind(day, hash).run();
    if (inserted.meta.changes) writes.push(bump(env, day, 'visitor', lang));
  }
  await env.DB.batch(writes);
  return new Response(null, {status: 204, headers});
}

async function stats(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!env.STATS_TOKEN || auth !== `Bearer ${env.STATS_TOKEN}`) return new Response('unauthorized', {status: 401});
  const days = Math.min(366, Math.max(1, parseInt(new URL(request.url).searchParams.get('days'), 10) || 30));
  const since = today(-(days - 1));
  const {results: daily} = await env.DB.prepare('SELECT day, name, lang, count FROM counts WHERE day >= ?1 ORDER BY day').bind(since).all();
  const {results: allTime} = await env.DB.prepare('SELECT name, lang, SUM(count) AS count FROM counts GROUP BY name, lang').all();
  return Response.json({since, until: today(), daily, allTime}, {headers: {'Cache-Control': 'no-store'}});
}

export default {
  async fetch(request, env) {
    const {pathname} = new URL(request.url);
    if (request.method === 'OPTIONS' && pathname === '/e') {
      const headers = cors(request, env);
      return new Response(null, {status: headers ? 204 : 403, headers: {...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}});
    }
    if (request.method === 'POST' && pathname === '/e') return record(request, env);
    if (request.method === 'GET' && pathname === '/stats') return stats(request, env);
    if (request.method === 'GET' && pathname === '/') return new Response(dashboard, {headers: {'Content-Type': 'text/html; charset=utf-8'}});
    return new Response('not found', {status: 404});
  },
  async scheduled(event, env) {
    await env.DB.prepare('DELETE FROM visitors WHERE day < ?1').bind(today(-1)).run();
  }
};
