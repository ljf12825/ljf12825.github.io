import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('=== 3D Nav Starting (ES Module) ===');

(function() {

var win = document.getElementById('nav3d-win');
var header = document.getElementById('nav3d-header');

if (!win || !header) {
  console.error('No window div or header');
  return;
}

// ===== 拖拽和折叠 =====
var isDown = false;
var ox = 0, oy = 0;
var lastTap = 0;
var sx = 0, sy = 0;

var pos = JSON.parse(localStorage.getItem("nav3d-pos") || "null");
if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
  win.style.left = pos.x + "px";
  win.style.top = pos.y + "px";
  win.style.right = "auto";
  win.style.bottom = "auto";
} else {
  win.style.top = "auto";
  win.style.right = "40px";
  win.style.left = "auto";
  win.style.bottom = "40px";
}

if (localStorage.getItem("nav3d-collapse") === "1") {
  win.classList.add("closed");
}

function clampToViewport(left, top) {
  var wW = window.innerWidth;
  var wH = window.innerHeight;
  var eW = win.offsetWidth;
  var eH = win.offsetHeight;
  return {
    left: Math.min(Math.max(left, 0), Math.max(0, wW - eW)),
    top: Math.min(Math.max(top, 0), Math.max(0, wH - eH))
  };
}

function applyPosition(left, top) {
  var c = clampToViewport(left, top);
  win.style.left = c.left + "px";
  win.style.top = c.top + "px";
  win.style.right = "auto";
  win.style.bottom = "auto";
}

function savePos() {
  var x = parseFloat(win.style.left);
  var y = parseFloat(win.style.top);
  if (!isNaN(x) && !isNaN(y)) {
    localStorage.setItem("nav3d-pos", JSON.stringify({ x: x, y: y }));
  }
}

function toggle() {
  win.classList.toggle("closed");
  localStorage.setItem("nav3d-collapse", win.classList.contains("closed") ? "1" : "0");
  setTimeout(function() {
    var x = parseFloat(win.style.left);
    var y = parseFloat(win.style.top);
    if (!isNaN(x) && !isNaN(y)) applyPosition(x, y);
  }, 50);
}

function getClientPos(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onStart(e) {
  e.preventDefault();
  isDown = true;
  var p = getClientPos(e);
  sx = p.x; sy = p.y;
  ox = p.x - win.offsetLeft;
  oy = p.y - win.offsetTop;
}

function onMove(e) {
  if (!isDown) return;
  var p = getClientPos(e);
  applyPosition(p.x - ox, p.y - oy);
}

function onEnd(e) {
  if (!isDown) return;
  isDown = false;
  savePos();
  var p = e.changedTouches
    ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    : { x: e.clientX, y: e.clientY };
  var d = Math.hypot(p.x - sx, p.y - sy);
  var n = Date.now();
  if (d < 10 && n - lastTap < 300) toggle();
  lastTap = n;
}

header.addEventListener("mousedown", onStart);
header.addEventListener("touchstart", onStart, { passive: false });
document.addEventListener("mousemove", onMove);
document.addEventListener("touchmove", onMove, { passive: false });
document.addEventListener("mouseup", onEnd);
document.addEventListener("touchend", onEnd);

window.addEventListener("resize", function() {
  var x = parseFloat(win.style.left);
  var y = parseFloat(win.style.top);
  if (!isNaN(x) && !isNaN(y)) applyPosition(x, y);
});

window.addEventListener("pageshow", function() {
  var x = parseFloat(win.style.left);
  var y = parseFloat(win.style.top);
  if (!isNaN(x) && !isNaN(y)) {
    applyPosition(x, y);
  } else {
    var saved = JSON.parse(localStorage.getItem("nav3d-pos") || "null");
    if (saved && typeof saved.x === 'number') applyPosition(saved.x, saved.y);
  }
});

// ===== 显示窗口 =====
win.style.display = 'block';

// ===== 读取数据 =====
function getNodes() {
  var el = document.getElementById('nav3d-data');
  if (!el) { console.error('No data element'); return []; }
  try {
    var raw = el.textContent.trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
      raw = raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    var data = JSON.parse(raw);
    return data.filter(function(n) {
      return n.y >= 0 && n.y <= 3 && n.z >= 0 && n.z <= 3;
    });
  } catch(e) { 
    console.error('Parse error:', e); 
    return []; 
  }
}

var nodes = getNodes();
console.log('Nodes:', nodes.length);

document.getElementById('nav3d-node-count').textContent = 'Nodes: ' + nodes.length;

if (nodes.length === 0) {
  document.getElementById('nav3d-scene').innerHTML = '<div class="nav3d-empty">No navigation nodes found</div>';
  document.getElementById('nav3d-status').textContent = 'Add tags: [scope, layer, depth]';
  return;
}

// ===== 3D 场景 =====
var sceneDiv = document.getElementById('nav3d-scene');
var W = sceneDiv.clientWidth || 280;
var H = sceneDiv.clientHeight || 260;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xc0c0c0);

var camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100);
camera.position.set(-0.8, 1.5, 3.5);
camera.lookAt(0.2, 0.2, 0.4);

