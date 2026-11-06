import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {locations,newsUrl} from '../data/locations.js';
import {createIsland,clickable} from './island.js';
import {createBuildings} from './buildings.js';
import {makeCats,updateCats} from './cats.js';
import {game} from './game.js';
import {catClues} from './missions.js';
import {initPassport} from './passport.js';
import {initChallenges} from './challenges.js';
import {audio} from './audio.js';
import {initRewards} from './rewards.js';
const $=s=>document.querySelector(s);
audio.init();
const scene=new THREE.Scene();scene.background=new THREE.Color(0xbceaf0);scene.fog=new THREE.Fog(0xbceaf0,75,170);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,350);camera.position.set(49,51,59);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;$('#scene').appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=29;controls.maxDistance=113;controls.maxPolarAngle=1.46;controls.minPolarAngle=.12;controls.target.set(0,0,0);controls.update();
const ambient=new THREE.HemisphereLight(0xffffff,0x66838f,2.1);scene.add(ambient);const sun=new THREE.DirectionalLight(0xfff2d8,3);sun.position.set(-27,60,32);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-47;sun.shadow.camera.right=47;sun.shadow.camera.top=47;sun.shadow.camera.bottom=-47;sun.shadow.normalBias=.04;scene.add(sun);const root=createIsland(scene);const anchors=createBuildings(root,locations);const cats=makeCats(root);
const labels=new Map();let showLabels=true,showCats=true;for(const a of anchors){const el=document.createElement('button');el.className='label';el.textContent=a.location.emoji+' '+a.location.name;el.addEventListener('click',()=>{audio.effect('click');openDetail(a.location.id)});$('#labels').append(el);labels.set(a.location.id,el)}
const list=$('#locations-list');for(const l of locations){const btn=document.createElement('button');btn.className='location-item';const icon=document.createElement('span');icon.className='emoji';icon.textContent=l.emoji;const body=document.createElement('span');const b=document.createElement('b');b.textContent=l.name;const s=document.createElement('small');s.textContent=l.menu;body.append(b,s);btn.append(icon,body);btn.onclick=()=>{audio.effect('click');openDetail(l.id)};list.append(btn)}
let flight=null;function go(x,z,top=false){const tgt=new THREE.Vector3(x,0,z);const pos=top?new THREE.Vector3(x+1,77,z+.1):new THREE.Vector3(x+28,31,z+33);flight={start:performance.now(),duration:850,fromC:camera.position.clone(),toC:pos,fromT:controls.target.clone(),toT:tgt}}
function hidePanels(){for(const id of ['sidebar','detail','passport','cat-dialog','challenge','rewards'])$('#'+id).hidden=true}function openDetail(id){hidePanels();const l=locations.find(v=>v.id===id);if(!l)return;$('#detail-icon').textContent=l.emoji;$('#detail-en').textContent=l.en;$('#detail-title').textContent=l.name;$('#detail-menu').textContent=l.menu;$('#detail-text').textContent=l.description;const el=$('#detail-links');el.replaceChildren();for(const [label,url] of l.links){const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;a.target='_blank';a.rel='noopener noreferrer';el.append(a)}const mission=$('#detail-mission');mission.replaceChildren();const task=document.createElement('button');task.className='primary';task.textContent=game.hasPlace(id)?'🏅 已完成！再次挑戰 →':'🎮 開始地標挑戰 →';task.onclick=()=>{hidePanels();challenges.open(id);audio.effect('click')};mission.append(task);$('#detail').hidden=false;go(l.x,l.z)}
function openNews(){hidePanels();$('#detail-icon').textContent='📣';$('#detail-en').textContent='LATEST NEWS';$('#detail-title').textContent='最新消息公告板';$('#detail-menu').textContent='動態消息';$('#detail-text').textContent='查看觀光系最新公告、活動與相關資訊，以官網更新為準。';const a=document.createElement('a');a.textContent='查看最新消息 ↗';a.href=newsUrl;a.target='_blank';a.rel='noopener noreferrer';$('#detail-links').replaceChildren(a);$('#detail-mission').replaceChildren();$('#detail').hidden=false;go(5,0)}
const challenges=initChallenges(game,()=>audio.effect('success'));
const passport=initPassport(game,locations,openDetail);
const rewards=initRewards(game);
document.querySelector('#passport-rewards').onclick=()=>rewards.open();
let activeCat=null;
function openCat(name){
 const c=cats.find(v=>v.name===name);if(!c)return;
 hidePanels();activeCat=c;
 const fresh=game.stampCat(name);audio.effect(fresh?'success':'cat');
 $('#cat-name').textContent='🐈 '+c.name;
 $('#cat-stamp-message').textContent=fresh?'✨ 新發現！已取得 '+name+' 的貓咪印章！':'✅ 已收藏 '+name+' 的貓咪印章';
 $('#cat-clue-text').hidden=true;$('#cat-go').hidden=true;
 const talk=()=>{$('#cat-speech').textContent='「'+c.speech[Math.floor(Math.random()*c.speech.length)]+'」'};
 $('#cat-talk').onclick=talk;talk();
 $('#cat-clue').onclick=()=>{
  const clue=catClues[name],loc=locations.find(l=>l.id===clue?.target);
  $('#cat-clue-text').textContent=clue?clue.invite+' '+clue.clue:'繼續探索整座島吧！';
  $('#cat-clue-text').hidden=false;$('#cat-go').hidden=!loc;
  if(loc)$('#cat-go').onclick=()=>{openDetail(loc.id)};
 };
 $('#cat-dialog').hidden=false;
}
$('#cat-close').onclick=()=>$('#cat-dialog').hidden=true;
$('#btn-missions').onclick=()=>{hidePanels();$('#sidebar').hidden=false;$('#sidebar').scrollTop=0};
$('#btn-list').onclick=()=>{const open=$('#sidebar').hidden;hidePanels();$('#sidebar').hidden=!open};$('#btn-help').onclick=()=>$('#modal').hidden=false;$('#modal-close').onclick=$('#btn-start').onclick=()=>{audio.unlock();$('#modal').hidden=true};for(const el of document.querySelectorAll('[data-close]'))el.onclick=()=>{$('#'+el.dataset.close).hidden=true};$('#btn-overview').onclick=()=>go(0,0);$('#btn-top').onclick=()=>go(0,0,true);$('#btn-labels').onclick=()=>{showLabels=!showLabels;$('#btn-labels').classList.toggle('active',showLabels);$('#labels').style.display=showLabels?'':'none'};$('#btn-cats').onclick=()=>{showCats=!showCats;$('#btn-cats').classList.toggle('active',showCats)};
const themes={morning:{bg:0xffe7cd,light:0xffc899,intensity:2.4,amb:1.55},day:{bg:0xbceaf0,light:0xfff2d8,intensity:3,amb:2.1},dusk:{bg:0xe9b4bb,light:0xffa36d,intensity:1.8,amb:1.2},night:{bg:0x142b50,light:0x9db6ff,intensity:.65,amb:.95}};
for(const b of document.querySelectorAll('[data-time]'))b.onclick=()=>{for(const n of document.querySelectorAll('[data-time]'))n.classList.toggle('active',n===b);const th=themes[b.dataset.time];scene.background.setHex(th.bg);scene.fog.color.setHex(th.bg);sun.color.setHex(th.light);sun.intensity=th.intensity;ambient.intensity=th.amb};
let down=null;const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects([...clickable,...cats.filter(c=>showCats).map(c=>c.group)],true);if(hit.length){let node=hit[0].object;while(node&&!node.userData.interact)node=node.parent;const id=node?.userData.interact;if(id==='news'){audio.effect('click');openNews()}else if(id?.startsWith('cat:'))openCat(id.slice(4));else if(id){audio.effect('click');openDetail(id)}}down=null});
const clock=new THREE.Clock();const tmp=new THREE.Vector3();function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;updateCats(cats,dt,t,showCats);if(flight){const p=Math.min(1,(performance.now()-flight.start)/flight.duration),ease=p*p*(3-2*p);camera.position.lerpVectors(flight.fromC,flight.toC,ease);controls.target.lerpVectors(flight.fromT,flight.toT,ease);if(p>=1)flight=null}controls.update();for(const a of anchors){const el=labels.get(a.location.id);tmp.copy(a.position).project(camera);const visible=tmp.z<1&&tmp.z>-1;el.style.display=visible?'':'none';if(visible){el.style.left=((tmp.x+1)*.5*innerWidth)+'px';el.style.top=((-tmp.y+1)*.5*innerHeight)+'px'}}renderer.render(scene,camera)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});frame();$('#loading').hidden=true;$('#modal').hidden=false;
