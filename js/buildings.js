import * as THREE from 'three';import {box,cone,cylinder,clickable} from './island.js';
const white=0xfff9ee,windowBlue=0x70baca,wood=0x986954;
function roof(g,w,d,color,y=4){const m=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.78,1.7,4),new THREE.MeshStandardMaterial({color,flatShading:true}));m.rotation.y=Math.PI/4;m.position.y=y;m.castShadow=true;g.add(m)}
function windows(g,w,h,z=0){for(const x of [-w*.27,w*.27])for(const y of [1.9,3.1])box(g,.72,.85,.09,windowBlue,x,y,z+.12)}
function door(g,z){box(g,1.1,1.7,.13,wood,0,1,z+.18);box(g,.1,.1,.1,0xffd57c,.35,1.15,z+.28)}
export function createBuildings(root,locations){const anchors=[];for(const l of locations){const g=new THREE.Group();g.position.set(l.x,.3,l.z);root.add(g);const c=l.color;
  cylinder(g,3.75,.24,10,0xece4c9,0,.12,0);
  if(l.kind==='academy'){box(g,6.6,3.7,4.7,white,0,2.15,0);box(g,7.3,.55,5.4,c,0,4.2,0);for(const x of [-2.3,-.8,.8,2.3])cylinder(g,.25,2.7,8,0xffffff,x,1.7,2.5);box(g,7.3,.35,.55,c,0,3.4,2.6);box(g,1.6,2.4,.2,0x628f98,0,1.7,2.45);cylinder(g,.2,2,8,0xc8a66a,0,5.5,0);cone(g,.7,1.0,4,0xffe6ac,0,6.8,0)}
  else if(l.kind==='airport'){box(g,5.9,2.4,4.2,white,0,1.5,0);box(g,6.4,.45,4.5,c,0,2.95,0);for(const x of [-1.9,0,1.9])box(g,1.2,1.25,.12,windowBlue,x,1.85,2.15);box(g,1.8,4,1.7,0xffffff,2.2,3.55,-1.5);box(g,2.1,.9,2,c,2.2,5.65,-1.5);cylinder(g,.08,1.5,8,0xb8a887,2.2,6.9,-1.5);box(g,3,.25,.65,0xffffff,-3,1.2,3.8);box(g,.95,.25,2.3,0xffffff,-3,1.25,3.8)}
  else if(l.kind==='resort'){box(g,5,4,3.7,white,0,2.15,0);roof(g,6,4.3,0xc77e73,4.9);windows(g,4.3,3,1.85);door(g,1.86);box(g,1.7,.25,3.1,0x50bcd0,3,.3,1);cylinder(g,.15,2.3,7,wood,-3,.95,3);cone(g,2,1.5,8,0xf1ce81,-3,2.3,3)}
  else if(l.kind==='library'){box(g,5.6,4.1,4.5,0xf9f1df,0,2.2,0);roof(g,6.2,5,0x8072a6,5.1);for(const x of [-1.7,0,1.7])box(g,1.1,2.5,.15,windowBlue,x,2.5,2.35);box(g,2.2,1.7,.25,wood,0,1,2.5);box(g,2.3,.3,.2,c,0,4.3,2.55)}
  else if(l.kind==='plaza'){for(const x of [-1.9,1.9]){box(g,2.5,2.2,2.2,white,x,1.25,0);cone(g,2.1,1.5,4,c,x,3.25,0);box(g,1.3,1.5,.15,0x9c836b,x,.95,1.16)}for(const x of [-3,3])cylinder(g,.12,3,8,wood,x,1.5,3);box(g,6.6,.14,.14,c,0,3,3);for(const x of [-1.4,0,1.4])cylinder(g,.35,.22,6,0xf0c078,x,.25,3)}
  else if(l.kind==='honors'){box(g,5.3,3.6,4.6,0xf6edce,0,2,0);roof(g,5.8,5,0xe3b958,4.75);for(const x of [-1.8,0,1.8])cylinder(g,.22,3,8,white,x,1.9,2.43);cylinder(g,.7,.24,10,0xeec95f,0,4.9,0);cone(g,.65,1.1,5,0xffe695,0,5.6,0)}
  else if(l.kind==='village'){for(const [x,z] of [[-1.9,-1.1],[1.8,.7]]){box(g,3.1,2.6,2.7,white,x,1.55,z);roofAt(g,3.6,3.3,c,3.35,x,z);box(g,1.05,1.5,.16,wood,x,1.1,z+1.45);box(g,.65,.8,.12,windowBlue,x+1,2,z+1.42)} }
  else{box(g,5.7,3.2,4.3,white,0,1.85,0);roof(g,6.2,4.9,c,4.2);windows(g,4.8,3,2.14);door(g,2.16);if(l.kind==='admission'){box(g,4.5,.5,.5,c,0,3.5,2.3)} }
  g.userData.interact=l.id;g.traverse(o=>{if(o.isMesh){o.userData.interact=l.id;o.castShadow=true;o.receiveShadow=true}});clickable.push(g);anchors.push({location:l,position:new THREE.Vector3(l.x,6.8,l.z)});
 }return anchors;}
function roofAt(g,w,d,color,y,x,z){const m=cone(g,Math.max(w,d)*.72,1.5,4,color,x,y,z);m.rotation.y=Math.PI/4}