var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(W, H);
sceneDiv.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0.2, 0.2, 0.4);
controls.update();

scene.add(new THREE.AmbientLight(0x999999));
var light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(5, 8, 5);
scene.add(light);

var scopeLabels = [];
nodes.forEach(function(n) {
  if (scopeLabels.indexOf(n.x) === -1) scopeLabels.push(n.x);
});
scopeLabels.sort();

var scopeColors = [0x800000, 0x008000, 0x000080, 0x808000, 0x800080, 0x008080, 0x808080, 0x000000];

var layerLabels = { 0: 'Editor', 1: 'Script', 2: 'Pipeline', 3: 'Native' };
var depthLabels = { 0: 'Use', 1: 'Config', 2: 'Expand', 3: 'Source' };

var SPACING = 0.2;
var scopePositions = {};
scopeLabels.forEach(function(label, index) {
  scopePositions[label] = index * SPACING;
});

var maxX = Math.max(0.4, (scopeLabels.length - 1) * SPACING);
var maxY = 3 * SPACING;
var maxZ = 3 * SPACING;

// 三维网格
function create3DGrid() {
  var gridGroup = new THREE.Group();
  var mat = new THREE.LineBasicMaterial({ color: 0x808080 });

  for (var xi = 0; xi < scopeLabels.length; xi++) {
    var x = xi * SPACING;
    for (var y = 0; y <= 3; y++) {
      for (var z = 0; z <= 3; z++) {
        if (z < 3) {
          gridGroup.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y*SPACING, z*SPACING), new THREE.Vector3(x, y*SPACING, (z+1)*SPACING)]), mat));
        }
        if (y < 3) {
          gridGroup.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y*SPACING, z*SPACING), new THREE.Vector3(x, (y+1)*SPACING, z*SPACING)]), mat));
        }
      }
    }
  }
  if (scopeLabels.length > 1) {
    for (var y = 0; y <= 3; y++) {
      for (var z = 0; z <= 3; z++) {
        gridGroup.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y*SPACING, z*SPACING), new THREE.Vector3(maxX, y*SPACING, z*SPACING)]), mat));
      }
    }
  }
  return gridGroup;
}

scene.add(create3DGrid());

// 坐标轴
function axisLine(sx, sy, sz, ex, ey, ez, c) {
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx,sy,sz), new THREE.Vector3(ex,ey,ez)]),
    new THREE.LineBasicMaterial({ color: c })));
}
axisLine(-0.05, 0, 0, maxX+0.1, 0, 0, 0x000080);
axisLine(0, -0.05, 0, 0, maxY+0.1, 0, 0x800000);
axisLine(0, 0, -0.05, 0, 0, maxZ+0.1, 0x808000);

// 纯文字标签 - 无背景
function mkTextLabel(text, x, y, z, color, fontSize) {
  var cv = document.createElement('canvas');
  cv.width = 128;
  cv.height = 32;
  var ctx = cv.getContext('2d');
  ctx.fillStyle = color;
  ctx.font = (fontSize || '10px') + ' "MS Sans Serif", Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 16);
  var tx = new THREE.CanvasTexture(cv);
  tx.minFilter = THREE.NearestFilter;
  tx.premultiplyAlpha = true;
  var sp = new THREE.Sprite(new THREE.SpriteMaterial({ 
    map: tx, 
    transparent: true,
    depthTest: false,
    depthWrite: false
  }));
  sp.position.set(x, y, z);
  sp.scale.set(0.4, 0.1, 1);
  sp.renderOrder = 999;
  scene.add(sp);
}

