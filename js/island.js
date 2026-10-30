import * as THREE from 'three';
export const clickable = [];
const mat=(c,roughness=1)=>new THREE.MeshStandardMaterial({color:c,roughness,flatShading:true});
export const palette={grass:mat(0x8ec585),grass2:mat(0x77b877),sand:mat(0xf2d7a5),road:mat(0xf4e5c9),trunk:mat(0x987258),leaf:mat(0x4c9b72),roof:mat(0x9d6755)};
export function box(parent,w,h,d,color,x=0,y=0,z=0,tag=null){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(tag)m.userData.interact=tag;parent.add(m);return m}
export function cone(parent,r,h,ns,color,x,y,z){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,ns),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
export function cylinder(parent,r,h,n,color,x,y,z){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
function rand(seed){let t=seed;return()=>{t=(t*1664525+1013904223)>>>0;return t/4294967296}}
const random=rand(245871);
// Road centre lines are also reused for tree clearance and safe cat patrols.
export const roadRoutes=[
 [[-22,-13],[-23,-7],[-24,0],[-23,8],[-17,17],[-7,20],[4,21],[15,18],[23,10],[24,2],[21,-9],[15,-16],[3,-19],[-10,-18],[-22,-13]],
 [[-23,1],[-12,2],[-7,0],[-4,-3]],
 [[-18,15],[-12,10],[-7,7],[-4,3]],
 [[-7,20],[-5,12],[-5,9]],
 [[15,18],[11,10],[8,8]],
 [[23,10],[15,6],[10,4]],
 [[21,-9],[13,-5],[7,-5]],
 [[-22,-13],[-15,-8],[-9,-7]],
 [[3,-19],[2,-13],[1,-11]]
];
const roadWidth=1.85;
function distanceToSegment(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1];const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)}
export function nearRoad(x,z,padding=0){return roadRoutes.some(route=>route.some((p,i)=>i&&distanceToSegment(x,z,route[i-1],p)<roadWidth/2+padding))}
function exportRoads(root){
 const edge=mat(0xcaa77b),paving=mat(0xf5e3c3);
 for(const route of roadRoutes){
  const curve=new THREE.CatmullRomCurve3(route.map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal',.5);
  const n=(route.length-1)*12,points=curve.getPoints(n);
  for(const [width,y,material] of [[roadWidth+.36,.047,edge],[roadWidth,.061,paving]]){
   const verts=[],indices=[];
   for(let i=0;i<points.length;i++){
    const v=points[i],prior=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)];
    let dx=next.x-prior.x,dz=next.z-prior.z,len=Math.hypot(dx,dz)||1;
    const nx=-dz/len,nz=dx/len;
    verts.push(v.x+nx*width/2,y,v.z+nz*width/2,v.x-nx*width/2,y,v.z-nz*width/2);
    if(i){const a=(i-1)*2,b=i*2;indices.push(a,b,a+1,b,b+1,a+1)}
   }
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geometry.setIndex(indices);geometry.computeVertexNormals();
   const road=new THREE.Mesh(geometry,material);road.receiveShadow=true;road.renderOrder=1;root.add(road);
  }
 }
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
