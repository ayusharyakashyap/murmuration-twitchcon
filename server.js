import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };
let liveSeq = 0;
const liveEvents = [];
function json(res, status, value) { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); }
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (req.method === 'GET' && pathname === '/api/live/poll') {
    const after = Number(new URL(req.url, 'http://localhost').searchParams.get('after') || 0);
    const events = after ? liveEvents.filter(event => event.seq > after) : liveEvents.slice(-32);
    return json(res, 200, {cursor:events.at(-1)?.seq || liveSeq, events:events.map(({seq,...event}) => ({seq,...event}))});
  }
  if (req.method === 'POST' && pathname === '/api/live/push') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 4000) req.destroy(); });
    req.on('end', () => {
      try {
        const event = JSON.parse(raw || '{}');
        if (!['message','ritual','biome','reset'].includes(event.type)) return json(res, 400, {error:'Unknown live event.'});
        if (event.type === 'message') { event.user=String(event.user||'viewer').slice(0,32); event.text=String(event.text||'').slice(0,400); }
        if (event.type === 'ritual' && !['gather','bloom','ripple'].includes(event.name)) return json(res, 400, {error:'Unknown ritual.'});
        if (event.type === 'biome' && !['aurora','ember','ocean','meadow'].includes(event.name)) return json(res, 400, {error:'Unknown biome.'});
        event.seq = ++liveSeq; liveEvents.push(event); if (liveEvents.length > 400) liveEvents.splice(0,liveEvents.length-400);
        return json(res, 202, {ok:true,seq:event.seq});
      } catch { return json(res, 400, {error:'Invalid event.'}); }
    });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/interpret') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 12000) req.destroy(); });
    req.on('end', async () => {
      const key = req.headers['x-openai-key'];
      if (!key) { res.writeHead(400, {'Content-Type':'application/json'}); return res.end(JSON.stringify({error:'Add an OpenAI API key to enable narration.'})); }
      try {
        const { messages = [] } = JSON.parse(raw || '{}');
        const safeMessages = messages.slice(-16).map(m => `${String(m.user || 'viewer').slice(0,24)}: ${String(m.text || '').slice(0,180)}`).join('\n');
        const upstream = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ model:'gpt-4.1-mini', instructions:'You are the collective memory of a Twitch chat. Read the recent messages and write exactly one vivid, warm sentence (maximum 14 words) describing the shared mood or surprising idea emerging among these people. Do not quote a person, mention AI, or invent events. If messages are chaotic, make the chaos poetic.', input:`Recent chat:\n${safeMessages}`, max_output_tokens:60 })
        });
        const result = await upstream.json();
        if (!upstream.ok) { res.writeHead(upstream.status, {'Content-Type':'application/json'}); return res.end(JSON.stringify({error: result.error?.message || 'OpenAI narration request failed.'})); }
        const sentence = (result.output_text || '').trim().replace(/^['"“]|['"”]$/g, '');
        res.writeHead(200, {'Content-Type':'application/json','Cache-Control':'no-store'});
        res.end(JSON.stringify({sentence}));
      } catch { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Could not create a collective memory.'})); }
    });
    return;
  }
  const requested = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!requested.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(requested, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(requested)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(data);
  });
});
server.listen(process.env.PORT || 4173, '127.0.0.1', () => console.log(`Murmuration is ready at http://localhost:${process.env.PORT || 4173}`));
