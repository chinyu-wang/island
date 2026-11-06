import {CAT_NAMES,catClues} from './missions.js';
export function initPassport(game,locations,goToLocation){
 const $=s=>document.querySelector(s),panel=$('#passport');
 const draw=()=>{
   const names=game.getCats(),count=names.length;
   $('#passport-count').textContent=`${count} / 10`;
   $('#btn-passport').querySelector('.count').textContent=count;
   $('#passport-rank').textContent=game.getRank();
   $('#passport-full-rank').textContent=game.getRank();
   $('#passport-place-count').textContent=game.getPlaces().length+' / 9';
   $('#passport-progress').style.width=`${count*10}%`;
   const grid=$('#cat-stamps');grid.replaceChildren();
   for(const name of CAT_NAMES){
     const found=game.hasCat(name),btn=document.createElement('button');btn.className='stamp '+(found?'collected':'');
     const symbol=document.createElement('span');symbol.textContent=found?'🐾':'？';symbol.className='stamp-symbol';
     const t=document.createElement('span');t.textContent=found?name:'未發現';btn.append(symbol,t);
     btn.title=found?`查看${name}的線索`:'尚未找到，請在環島步道尋找';
     btn.onclick=()=>{if(!found)return;const clue=catClues[name];const l=locations.find(x=>x.id===clue.target);$('#passport-hint').textContent=`${name}說：「${clue.clue}」`;$('#passport-go').hidden=!l;$('#passport-go').onclick=()=>{panel.hidden=true;goToLocation(l.id)}};
     grid.append(btn);
   }
   const placesGrid=$('#place-stamps');placesGrid.replaceChildren();
   for(const l of locations){const found=game.hasPlace(l.id),btn=document.createElement('button');btn.className='place-stamp '+(found?'collected':'');btn.textContent=(found?'🏅 ':'🔎 ')+l.name;btn.title=found?'已獲地標徽章，點擊可再次探索':'點擊前往地標並開始挑戰';btn.onclick=()=>{panel.hidden=true;goToLocation(l.id)};placesGrid.append(btn)}
   const award=$('#passport-award');const countPlaces=game.getPlaces().length;
   award.textContent=count===10&&countPlaces===9?'🎉 十貓與九大地標全部完成！電子紀念證書與十貓全員集合圖卡已解鎖！':count>=7&&countPlaces>=5?'🐾 已達成：觀光島探險家':count>=3&&countPlaces>=1?'🐾 已達成：觀光島見習生':`已探索 ${count} 隻貓咪、${countPlaces} 座地標。繼續前進吧！`;

 };
 $('#btn-passport').onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden){document.querySelector('#sidebar').hidden=true;document.querySelector('#detail').hidden=true;draw()}};
 $('#passport-close').onclick=()=>panel.hidden=true;
 $('#passport-reset').onclick=()=>{if(confirm('確定要清除這個瀏覽器的全部貓咪印章及地標徽章嗎？此操作無法復原。')){game.reset();$('#passport-hint').textContent='探索十隻貓，找出牠們提供的地標線索！';$('#passport-go').hidden=true}};
 game.subscribe(draw);draw();
 return {open(){panel.hidden=false;draw()},close(){panel.hidden=true}};
}
