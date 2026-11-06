// V2.1.1: original procedural music + interaction sounds (Web Audio API).
// Browser audio is activated only by a user's gesture; no autoplay.
const KEY = 'pu-tourism-island-audio-v21';
let settings = { music: false, effects: false };
try { const saved = JSON.parse(localStorage.getItem(KEY) || '{}'); settings.music = saved.music === true; settings.effects = saved.effects === true; } catch {}
let context = null, musicBus = null, effectsBus = null, loopTimer = null, nextMusicTime = 0;
let userActivated = false;
const AudioConstructor = () => window.AudioContext || window.webkitAudioContext;
const musicButton = () => document.getElementById('toggle-music');
const effectsButton = () => document.getElementById('toggle-effects');
function save() { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {} }
function refresh() {
  const m = musicButton(), e = effectsButton();
  if (m) { m.textContent = settings.music ? '♫ 音樂開 ✓' : '♫ 音樂關'; m.setAttribute('aria-pressed', String(settings.music)); m.classList.toggle('active', settings.music); m.title = settings.music ? '關閉背景音樂' : '開啟背景音樂'; }
  if (e) { e.textContent = settings.effects ? '♪ 音效開 ✓' : '♪ 音效關'; e.setAttribute('aria-pressed', String(settings.effects)); e.classList.toggle('active', settings.effects); e.title = settings.effects ? '關閉互動音效' : '開啟互動音效（立即試聽）'; }
}
function ensureContext() {
  if (!context) {
    const AC = AudioConstructor();
    if (!AC) return null;
    context = new AC();
    musicBus = context.createGain(); musicBus.gain.value = 0;
    effectsBus = context.createGain(); effectsBus.gain.value = 0.55;
    musicBus.connect(context.destination); effectsBus.connect(context.destination);
  }
  return context;
}
function playTone(freq, when, length, bus, volume, type = 'sine') {
  if (!context || !bus) return;
  const o = context.createOscillator(), g = context.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, when);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(volume, when + 0.018);
  g.gain.exponentialRampToValueAtTime(0.0001, when + length);
  o.connect(g); g.connect(bus); o.start(when); o.stop(when + length + 0.04);
}
function setMusicVolume(on) {
  if (!context || !musicBus) return;
  const now = context.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(on ? 0.72 : 0, now + 0.09);
}
function scheduleBar(at) {
  const notes = [392, 440, 523.25, 659.25, 523.25, 440, 392, 329.63];
  notes.forEach((freq, i) => playTone(freq, at + i * 0.42, 0.55, musicBus, 0.075, 'sine'));
  playTone(196, at, 1.65, musicBus, 0.032);
  playTone(261.63, at + 1.68, 1.65, musicBus, 0.025);
}
function stopMusic() {
  if (loopTimer !== null) { clearInterval(loopTimer); loopTimer = null; }
  setMusicVolume(false); // Also mutes already-scheduled notes immediately.
}
function queueMusic() {
  if (!settings.music || !userActivated || !context || context.state !== 'running') return;
  while (nextMusicTime < context.currentTime + 1.1) {
    scheduleBar(nextMusicTime);
    nextMusicTime += 3.36;
  }
}
function startMusic() {
  if (!settings.music || !userActivated || !context || context.state !== 'running') return;
  if (loopTimer !== null) clearInterval(loopTimer);
  nextMusicTime = context.currentTime + 0.045;
  setMusicVolume(true); queueMusic();
  loopTimer = setInterval(queueMusic, 280);
}
async function activate() {
  userActivated = true;
  const c = ensureContext();
  if (!c) return false;
  try { if (c.state !== 'running') await c.resume(); } catch { return false; }
  return c.state === 'running';
}
export const audio = {
  init() {
    musicButton()?.addEventListener('click', async () => {
      settings.music = !settings.music;
      if (settings.music) {
        if (await activate()) startMusic();
        else { settings.music = false; window.alert('此瀏覽器無法啟動音樂，請確認網站及裝置的聲音播放權限。'); }
      } else stopMusic();
      save(); refresh();
    });
    effectsButton()?.addEventListener('click', async () => {
      settings.effects = !settings.effects;
      if (settings.effects) {
        if (await activate()) audio.effect('success');
        else { settings.effects = false; window.alert('此瀏覽器無法啟動音效，請確認網站及裝置的聲音播放權限。'); }
      }
      save(); refresh();
    });
    refresh();
  },
  unlock() {
    // Called from a real user click on the welcome screen.
    activate().then(ok => { if (ok && settings.music) startMusic(); });
  },
  effect(kind = 'click') {
    if (!settings.effects || !userActivated) return;
    const c = ensureContext(); if (!c || c.state !== 'running') return;
    const now = c.currentTime + 0.012;
    const seq = kind === 'success' ? [[523.25, 0], [659.25, .12], [783.99, .24]] :
      kind === 'cat' ? [[659.25, 0], [880, .12]] : kind === 'wrong' ? [[246.94, 0]] : [[587.33, 0]];
    seq.forEach(([f, offset]) => playTone(f, now + offset, kind === 'success' ? .27 : .16, effectsBus, .14));
  },
  stop() { stopMusic(); if (context) { context.close().catch(() => {}); context = null; musicBus = null; effectsBus = null; } }
};
