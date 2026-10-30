import * as THREE from 'three';
export const clickable = [];
const mat=(c,roughness=1)=>new THREE.MeshStandardMaterial({color:c,roughness,flatShading:true});
export const palette={grass:mat(0x8ec585),grass2:mat(0x77b877),sand:mat(0xf2d7a5),road:mat(0xf4e5c9),trunk:mat(0x987258),leaf:mat(0x4c9b72),roof:mat(0x9d6755)};
export function box(parent,w,h,d,color,x=0,y=0,z=0,tag=null){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(tag)m.userData.interact=tag;parent.add(m);return m}
export function cone(parent,r,h,ns,color,x,y,z){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,ns),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
export function cylinder(parent,r,h,n,color,x,y,z){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
function rand(seed){let t=seed;return()=>{t=(t*1664525+1013904223)>>>0;return t/4294967296}}
const random=rand(245871);
// V1.3: one continuous, tidy perimeter promenade. No dangling spurs.
// One shared centre-line is used for both pavement and cat patrols.
const ROAD_RX=25.0, ROAD_RZ=19.7;
export const ringRoad=Array.from({length:97},(_,i)=>{
 const a=Math.PI*2*i/96;
 return [ROAD_RX*Math.cos(a),ROAD_RZ*Math.sin(a)];
});
export const accessRoads=[];
export const roadRoutes=[ringRoad];
const roadWidth=1.75;
function distanceToSegment(x,z,a,b){
 const dx=b[0]-a[0],dz=b[1]-a[1];
 const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));
 return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);
}
export function nearRoad(x,z,padding=0){return ringRoad.some((p,i)=>i&&distanceToSegment(x,z,ringRoad[i-1],p)<roadWidth/2+padding)}
// Build horizontal ribbons explicitly in world X/Z; avoids plane rotation errors.
function strip(root,points,width,y,color){
 const verts=[],indices=[];
 const n=points.length-1;
 for(let i=0;i<n;i++){
  const prev=points[(i-1+n)%n],next=points[(i+1)%n],p=points[i];
  const dx=next[0]-prev[0],dz=next[1]-prev[1],len=Math.hypot(dx,dz);
  const nx=-dz/len,nz=dx/len;
  verts.push(p[0]+nx*width/2,y,p[1]+nz*width/2,p[0]-nx*width/2,y,p[1]-nz*width/2);
 }
 for(let i=0;i<n;i++){
  const j=(i+1)%n,a=i*2,b=j*2;
  indices.push(a,a+1,b,b,a+1,b+1);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();
 const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide}));
 mesh.receiveShadow=true;root.add(mesh);
}
function exportRoads(root){
 strip(root,ringRoad,roadWidth+.32,.12,0xc69d73);
 strip(root,ringRoad,roadWidth,.145,0xf5e7d0);
}
export function createIsland(scene){const root=new THREE.Group();scene.add(root);
 const sea=new THREE.Mesh(new THREE.CircleGeometry(110,96),new THREE.MeshStandardMaterial({color:0x58bfd0,roughness:.42,metalness:.08}));sea.rotation.x=-Math.PI/2;sea.position.y=-2.65;sea.receiveShadow=true;root.add(sea);
 // Layered rounded landmass; ellipses create an island rather than true-campus geometry.
 const shape=new THREE.Shape();const rx=30,rz=24;for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;const wave=1+.028*Math.sin(a*7)+.017*Math.cos(a*11);const x=rx*Math.cos(a)*wave,z=rz*Math.sin(a)*wave;i===0?shape.moveTo(x,z):shape.lineTo(x,z)}
 const geo=new THREE.ExtrudeGeometry(shape,{depth:2.5,bevelEnabled:true,bevelThickness:1.15,bevelSize:1.1,bevelSegments:2,steps:1,curveSegments:8});geo.rotateX(Math.PI/2);geo.translate(0,-1.15,0);const shore=new THREE.Mesh(geo,[palette.grass,palette.sand]);shore.position.y=0;shore.castShadow=true;shore.receiveShadow=true;root.add(shore);
 const dirt=new THREE.Mesh(new THREE.CylinderGeometry(31,27,2.6,48),palette.sand);dirt.scale.z=.8;dirt.position.y=-2.2;root.add(dirt);
 // Flat, highly visible road network: elevated a little above the grass to avoid z-fighting.
 // Each route is built as a horizontal ribbon, never as a tube buried in the ground.
 exportRoads(root);
 // little park pavilion and central announcement board
 cylinder(root,1.9,.4,12,0xc5aa79,0,.6,0);for(const x of [-1,1])for(const z of [-1,1])cylinder(root,.11,1.9,6,0xffffff,x,1.7,z);cone(root,2.9,1.25,8,0x56a99b,0,2.9,0);
 const notice=new THREE.Group();notice.position.set(5,.5,-.1);box(notice,2.8,1.85,.15,0x835c46,0,1.15,0);box(notice,2.5,1.55,.18,0xf8e5b5,0,1.2,.13);box(notice,.13,1,.15,0x8f684f,-1,0,0);box(notice,.13,1,.15,0x8f684f,1,0,0);notice.userData.interact='news';root.add(notice);clickable.push(notice);
 // Trees & pastel flowers avoid the buildings and central roads
 const safe=(x,z)=>Math.pow(x/29,2)+Math.pow(z/23,2)<.86&&Math.hypot(x,z)>8;
 for(let i=0;i<130;i++){const x=(random()-.5)*57,z=(random()-.5)*45;if(!safe(x,z)||nearRoad(x,z,1.0))continue;const near=[[-16,-10],[0,-6],[16,-10],[19,4],[11,16],[-5,17],[-18,12],[3,5],[-19,0]].some(p=>Math.hypot(x-p[0],z-p[1])<5.4);if(near)continue;
  const r=.5+random()*.6;const tr=cylinder(root,.17*r,1.6*r,6,0x956e4e,x,.93*r,z);const foliage=cone(root,1.0*r,2.2*r,6,[0x5eae76,0x47996b,0x83b87a][i%3],x,2.45*r,z);foliage.rotation.y=random()*Math.PI;
 }
 for(let i=0;i<150;i++){const x=(random()-.5)*55,z=(random()-.5)*44;if(!safe(x,z)||nearRoad(x,z,.4))continue;const near=[[-16,-10],[0,-6],[16,-10],[19,4],[11,16],[-5,17],[-18,12],[3,5],[-19,0]].some(p=>Math.hypot(x-p[0],z-p[1])<3.5);if(near)continue;const color=[0xffd5aa,0xfac2c9,0xffffff,0xe6c4f7][i%4];cylinder(root,.095,.12,5,color,x,.29,z)}
 // boats / island details
 box(root,4,.3,1.2,0xf4eadc,24,-1.5,15);box(root,.17,1.2,.15,0x866e5b,24,-.7,15);
 for(const [x,z] of [[-31,6],[34,-7],[9,30]]){const boat=new THREE.Group();boat.position.set(x,-2.4,z);box(boat,2,.36,.8,0xffffff,0,.2,0);cone(boat,.85,1.45,3,0xfff6df,0,1.15,0);root.add(boat)}
 return root;
}
