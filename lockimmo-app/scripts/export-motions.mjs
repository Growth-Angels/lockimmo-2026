#!/usr/bin/env node
/**
 * Export des motions en vidéo — rendu image par image, sans capture d'écran.
 *
 * Principe : on pilote Chrome via CDP (WebSocket natif de Node, aucune dépendance),
 * on met TOUTES les animations en pause, puis on force `currentTime` image par image
 * avant chaque capture. Le rendu est donc déterministe : aucune image sautée, aucune
 * dérive de timing, et la durée correspond exactement à un cycle de boucle.
 *
 * Prérequis : le serveur de dev doit tourner (npm run dev) — ou passer --base=<url>.
 *
 * Usage :
 *   node scripts/export-motions.mjs                     # tous les motions, MP4 1280×960 @60fps
 *   node scripts/export-motions.mjs data-transfer        # un seul motion
 *   node scripts/export-motions.mjs --fps=30 --scale=1   # allégé
 *   node scripts/export-motions.mjs --gif                # + un GIF par motion
 *   node scripts/export-motions.mjs --loops=2            # 2 cycles enchaînés
 */

import { spawn, execFile } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ─────────────────────────── options ─────────────────────────── */

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : dflt;
};
const has = (name) => argv.includes(`--${name}`);

const BASE = flag('base', 'http://localhost:5173');
const FPS = Number(flag('fps', 60));
const SCALE = Number(flag('scale', 2));       // 2 ⇒ 1280×960
const LOOPS = Number(flag('loops', 1));
const PORT = Number(flag('port', 9333));
const WANT_GIF = has('gif');
const WANT_PNG = has('png');
const OUT_DIR = flag('out', join(ROOT, 'exports'));
const ONLY = argv.filter((a) => !a.startsWith('--'));

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('✗ Aucun navigateur Chromium trouvé.');
  process.exit(1);
}

/* ─────────────────────── mini client CDP ─────────────────────── */

class CDP {
  #ws; #id = 0; #pending = new Map(); #waiters = [];

  static async attach(wsUrl) {
    const c = new CDP();
    c.#ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      c.#ws.addEventListener('open', res, { once: true });
      c.#ws.addEventListener('error', rej, { once: true });
    });
    c.#ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id != null && c.#pending.has(msg.id)) {
        const { resolve, reject } = c.#pending.get(msg.id);
        c.#pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        c.#waiters = c.#waiters.filter((w) => {
          if (w.method === msg.method) { w.resolve(msg.params); return false; }
          return true;
        });
      }
    });
    return c;
  }

  send(method, params = {}, sessionId) {
    const id = ++this.#id;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#ws.send(JSON.stringify({ id, method, params, ...(sessionId && { sessionId }) }));
    });
  }

  once(method, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const w = { method, resolve };
      this.#waiters.push(w);
      setTimeout(() => {
        this.#waiters = this.#waiters.filter((x) => x !== w);
        reject(new Error(`timeout: ${method}`));
      }, timeout).unref?.();
    });
  }

  close() { this.#ws.close(); }
}

/* ───────────────────────── utilitaires ───────────────────────── */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function evaluate(cdp, session, fn, arg) {
  const expression = `(${fn.toString()})(${JSON.stringify(arg ?? null)})`;
  const { result, exceptionDetails } = await cdp.send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true },
    session,
  );
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || 'evaluate failed');
  return result.value;
}

/* ─────────── code exécuté DANS la page (sérialisé) ─────────── */

// Mesure la scène et la durée de boucle, puis met toutes les animations en pause.
// La scène est repérée par [data-capture-stage] (posé par la page /capture/:id),
// ce qui rend la mesure indépendante de ses dimensions.
function pageProbe() {
  const stage = document.querySelector('[data-capture-stage]');
  if (!stage) return { error: 'scène introuvable ([data-capture-stage] absent)' };

  const r = stage.getBoundingClientRect();
  const rect = {
    x: Math.round(r.x), y: Math.round(r.y),
    width: Math.round(r.width), height: Math.round(r.height),
  };

  const anims = document.getAnimations();
  // Un mockup statique n'a aucune animation : ce n'est pas une erreur.
  if (!anims.length) return { cycle: 0, oddDurations: [], animCount: 0, rect };

  const durations = anims.map((a) => {
    const d = a.effect.getComputedTiming().duration;
    return typeof d === 'number' ? d : 0;
  }).filter((d) => d > 0);

  const cycle = Math.max(...durations);
  // Toute durée doit diviser le cycle, sinon la boucle exportée ne reboucle pas proprement.
  const odd = [...new Set(durations)].filter((d) => Math.abs(cycle / d - Math.round(cycle / d)) > 1e-6);

  anims.forEach((a) => a.pause());

  return { cycle, oddDurations: odd, animCount: anims.length, rect };
}

// Positionne toutes les animations sur l'instant t (ms). Les animations infinies
// gèrent elles-mêmes leur itération, donc un currentTime global suffit.
function pageSeek(t) {
  document.getAnimations().forEach((a) => { a.currentTime = t; });
  return document.getAnimations().length;
}

/* ────────────────────────── export ────────────────────────── */

