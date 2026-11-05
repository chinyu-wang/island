import * as THREE from 'three';
import { ringRoad } from './island.js';

// 靜宜觀光島 V1.4：十隻貓咪。只需替換 js/cats.js；不更動自訂的 locations.js。
const material = color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true });
function ell(parent, rx, ry, rz, color, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), material(color));
  mesh.scale.set(rx, ry, rz);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// 與 island.js 完全共用道路中心線。移除最後一個重複的閉環端點。
const ring = ringRoad.slice(0, -1);
const CAT_SETTINGS = [
  // 以下三隻保留原本名稱與你上傳檔案中的對話。
  {name: '小橘', color: 0xe5a05c, start: 65, speech: [
    '喵～歡迎來到靜宜觀光島！',
    '這座島上有好多好玩的地方喵～'
  ]},
  {name: '阿灰', color: 0x969fa6, start: 17, speech: [
    '系友故事村好舒服，我要在這裡休息。',
    '不要吵我，我正在研究貓咪觀光學。'
  ]},
  {name: '小賓', color: 0x343c42, accent: 0xffffff, start: 37, speech: [
    '學生活動廣場最熱鬧！',
    '今天想去旅行，喵～'
  ]},
  // 以下七隻為新增居民；對話適合高中生探索觀光系時閱讀。
  {name: '奶茶', color: 0xd6b18b, accent: 0xffedcf, start: 0, speech: [
    '你以為觀光系只是在玩嗎？其實我們還要學會設計一趟精彩的旅行！',
    '喜歡旅行，也喜歡企劃活動？快來教學園區逛逛喵！',
    '把喜歡的事變成專業，想想就令人期待呢！'
  ]},
  {name: '花花', color: 0xf4eee1, accent: 0xb98564, start: 9, speech: [
    '還在探索大學科系嗎？招生資訊館可以幫你認識靜宜觀光！',
    '選科系不只看名字，也要看看課程和未來發展喵～',
    '你最想學旅遊企劃、餐旅管理，還是智慧觀光？'
  ]},
  {name: '黑糖', color: 0x57463f, accent: 0xc68c65, start: 27, speech: [
    '觀光不只是帶團，還有旅館、休閒、數位科技等好多方向！',
    '想知道觀光系究竟學什麼？教學園區有線索喵！',
    '我最想研究：怎樣的旅行會讓人一去再去？'
  ]},
  {name: '雪球', color: 0xf5f5ee, accent: 0xbccfe0, start: 47, speech: [
    '實習能讓課堂知識遇上真實工作現場，去實習資訊館看看吧！',
    '你想體驗旅館、旅行社，還是其他觀光產業的工作呢？',
    '先探索不同職涯，再慢慢找到喜歡的方向喵～'
  ]},
  {name: '虎斑', color: 0xb68b5c, accent: 0x78573c, start: 56, speech: [
    '喜歡用 AI、地圖和數位媒體說旅遊故事？觀光資訊也很有趣！',
    '旅行不只能拍照，還能設計互動地圖和數位導覽呢！',
    '創意加上科技，說不定能做出下一個超酷的觀光作品！'
  ]},
  {name: '可可', color: 0x987366, accent: 0xe7c6a3, start: 75, speech: [
    '老師們各有專長，去教師資訊館看看你對什麼領域好奇！',
    '你想辦音樂祭、規劃旅遊路線，還是經營一家旅館？',
    '學習不只在教室，觀察身邊的人事物也是觀光的開始。'
  ]},
  {name: '小麥', color: 0xe9c878, accent: 0xffefd0, start: 85, speech: [
    '學生社團和實習旅行社都值得探索，去學生活動廣場看看！',
    '學長姐的成果藏在榮耀殿堂，你也可以創造自己的故事！',
    '大學生活除了上課，還可以和夥伴一起完成一件很酷的事！',
    '好奇觀光系畢業後能做什麼？系友故事村有學長姐的故事喵！'
  ]}
];

