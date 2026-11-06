// Original procedural ambient soundtrack and short UI sound effects, synthesized via Web Audio.
// No third-party audio files, copyright-restricted music, network requests, or autoplay.
const KEY='pu-tourism-island-audio-v21';
let settings={music:false,effects:false};try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
let context=null,musicNodes=[],musicLoop=null,enabled=false;
const AC=()=>window.AudioContext||window.webkitAudioContext;
function ctx(){if(!context&&AC())context=new (AC())();return context}
function note(freq,start,duration,{volume=.035,type='sine',destination=null}={}){
 const c=ctx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(volume,start+.045);g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(destination||c.destination);o.start(start);o.stop(start+duration+.02);
}
function playLoop(){if(!settings.music||!enabled||!context)return;const now=context.currentTime+.05;
 // Fresh original ambient motif, soft bell-like arpeggio in a pentatonic pitch set.
 const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66];
 notes.forEach((f,i)=>note(f,now+i*.49,.95,{volume:.018,type:'sine'}));
 note(130.81,now,3.85,{volume:.012,type:'sine'});
 note(196,now+1.96,1.9,{volume:.009,type:'sine'});
}
function stopMusic(){if(musicLoop){clearInterval(musicLoop);musicLoop=null}}
function startMusic(){stopMusic();if(!enabled||!settings.music)return;playLoop();musicLoop=setInterval(playLoop,3920)}
export const audio={
 init(){const music=document.querySelector('#toggle-music'),effects=document.querySelector('#toggle-effects');const refresh=()=>{music?.setAttribute('aria-pressed',String(settings.music));effects?.setAttribute('aria-pressed',String(settings.effects));if(music)music.textContent=settings.music?'♫ 音樂開':'♫ 音樂關';if(effects)effects.textContent=settings.effects?'♪ 音效開':'♪ 音效關'};
  music?.addEventListener('click',async()=>{enabled=true;settings.music=!settings.music;try{await ctx()?.resume()}catch{}startMusic();save();refresh()});
  effects?.addEventListener('click',async()=>{enabled=true;settings.effects=!settings.effects;try{await ctx()?.resume()}catch{}save();refresh();if(settings.effects)audio.effect('click')});
  refresh();
 },
 unlock(){enabled=true;try{ctx()?.resume();startMusic()}catch{}},
 effect(kind='click'){if(!settings.effects||!enabled)return;const c=ctx();if(!c)return;const now=c.currentTime+.01;const seq=kind==='success'?[[523,.0],[659,.12],[784,.24]]:kind==='cat'?[[660,0],[880,.1]]:kind==='wrong'?[[240,0]]:[[500,0]];seq.forEach(([f,t])=>note(f,now+t,kind==='success'?.32:.11,{volume:.032,type:'sine'}))},
 stop(){stopMusic();if(context){context.close().catch(()=>{});context=null}}
};
function save(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch{}}
