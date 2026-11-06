import {CAT_NAMES} from './missions.js';
import {activities} from './activities.js';
const KEY='pu-tourism-island-v2-progress';
const validPlaces=Object.keys(activities);
let stored={};try{stored=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
const cats=new Set(Array.isArray(stored.cats)?stored.cats.filter(x=>CAT_NAMES.includes(x)):[]);
const places=new Set(Array.isArray(stored.places)?stored.places.filter(x=>validPlaces.includes(x)):[]);
const watchers=new Set();
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:21,cats:[...cats],places:[...places]}))}catch{}watchers.forEach(fn=>fn())}
export const game={
 hasCat:name=>cats.has(name),hasPlace:id=>places.has(id),
 stampCat(name){if(!CAT_NAMES.includes(name)||cats.has(name))return false;cats.add(name);persist();return true},
 stampPlace(id){if(!validPlaces.includes(id)||places.has(id))return false;places.add(id);persist();return true},
 getCats:()=>CAT_NAMES.filter(x=>cats.has(x)),getPlaces:()=>validPlaces.filter(x=>places.has(x)),
 getRank(){return cats.size===10&&places.size===9?'觀光島探險大師':cats.size>=7&&places.size>=5?'觀光島探險家':cats.size>=3&&places.size>=1?'觀光島見習生':cats.size>=10?'十貓收藏家':cats.size>=7?'尋貓探險家':cats.size>=3?'尋貓見習生':'新手探險者'},
 subscribe(fn){watchers.add(fn);return()=>watchers.delete(fn)},
 reset(){cats.clear();places.clear();persist()}
};