function cat(spec, i) {
  const { name, color, accent, speech } = spec;
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  ell(body, .36, .32, .6, color, 0, .53, 0);
  ell(body, .3, .3, .31, color, 0, .91, .43);
  for (const x of [-.18, .18]) for (const z of [-.4, .37]) {
    ell(body, .115, .28, .12, color, x, .29, z);
  }
  for (const x of [-.2, .2]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(.14, .31, 3), material(color));
    ear.position.set(x, 1.22, .47);
    ear.rotation.z = x > 0 ? -.2 : .2;
    body.add(ear);
  }
  for (const x of [-.125, .125]) ell(body, .045, .057, .025, 0x26353d, x, .98, .735);
  ell(body, .052, .035, .025, 0xea9d9d, 0, .83, .75);
  const tail = new THREE.Group();
  tail.position.set(0, .6, -.51);
  body.add(tail);
  ell(tail, .09, .1, .36, color, 0, .08, -.27);
  ell(tail, .1, .12, .2, color, 0, .18, -.53);
  if (accent !== undefined) {
    // 三維配色差異：胸前和背部色塊，易在俯視鏡頭下辨識。
    ell(body, .18, .22, .31, accent, 0, .6, .27);
    ell(body, .13, .12, .12, accent, 0, .82, .65);
    if (name !== '小賓') ell(body, .19, .08, .27, accent, -.11, .77, -.17);
  }

  const start = Math.min(spec.start, ring.length - 1);
  // 使用原始環道頂點的連續序列，沒有跨越島嶼的直線捷徑。
  const direction = i % 2 === 0 ? 1 : -1;
  const pointAt = n => ring[((n % ring.length) + ring.length) % ring.length];
  const [x, z] = pointAt(start);
  group.position.set(x, .15, z);
  group.userData.interact = 'cat:' + name;
  group.traverse(obj => { obj.userData.interact = 'cat:' + name; });
  const [nextX, nextZ] = pointAt(start + direction);
  return {
    name, group, body, tail, speech,
    routeIndex: start, direction, pointAt,
    state: 'idle', time: .8 + Math.random() * 3,
    target: new THREE.Vector3(nextX, .15, nextZ),
    speed: .85 + Math.random() * .38
  };
}

export function makeCats(root) {
  const cats = CAT_SETTINGS.map((spec, i) => cat(spec, i));
  for (const c of cats) root.add(c.group);
  return cats;
}

export function updateCats(cats, dt, t, enabled = true) {
  for (const c of cats) {
    c.group.visible = enabled;
    if (!enabled) continue;
    c.group.position.y = .15; // 道路上表面約為 .145；腳掌保持地表高度。
    c.time -= dt;
    if (c.state === 'walk') {
      const dx = c.target.x - c.group.position.x;
      const dz = c.target.z - c.group.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < .08) {
        // 到達上一個道路節點，下一個目的地仍為相鄰道路節點。
        c.group.position.x = c.target.x;
        c.group.position.z = c.target.z;
        c.routeIndex = (c.routeIndex + c.direction + ring.length) % ring.length;
        const [nextX, nextZ] = c.pointAt(c.routeIndex + c.direction);
        c.target.set(nextX, .15, nextZ);
        c.state = 'idle';
        c.time = .2 + Math.random() * .85;
      } else {
        const step = Math.min(dist, dt * c.speed);
        c.group.position.x += dx / dist * step;
        c.group.position.z += dz / dist * step;
        c.group.rotation.y = Math.atan2(dx, dz);
        c.body.position.y = Math.abs(Math.sin(t * 10)) * .025;
        c.body.rotation.z = Math.sin(t * 10) * .025;
        c.body.scale.y = 1;
        c.tail.rotation.y = Math.sin(t * 3) * .3;
      }
    } else {
      c.body.position.y = 0;
      c.body.rotation.z = 0;
      c.body.scale.y = c.state === 'sit' ? .78 : 1;
      c.tail.rotation.y = Math.sin(t * 3) * .35;
      if (c.time <= 0) {
        c.state = Math.random() < .16 ? 'sit' : 'walk';
        c.time = c.state === 'sit' ? 1 + Math.random() * 2.5 : 999;
      }
    }
  }
}
