import {CAT_NAMES,catClues} from './missions.js';
export function initPassport(game,locations,goToLocation){
 const $=s=>document.querySelector(s),panel=$('#passport');
 const draw=()=>{
   const names=game.getCats(),count=names.length;
   $('#passport-count').textContent=`${count} / 10`;
   $('#btn-passport').querySelector('.count').textContent=count;
   $('#passport-rank').textContent=game.getRank();
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
   const award=$('#passport-award');award.textContent=count>=10?'🎉 十貓全員集合！你已集滿十隻貓。九大地標闖關與完整證書將在 V2.1／V2.2 開放。':count>=7?'🐾 已解鎖：尋貓探險家（7 隻）':count>=3?'🐾 已解鎖：尋貓見習生（3 隻）':`再找到 ${3-count} 隻貓，即可取得第一個尋貓稱號。`;
 };
 $('#btn-passport').onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden){document.querySelector('#sidebar').hidden=true;document.querySelector('#detail').hidden=true;draw()}};
 $('#passport-close').onclick=()=>panel.hidden=true;
 $('#passport-reset').onclick=()=>{if(confirm('確定要清除這個瀏覽器的尋貓集章紀錄嗎？此操作無法復原。')){game.reset();$('#passport-hint').textContent='探索十隻貓，找出牠們提供的地標線索！';$('#passport-go').hidden=true}};
 game.subscribe(draw);draw();
 return {open(){panel.hidden=false;draw()},close(){panel.hidden=true}};
}
