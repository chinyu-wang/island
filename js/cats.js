import * as THREE from 'three';
import {ringRoad} from './island.js';
const m=c=>new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:true});
function ell(parent,rx,ry,rz,color,x,y,z){const obj=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),m(color));obj.scale.set(rx,ry,rz);obj.position.set(x,y,z);obj.castShadow=true;parent.add(obj);return obj}
// Each patrol stays on the island's flat ground and beside the visible roads.
// Cat local coordinates start at paw level: Y=0 is the island surface.
// Cats share the precise ring-road vertices, so their route cannot drift off-road.
// Separate starting positions prevent the three cats from bunching up.
const ring = ringRoad.slice(0,-1);
const startAt = {'小橘':65,'阿灰':17,'小賓':37};
const routes=Object.fromEntries(Object.entries(startAt).map(([name,index])=>[
 name, [...ring.slice(index),...ring.slice(0,index),ring[index]]
]));
function cat(name,color,speech){const group=new THREE.Group();const body=new THREE.Group();group.add(body);
 ell(body,.36,.32,.6,color,0,.53,0);ell(body,.3,.3,.31,color,0,.91,.43);for(const x of [-.18,.18])for(const z of [-.4,.37])ell(body,.115,.28,.12,color,x,.29,z);
 for(const x of [-.2,.2]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.14,.31,3),m(color));ear.position.set(x,1.22,.47);ear.rotation.z=x>0?-.2:.2;body.add(ear)}
 for(const x of [-.125,.125])ell(body,.045,.057,.025,0x26353d,x,.98,.735);
 ell(body,.052,.035,.025,0xea9d9d,0,.83,.75);
 const tail=new THREE.Group();tail.position.set(0,.6,-.51);body.add(tail);ell(tail,.09,.1,.36,color,0,.08,-.27);ell(tail,.1,.12,.2,color,0,.18,-.53);
 const route=routes[name];group.position.set(route[0][0],.15,route[0][1]);group.userData.interact='cat:'+name;group.traverse(o=>o.userData.interact='cat:'+name);
 return{name,group,body,tail,route,routeIndex:0,direction:1,speech,state:'idle',time:1+Math.random()*2,target:new THREE.Vector3(route[1][0],.15,route[1][1]),speed:1.15+Math.random()*.35};
}
export function makeCats(root){const cats=[cat('小橘',0xe5a05c,['喵～歡迎來到觀光學院！','這座島上有好多好玩的地方喵～']),cat('阿灰',0x969fa6,['系友故事村好舒服，我要在這裡休息。','不要吵我，我正在研究貓咪觀光學。']),cat('小賓',0x343c42,['學生活動廣場最熱鬧！','今天想去機場搭飛機，喵～'])];for(const c of cats){if(c.name==='小賓'){ell(c.body,.18,.22,.31,0xffffff,0,.6,.27);ell(c.body,.13,.12,.12,0xffffff,0,.82,.65)}root.add(c.group)}return cats;}
export function updateCats(cats,dt,t,enabled=true){for(const c of cats){c.group.visible=enabled;if(!enabled)continue;
 // Ground height is constant, even when moving, pausing or sitting.
 c.group.position.y=.15;
 c.time-=dt;
 if(c.state==='walk'){
  const dx=c.target.x-c.group.position.x,dz=c.target.z-c.group.position.z,dist=Math.hypot(dx,dz);
  if(dist<.08){
   c.routeIndex+=c.direction;
   if(c.routeIndex>=c.route.length-1){c.routeIndex=c.route.length-1;c.direction=-1}
   if(c.routeIndex<=0){c.routeIndex=0;c.direction=1}
   const next=c.route[c.routeIndex+c.direction];c.target.set(next[0],.15,next[1]);
   c.state='idle';c.time=.6+Math.random()*1.6;
  }else{
   const step=Math.min(dist,dt*c.speed),vx=dx/dist,vz=dz/dist;
   c.group.position.x+=vx*step;c.group.position.z+=vz*step;
   c.group.rotation.y=Math.atan2(vx,vz);
   c.body.position.y=Math.abs(Math.sin(t*10))*.032;
   c.body.rotation.z=Math.sin(t*10)*.025;c.body.scale.y=1;
  }
 }else{
  c.body.position.y=0;c.body.rotation.z=0;
  c.body.scale.y=c.state==='sit'?.78:1;
  c.tail.rotation.y=Math.sin(t*3)*.35;
  if(c.time<=0){c.state=Math.random()<.24?'sit':'walk';c.time=c.state==='sit'?1+Math.random()*2.2:999}
 }
 }}
