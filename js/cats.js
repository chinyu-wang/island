import * as THREE from 'three';
const m=c=>new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:true});
function ell(parent,rx,ry,rz,color,x,y,z){const obj=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),m(color));obj.scale.set(rx,ry,rz);obj.position.set(x,y,z);obj.castShadow=true;parent.add(obj);return obj}
function cat(name,color,area,speech){const group=new THREE.Group();const body=new THREE.Group();group.add(body);
 ell(body,.36,.32,.6,color,0,.53,0);ell(body,.3,.3,.31,color,0,.91,.43);for(const x of [-.18,.18])for(const z of [-.4,.37])ell(body,.115,.28,.12,color,x,.29,z);
 for(const x of [-.2,.2]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.14,.31,3),m(color));ear.position.set(x,1.22,.47);ear.rotation.z=x>0?-.2:.2;body.add(ear)}
 for(const x of [-.125,.125])ell(body,.045,.057,.025,0x26353d,x,.98,.735);
 ell(body,.052,.035,.025,0xea9d9d,0,.83,.75);
 const tail=new THREE.Group();tail.position.set(0,.6,-.51);body.add(tail);ell(tail,.09,.1,.36,color,0,.08,-.27);ell(tail,.1,.12,.2,color,0,.18,-.53);
 group.position.set(area[0],.4,area[1]);group.userData.interact='cat:'+name;group.traverse(o=>o.userData.interact='cat:'+name);
 return{name,group,body,tail,area,speech,state:'idle',time:0,target:new THREE.Vector3(area[0],.4,area[1]),speed:1.2+Math.random()*.4};}
export function makeCats(root){const cats=[cat('小橘',0xe5a05c,[1,-13],['喵～歡迎來到觀光學院！','這座島上有好多好玩的地方喵～']),cat('阿灰',0x969fa6,[-23,-2],['系友故事村好舒服，我要在這裡休息。','不要吵我，我正在研究貓咪觀光學。']),cat('小賓',0x343c42,[-18,17],['學生活動廣場最熱鬧！','今天想去機場搭飛機，喵～'])];for(const c of cats){if(c.name==='小賓'){ell(c.body,.18,.22,.31,0xffffff,0,.6,.27);ell(c.body,.13,.12,.12,0xffffff,0,.82,.65)}root.add(c.group)}return cats;}
export function updateCats(cats,dt,t,enabled=true){for(const c of cats){c.group.visible=enabled;if(!enabled)continue;c.time-=dt;if(c.time<=0){if(c.state==='walk'){c.state='idle';c.time=1+Math.random()*2.6}else{if(Math.random()<.28){c.state='sit';c.time=1.2+Math.random()*3}else{c.state='walk';c.time=2.5+Math.random()*3.5;const a=Math.random()*Math.PI*2,r=1.8+Math.random()*4;c.target.set(c.area[0]+Math.cos(a)*r,.4,c.area[1]+Math.sin(a)*r)}}}
  if(c.state==='walk'){const delta=c.target.clone().sub(c.group.position);delta.y=0;if(delta.length()>.12){const move=Math.min(delta.length(),dt*c.speed);delta.normalize();c.group.position.addScaledVector(delta,move);c.group.rotation.y=Math.atan2(delta.x,delta.z);c.body.position.y=Math.abs(Math.sin(t*10))*.07;c.body.rotation.z=Math.sin(t*10)*.035}else c.time=0;c.body.scale.y=1}
  else{c.body.position.y=0;c.body.scale.y=c.state==='sit'?.78:1;c.tail.rotation.y=Math.sin(t*3)*.35;c.body.rotation.z=0}
 }}