async function exportMotion(cdp, session, id, tmpRoot) {
  const url = `${BASE}/capture/${id}?bare=1`;
  process.stdout.write(`\n▸ ${id}\n  chargement… `);

  await cdp.send('Page.navigate', { url }, session);
  await cdp.once('Page.loadEventFired');
  await evaluate(cdp, session, () => document.fonts.ready.then(() => true));
  await sleep(350); // laisse les polices s'appliquer et le layout se stabiliser

  const probe = await evaluate(cdp, session, pageProbe);
  if (probe.error) throw new Error(probe.error);
  if (probe.oddDurations.length) {
    console.log(`\n  ⚠︎ durées ne divisant pas le cycle: ${probe.oddDurations} — la boucle peut sauter`);
  }

  // ── Écran statique (mockup) ou mode --png : une seule image, pas de vidéo ──
  if (probe.cycle === 0 || WANT_PNG) {
    await mkdir(OUT_DIR, { recursive: true });
    const png = join(OUT_DIR, `${id}.png`);
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: false,
      clip: { ...probe.rect, scale: SCALE },
    }, session);
    await writeFile(png, Buffer.from(data, 'base64'));
    console.log(`ok — image ${probe.rect.width}×${probe.rect.height} ×${SCALE}`);
    return { png, frames: 1, cycleMs: 0 };
  }

  const cycleMs = probe.cycle;
  const frames = Math.round((cycleMs / 1000) * FPS) * LOOPS;
  console.log(`ok — cycle ${cycleMs / 1000}s, ${probe.animCount} animations → ${frames} images @${FPS}fps`);

  const dir = join(tmpRoot, id);
  await mkdir(dir, { recursive: true });

  const step = cycleMs / (frames / LOOPS);
  for (let f = 0; f < frames; f++) {
    await evaluate(cdp, session, pageSeek, f * step);
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      clip: { ...probe.rect, scale: SCALE },
    }, session);
    await writeFile(join(dir, String(f).padStart(5, '0') + '.png'), Buffer.from(data, 'base64'));
    if (f % 30 === 0 || f === frames - 1) {
      process.stdout.write(`\r  rendu ${f + 1}/${frames}   `);
    }
  }

  // ── assemblage ffmpeg ──
  await mkdir(OUT_DIR, { recursive: true });
  const mp4 = join(OUT_DIR, `${id}.mp4`);
  process.stdout.write(`\r  encodage mp4…            `);
  await execFileP('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-framerate', String(FPS),
    '-i', join(dir, '%05d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    mp4,
  ]);

  let gif = null;
  if (WANT_GIF) {
    gif = join(OUT_DIR, `${id}.gif`);
    process.stdout.write(`\r  encodage gif…            `);
    const palette = join(dir, 'palette.png');
    const vf = `fps=25,scale=640:-1:flags=lanczos`;
    await execFileP('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-vf', `${vf},palettegen=stats_mode=diff`, palette]);
    await execFileP('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-i', palette,
      '-lavfi', `${vf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3`, gif]);
  }

  await rm(dir, { recursive: true, force: true });
  return { mp4, gif, frames, cycleMs };
}

/* ──────────────────────────── main ──────────────────────────── */

(async () => {
  // le serveur de dev doit répondre
  try {
    const r = await fetch(BASE, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) throw new Error(String(r.status));
  } catch {
    console.error(`✗ ${BASE} ne répond pas. Lance le serveur de dev (npm run dev) ou passe --base=<url>.`);
    process.exit(1);
  }

  // liste des motions, lue depuis le registre pour rester synchronisée
  const registry = await import(join(ROOT, 'src/pages/Motion/registry.ts'))
    .then((m) => m.MOTIONS.map((x) => x.id))
    .catch(() => null);
  const ids = ONLY.length ? ONLY
    : registry ?? ['data-transfer', 'ai-automation', 'support-chat', 'academie', 'audit-scan', 'live-dashboard'];

  const profile = await mkdtemp(join(tmpdir(), 'motion-chrome-'));
  const tmpRoot = await mkdtemp(join(tmpdir(), 'motion-frames-'));

  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--window-size=1000,800', '--hide-scrollbars', '--force-color-profile=srgb',
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    'about:blank',
  ], { stdio: 'ignore' });

  let cdp, results = [];
  try {
    // attendre que l'endpoint CDP réponde
    let info;
    for (let i = 0; i < 60; i++) {
      try { info = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
      catch { await sleep(200); }
    }
    if (!info) throw new Error('Chrome n\'a pas exposé son endpoint de debug');

    cdp = await CDP.attach(info.webSocketDebuggerUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    console.log(`Export → ${OUT_DIR}   (${FPS} fps · ×${SCALE} · ${LOOPS} cycle${LOOPS > 1 ? 's' : ''})`);
    for (const id of ids) {
      try { results.push({ id, ...(await exportMotion(cdp, sessionId, id, tmpRoot)) }); }
      catch (e) { console.log(`\n  ✗ ${id}: ${e.message}`); results.push({ id, error: e.message }); }
    }
  } finally {
    cdp?.close();
    chrome.kill();
    await rm(profile, { recursive: true, force: true }).catch(() => {});
    await rm(tmpRoot, { recursive: true, force: true }).catch(() => {});
  }

  console.log('\n\n── Résultat ─────────────────────────────');
  for (const r of results) {
    if (r.error) { console.log(`✗ ${r.id.padEnd(16)} ${r.error}`); continue; }
    const files = (await readdir(OUT_DIR)).filter((f) => f.startsWith(r.id + '.'));
    const kind = r.cycleMs ? `${r.cycleMs / 1000}s · ${r.frames} img` : 'image fixe';
    console.log(`✓ ${r.id.padEnd(18)} ${kind.padEnd(18)} ${files.join(', ')}`);
  }
  console.log(`\n${OUT_DIR}`);
})();
