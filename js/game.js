import {CAT_NAMES} from './missions.js';
const KEY='pu-tourism-island-v2-progress';
function read(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');return Array.isArray(raw.cats)?raw.cats.filter(n=>CAT_NAMES.includes(n)):[]}catch{return []}}
const stamps=new Set(read());
const watchers=new Set();
export const game={
 hasCat(name){return stamps.has(name)},
 stampCat(name){if(!CAT_NAMES.includes(name)||stamps.has(name))return false;stamps.add(name);try{localStorage.setItem(KEY,JSON.stringify({version:2,cats:[...stamps]}))}catch{};watchers.forEach(fn=>fn());return true},
 getCats(){return CAT_NAMES.filter(n=>stamps.has(n))},
 getRank(){const n=stamps.size;return n>=10?'十貓收藏家':n>=7?'尋貓探險家':n>=3?'尋貓見習生':'新手探險者'},
 subscribe(fn){watchers.add(fn);return ()=>watchers.delete(fn)},
 reset(){stamps.clear();try{localStorage.removeItem(KEY)}catch{}watchers.forEach(fn=>fn())}
};
// V2.1 將再新增地標任務狀態。現在的稱號是純尋貓里程碑，不等同最終19章成就。
