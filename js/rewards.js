// V2.2 reward studio. All illustrations are drawn locally with Canvas; no external image assets.
// Existing game progress and cats.js / locations.js remain untouched.
const TIERS=[
 {id:'welcome',title:'小橘迎賓限定圖卡',rank:'觀光島見習生',cats:3,places:1,kind:'card',filename:'小橘迎賓限定圖卡.png'},
 {id:'team',title:'三貓探險隊限定圖卡',rank:'觀光島探險家',cats:7,places:5,kind:'card',filename:'三貓探險隊限定圖卡.png'},
 {id:'allcats',title:'十貓全員集合',rank:'觀光島探險大師',cats:10,places:9,kind:'card',filename:'十貓全員集合.png'},
 {id:'certificate',title:'探險大師電子紀念證書',rank:'觀光島探險大師',cats:10,places:9,kind:'certificate',filename:'靜宜觀光島探險紀念證書.png'}
];
const CAT_COLORS=['#e5a05c','#969fa6','#343c42','#d6b18b','#f4eee1','#57463f','#f5f5ee','#b68b5c','#987366','#e9c878'];
const CAT_NAMES=['小橘','阿灰','小賓','奶茶','花花','黑糖','雪球','虎斑','可可','小麥'];
const $=s=>document.querySelector(s);
function rounded(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()}
function circle(ctx,x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
function text(ctx,str,x,y,size=25,color='#365656',weight=700,align='center'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px system-ui,"Noto Sans TC",sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(str,x,y)}
function cat(ctx,x,y,s,color,index=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 // Tail and body behind face; paws touch the ground, no raster assets.
 ctx.lineCap='round';ctx.strokeStyle=color;ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(24,29);ctx.bezierCurveTo(70,20,55,-28,44,-22);ctx.stroke();
 ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,25,37,42,0,0,Math.PI*2);ctx.fill();
 circle(ctx,0,-27,39,color);ctx.beginPath();ctx.moveTo(-35,-43);ctx.lineTo(-31,-90);ctx.lineTo(-4,-61);ctx.moveTo(35,-43);ctx.lineTo(31,-90);ctx.lineTo(4,-61);ctx.fill();
 ctx.fillStyle='#f2c8bd';ctx.beginPath();ctx.moveTo(-26,-50);ctx.lineTo(-24,-70);ctx.lineTo(-11,-57);ctx.moveTo(26,-50);ctx.lineTo(24,-70);ctx.lineTo(11,-57);ctx.fill();
 if([1,2,3,4,6,7,8,9].includes(index)){ctx.fillStyle=index===2?'#fff7e8':index===4||index===6?'#cba98c':'#f9e9d4';ctx.beginPath();ctx.ellipse(0,24,16,27,0,0,7);ctx.fill()}
 for(const dx of [-15,15]){circle(ctx,dx,-27,5,'#283a3f');circle(ctx,dx-1,-29,1.8,'#fff')}
 ctx.fillStyle='#c77878';ctx.beginPath();ctx.moveTo(-6,-12);ctx.lineTo(6,-12);ctx.lineTo(0,-5);ctx.fill();
 ctx.strokeStyle='#536166';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-5);ctx.quadraticCurveTo(-6,3,-12,-2);ctx.moveTo(0,-5);ctx.quadraticCurveTo(6,3,12,-2);ctx.stroke();
 for(const dx of [-18,18])circle(ctx,dx,58,13,color);
 ctx.restore()}