// 轴刻度 - Scope (X)
for (var i = 0; i < scopeLabels.length; i++) {
  mkTextLabel(scopeLabels[i], i*SPACING, -0.06, -0.1, '#000080', '9px');
}
// 轴刻度 - Layer (Y)
for (var v = 0; v <= 3; v++) {
  mkTextLabel(layerLabels[v], -0.08, v*SPACING, -0.06, '#800000', '9px');
}
// 轴刻度 - Depth (Z)
for (var v = 0; v <= 3; v++) {
  mkTextLabel(depthLabels[v], -0.08, -0.06, v*SPACING, '#808000', '9px');
}

// 节点 - 球体
var balls = [];
nodes.forEach(function(n) {
  var sx = scopePositions[n.x] !== undefined ? scopePositions[n.x] : 0;
  var p = new THREE.Vector3(sx, n.y*SPACING, n.z*SPACING);
  var ci = scopeColors[scopeLabels.indexOf(n.x) % scopeColors.length];
  var g = new THREE.SphereGeometry(0.04, 8, 8);
  var m = new THREE.MeshStandardMaterial({ color: ci, roughness: 0.3, metalness: 0.1 });
  var b = new THREE.Mesh(g, m);
  b.position.copy(p);
  b.userData = n;
  scene.add(b);
  balls.push(b);
});

// 高亮环
var ring = new THREE.Mesh(
  new THREE.TorusGeometry(0.055, 0.008, 8, 16),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
ring.visible = false;
scene.add(ring);

// Tooltip
var tip = document.createElement('div');
tip.className = 'nav3d-tooltip';
document.body.appendChild(tip);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var hovered = null;

renderer.domElement.addEventListener('mousemove', function(e) {
  var r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var hits = raycaster.intersectObjects(balls);
  if (hits.length > 0) {
    var o = hits[0].object;
    if (hovered !== o) {
      if (hovered) hovered.material.emissive.setHex(0);
      hovered = o;
      hovered.material.emissive.setHex(0x444444);
      ring.position.copy(o.position);
      ring.visible = true;
      var d = o.userData;
      tip.innerHTML = '<b>' + d.title + '</b>' +
        (d.author ? '<br>Author: ' + d.author : '') +
        (d.date ? '<br>Date: ' + d.date : '') +
        '<br>[' + d.x + ', ' + layerLabels[d.y] + ', ' + depthLabels[d.z] + ']' +
        (d.summary ? '<br>' + d.summary : '') +
        '<br><span>Click to open</span>';
      tip.style.display = 'block';
      document.getElementById('nav3d-status').textContent = d.title;
    }
    tip.style.left = (e.clientX + 15) + 'px';
    tip.style.top = (e.clientY - 10) + 'px';
  } else {
    if (hovered) { hovered.material.emissive.setHex(0); hovered = null; ring.visible = false; tip.style.display = 'none'; }
    document.getElementById('nav3d-status').textContent = 'Hover over a node';
  }
});

renderer.domElement.addEventListener('click', function(e) {
  var r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var hits = raycaster.intersectObjects(balls);
  if (hits.length > 0) {
    var d = hits[0].object.userData;
    if (d.permalink) window.location.href = d.permalink;
  }
});

// Reset 按钮
document.getElementById('btn-reset').addEventListener('click', function(e) {
  e.preventDefault();
  camera.position.set(-0.8, 1.5, 3.5);
  controls.target.set(maxX/2, maxY/2, maxZ/2);
  controls.update();
});

window.addEventListener('resize', function() {
  W = sceneDiv.clientWidth || 280;
  H = sceneDiv.clientHeight || 260;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
});

function anim() {
  requestAnimationFrame(anim);
  controls.update();
  if (ring.visible && hovered) ring.position.copy(hovered.position);
  renderer.render(scene, camera);
}
anim();

console.log('3D Nav ready');

})();