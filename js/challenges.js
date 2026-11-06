import {activities} from './activities.js?v=20261106-quiz';
const $=s=>document.querySelector(s);
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
const button=(text,fn,cls='mission-option')=>{const b=node('button',cls,text);b.type='button';b.onclick=fn;return b};
export function initChallenges(game,onAward){
 const panel=$('#challenge'),body=$('#challenge-body');let active=null;
 $('#challenge-close').onclick=()=>panel.hidden=true;
 function open(id){const activity=activities[id];if(!activity)return;const questions=activity.questions?(activity.randomCount?[...activity.questions].sort(()=>Math.random()-.5).slice(0,activity.randomCount):activity.questions):null;
  active={id,a:activity,questions,step:0,seen:new Set(),selected:new Set(),finished:false,replaying:false};$('#challenge-title').textContent=activity.title;panel.hidden=false;render();}
 function finish(){if(!active)return;active.finished=true;const fresh=game.stampPlace(active.id);if(fresh)onAward?.();render();}
 function render(){if(!active)return;const s=active,a=s.a;body.replaceChildren();const add=el=>body.append(el);
  if(s.finished||(game.hasPlace(s.id)&&!s.replaying)){
   add(node('div','mission-success','🏅 '+(s.finished?'闖關完成！':'這座地標的徽章已經收藏！')));
   add(node('p','mission-copy','恭喜取得「'+a.title+'」地標徽章。你可以繼續閱讀系網資訊，或重新體驗這個關卡。'));
   if(a.outro)add(node('p','mission-note',a.outro));
   add(button('再玩一次',()=>{s.finished=false;s.replaying=true;s.step=0;s.lastCard=null;s.seen.clear();s.selected.clear();render()},'mission-secondary'));
   add(button('關閉，繼續探索',()=>panel.hidden=true,'primary'));return;
  }
  add(node('p','mission-copy',a.intro));
  if(a.type==='quiz'){
   const q=s.questions[s.step];add(node('div','mission-step',`第 ${s.step+1} / ${s.questions.length} 題`));add(node('h3','mission-question',q.q));
   const feedback=node('p','mission-feedback','');
   q.options.forEach((option,i)=>add(button(option,()=>{
     if(i!==q.correct){feedback.textContent='再試試看！提示：'+q.why;feedback.className='mission-feedback wrong';return}
     feedback.textContent='答對了！'+q.why;feedback.className='mission-feedback right';for(const b of body.querySelectorAll('.mission-option'))b.disabled=true;
     add(button(s.step+1===s.questions.length?'取得地標徽章 →':'下一題 →',()=>{s.step++;if(s.step>=s.questions.length)finish();else render()},'primary'));
   })));
   add(feedback);
   add(button('給我一點提示',()=>{feedback.textContent=q.why},'mission-secondary'));
  }else if(a.type==='cards'||a.type==='explore'){
   const required=a.required||a.cards.length;add(node('p','mission-step',`已探索 ${s.seen.size} / ${required} 張卡片`));
   for(const [i,c] of a.cards.entries())add(button((s.seen.has(i)?'✓ ':'◈ ')+c.title,()=>{s.seen.add(i);s.lastCard=c.body;render()},'mission-option'));
   const description=node('p','mission-card-desc',s.lastCard||'點選卡片查看介紹');description.id='mission-card-desc';add(description);
   function renderCardDesc(text){description.textContent=text}
   function showFinish(){if(!body.querySelector('.mission-finish'))add(button('完成探索，領取徽章 →',finish,'primary mission-finish'))}
   if(s.seen.size>=required)showFinish();
   if(a.outro)add(node('p','mission-note',a.outro));
  }else if(a.type==='choice'){
   add(node('h3','mission-question','你最想體驗哪一項？'));
   a.options.forEach(o=>add(button(o.title,()=>{s.selected=new Set([o.title]);renderChoice(o)},'mission-option')));
   const info=node('div','mission-choice-detail','');add(info);
   function renderChoice(o){info.replaceChildren(node('h3','',o.title),node('p','',o.body),button('領取地標徽章 →',finish,'primary'))}
   if(a.outro)add(node('p','mission-note',a.outro));
  }else if(a.type==='multi'){
   const count=a.required||2;add(node('div','mission-step',`已選 ${s.selected.size} / ${count} 項`));
   for(const o of a.options)add(button((s.selected.has(o)?'✓ ':'＋ ')+o,()=>{if(s.selected.has(o))s.selected.delete(o);else if(s.selected.size<count)s.selected.add(o);render()},'mission-option'));
   if(s.selected.size===count){add(node('p','mission-feedback right','你的大學生活提案：'+[...s.selected].join('、')));add(button('完成提案，領取徽章 →',finish,'primary'))}
   if(a.outro)add(node('p','mission-note',a.outro));
  }
 }
 return {open,close:()=>panel.hidden=true};
}