function island(ctx,w,h,baseY){ctx.save();ctx.fillStyle='#6cb6b3';ctx.beginPath();ctx.ellipse(w/2,baseY,w*.39,h*.07,0,0,7);ctx.fill();ctx.fillStyle='#e3c995';ctx.beginPath();ctx.ellipse(w/2,baseY-12,w*.4,h*.08,0,0,7);ctx.fill();ctx.fillStyle='#98c8a6';ctx.beginPath();ctx.ellipse(w/2,baseY-30,w*.38,h*.075,0,0,7);ctx.fill();for(let i=0;i<8;i++){const x=w*.18+i*w*.092;const y=baseY-45-Math.sin(i*1.2)*13;rounded(ctx,x-8,y-30,16,32,3,'#e2aa7e');ctx.fillStyle='#9b6571';ctx.beginPath();ctx.moveTo(x-14,y-29);ctx.lineTo(x,y-48);ctx.lineTo(x+14,y-29);ctx.fill()}ctx.restore()}
function renderArt(tier,nickname='探險者',preview=false){const certificate=tier.kind==='certificate';const w=certificate?1400:840,h=certificate?990:1100;const c=document.createElement('canvas');c.width=preview?Math.round(w*.5):w;c.height=preview?Math.round(h*.5):h;const ctx=c.getContext('2d');ctx.scale(c.width/w,c.height/h);
 const grad=ctx.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#fdf8e9');grad.addColorStop(1,certificate?'#e9f6ea':'#c9ecdf');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
 if(certificate){rounded(ctx,42,42,w-84,h-84,20,'#d6b57c');rounded(ctx,52,52,w-104,h-104,16,'#fffaf0');rounded(ctx,72,72,w-144,h-144,12,'#edf7ed');text(ctx,'PROVIDENCE TOURISM ISLAND',w/2,140,29,'#8a7754',750);text(ctx,'靜宜觀光島探險紀念證書',w/2,246,62,'#315f50',850);text(ctx,'CERTIFICATE OF ISLAND EXPLORATION',w/2,309,22,'#6e937c',600);text(ctx,nickname,w/2,415,54,'#6f6148',850);text(ctx,'榮獲「觀光島探險大師」稱號',w/2,500,37,'#315f50',780);text(ctx,'成功尋找十隻貓咪、完成九座地標挑戰',w/2,562,29,'#5b756b',650);text(ctx,'以好奇心與探索精神，完成這趟精彩的旅程！',w/2,610,27,'#5b756b',600);
 for(let i=0;i<10;i++)cat(ctx,155+i*120,762,.52,CAT_COLORS[i],i);
 text(ctx,'靜宜大學觀光事業學系 · 遊戲紀念證書（非正式學習認證）',w/2,897,21,'#7d8575',500);
 }else{rounded(ctx,26,26,w-52,h-52,34,'#fcf9ef');rounded(ctx,44,44,w-88,h-88,28,'#e5f5e8');
 text(ctx,'PROVIDENCE TOURISM ISLAND',w/2,111,21,'#698f80',800);text(ctx,tier.id==='welcome'?'小橘的島嶼邀請':tier.id==='team'?'三貓探險隊':'十貓全員集合',w/2,191,52,'#285d53',850);
 text(ctx,tier.rank,w/2,264,28,'#9b7852',750);island(ctx,w,h,710);
 if(tier.id==='welcome')cat(ctx,w/2,610,2.25,CAT_COLORS[0]);
 else if(tier.id==='team') [0,7,6].forEach((n,i)=>cat(ctx,230+i*195,620,1.5,CAT_COLORS[n],n));
 else {for(let i=0;i<10;i++)cat(ctx,126+(i%5)*147,480+Math.floor(i/5)*217,.92,CAT_COLORS[i],i)}
 rounded(ctx,125,831,w-250,80,40,'#f9e4b9');text(ctx,'探索 · 發現 · 收藏',w/2,872,29,'#795f41',750);text(ctx,'靜宜大學觀光事業學系',w/2,997,23,'#6e8b7e',650);
 }
 return c;
}
function download(canvas,filename){canvas.toBlob(blob=>{if(!blob){alert('圖片產生失敗，請再試一次。');return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)},'image/png')}
export function initRewards(game){const panel=$('#rewards'),grid=$('#reward-list'),preview=$('#reward-preview'),nickname=$('#reward-nickname'),toast=$('#reward-toast');let selected='welcome';let lastUnlocked=new Set();let initialized=false;let toastTimer;
 const unlocked=t=>game.getCats().length>=t.cats&&game.getPlaces().length>=t.places;
 function update(){const now=new Set(TIERS.filter(unlocked).map(t=>t.id));if(initialized){const added=[...now].filter(id=>!lastUnlocked.has(id));if(added.length){toast.textContent='🎁 解鎖新獎勵！前往護照查看限定圖卡';toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,5300)}}initialized=true;lastUnlocked=now;
 $('#reward-unlocked').textContent=`${now.size} / ${TIERS.length}`;
 grid.replaceChildren();for(const t of TIERS){const avail=unlocked(t),btn=document.createElement('button');btn.type='button';btn.className='reward-tile'+(selected===t.id?' selected':'');btn.setAttribute('aria-pressed',String(selected===t.id));const span=document.createElement('span');span.className='reward-tile-icon';span.textContent=avail?'🎁':'🔒';const body=document.createElement('span');const strong=document.createElement('strong');strong.textContent=t.title;const small=document.createElement('small');small.textContent=avail?'已解鎖，點選預覽':`需 ${t.cats} 貓 + ${t.places} 地標`;body.append(strong,small);btn.append(span,body);btn.onclick=()=>{selected=t.id;update()};grid.append(btn)}
 const t=TIERS.find(x=>x.id===selected);const avail=unlocked(t);const canDraw=avail;
 preview.replaceChildren();if(canDraw){const img=new Image();img.alt=t.title+' 圖片預覽';img.src=renderArt(t,nickname.value.trim().slice(0,16)||'探險者',true).toDataURL('image/png');preview.append(img)}else{const div=document.createElement('div');div.className='reward-locked';div.textContent=`🔒 尚未解鎖\n需找到 ${t.cats} 隻貓咪並完成 ${t.places} 座地標\n目前：${game.getCats().length} 貓 / ${game.getPlaces().length} 地標`;preview.append(div)}
 $('#reward-download').disabled=!avail;$('#reward-download').textContent=avail?'↓ 下載 PNG 圖片':'🔒 尚未解鎖';$('#reward-name-wrap').hidden=t.kind!=='certificate';$('#reward-description').textContent=t.kind==='certificate'?'輸入暱稱即可產生專屬紀念證書；留空會顯示「探險者」。不會上傳或儲存你的名字。':'解鎖後可下載收藏，圖卡採用原創低多邊形風格的貓咪配色。';
 }
 $('#reward-download').onclick=()=>{const t=TIERS.find(x=>x.id===selected);if(!unlocked(t))return;download(renderArt(t,nickname.value.trim().slice(0,16)||'探險者'),t.filename)};
 nickname.addEventListener('input',()=>{if(selected==='certificate')update()});$('#reward-close').onclick=()=>panel.hidden=true;
 $('#btn-rewards').onclick=()=>{for(const p of document.querySelectorAll('.panel'))p.hidden=true;panel.hidden=false;update()};
 $('#reward-toast').onclick=()=>{$('#btn-rewards').click();toast.hidden=true};
 game.subscribe(update);update();return{open(){for(const p of document.querySelectorAll('.panel'))p.hidden=true;panel.hidden=false;update()},close(){panel.hidden=true}};
}
