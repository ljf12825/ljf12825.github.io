import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('=== 3D Nav Starting (ES Module) ===');

function waitForElements(callback) {
  var sceneDiv = document.getElementById('nav3d-scene');
  var dataEl = document.getElementById('nav3d-data');
  if (sceneDiv && dataEl) {
    callback(sceneDiv, dataEl);
  } else {
    setTimeout(function () { waitForElements(callback); }, 100);
  }
}

waitForElements(function (sceneDiv, dataEl) {

  function getNodes() {
    try {
      var raw = dataEl.textContent.trim();
      if (raw.startsWith('"') && raw.endsWith('"')) {
        raw = raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      var data = JSON.parse(raw);
      return data.filter(function (n) {
        if (typeof n.y !== 'number' || typeof n.z !== 'number') return false;
        if (!Number.isInteger(n.y) || n.y < 0 || n.y > 3) return false;
        if (!Number.isInteger(n.z) || n.z < 0 || n.z > 3) return false;
        return true;
      });
    } catch (e) {
      console.error('Parse error:', e);
      return [];
    }
  }

  var nodes = getNodes();
  console.log('3D Nav Nodes:', nodes.length);

  if (nodes.length === 0) {
    sceneDiv.innerHTML = '<div style="padding:40px;text-align:center;color:#000;font-family:\'MS Sans Serif\',Arial;font-size:12px;background:#c0c0c0;">No navigation nodes found</div>';
    var statusEl = document.getElementById('nav3d-status');
    if (statusEl) statusEl.textContent = 'No nodes';
    return;
  }

  var W = sceneDiv.clientWidth || 380;
  var H = sceneDiv.clientHeight || 320;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc0c0c0);

  var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(-0.8, 1.0, 1.0);
  camera.lookAt(0.2, 0.2, 0.4);

  var renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(W, H);
  var canvasEl = renderer.domElement;
  canvasEl.style.position = 'absolute';
  canvasEl.style.top = '0';
  canvasEl.style.left = '0';
  canvasEl.style.zIndex = '1';
  sceneDiv.appendChild(canvasEl);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0.2, 0.2, 0.4);

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };

  controls.update();

  scene.add(new THREE.AmbientLight(0x999999));
  var light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(5, 8, 5);
  scene.add(light);

  var scopeLabels = [];
  nodes.forEach(function (n) {
    if (scopeLabels.indexOf(n.x) === -1) scopeLabels.push(n.x);
  });
  scopeLabels.sort();

  var scopeColors = [
    0x00ff99, // 湖绿
    0xff33cc, // 亮粉
    0x6633ff, // 靛紫
    0xffcc00, // 金橙
    0x0099ff, // 宝蓝
    0x33ff66, // 翠绿
    0xff0066, // 玫红
    0xccff00, // 酸橙
    0xff99cc, // 柔和粉
    0x6600ff, // 蓝紫
    0xff9900, // 橙黄
    0x00ccff, // 亮青
    0x33ff33, // 亮翠绿
    0xff6699, // 浅玫红
    0x9933ff, // 紫罗兰
    0xff6600, // 亮橙
    0xff33ff, // 亮品红
    0x00ff66, // 春绿
    0x3366ff, // 深蓝
    0xffcc66, // 香槟金
    0xcc00ff, // 纯紫
    0x66ff00, // 亮绿
    0xff3366, // 粉红
    0x00ffcc, // 青绿
    0xff9933, // 橘橙
    0xff00cc, // 品红
    0x33ccff, // 天蓝
    0x99ff00  // 黄绿
  ];

  var layerLabels = { 0: 'Editor', 1: 'Script', 2: 'Pipeline', 3: 'Native' };
  var depthLabels = { 0: 'Use', 1: 'Config', 2: 'Expand', 3: 'Source' };

  var SPACING = 0.2;
  var scopePositions = {};
  scopeLabels.forEach(function (label, index) {
    scopePositions[label] = index * SPACING;
  });

  var maxX = Math.max(0.4, (scopeLabels.length - 1) * SPACING);
  var maxY = 3 * SPACING;
  var maxZ = 3 * SPACING;

  function create3DGrid() {
    var gridGroup = new THREE.Group();
    var mat = new THREE.LineBasicMaterial({ color: 0x808080 });

    for (var xi = 0; xi < scopeLabels.length; xi++) {
      var x = xi * SPACING;
      for (var y = 0; y <= 3; y++) {
        for (var z = 0; z <= 3; z++) {
          if (z < 3) {
            gridGroup.add(new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y * SPACING, z * SPACING), new THREE.Vector3(x, y * SPACING, (z + 1) * SPACING)]), mat));
          }
          if (y < 3) {
            gridGroup.add(new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y * SPACING, z * SPACING), new THREE.Vector3(x, (y + 1) * SPACING, z * SPACING)]), mat));
          }
        }
      }
    }
    if (scopeLabels.length > 1) {
      for (var y = 0; y <= 3; y++) {
        for (var z = 0; z <= 3; z++) {
          gridGroup.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y * SPACING, z * SPACING), new THREE.Vector3(maxX, y * SPACING, z * SPACING)]), mat));
        }
      }
    }
    return gridGroup;
  }

  scene.add(create3DGrid());

  function axisLine(sx, sy, sz, ex, ey, ez, c) {
    var dir = new THREE.Vector3(ex - sx, ey - sy, ez - sz);
    var length = dir.length();
    var mid = new THREE.Vector3(sx, sy, sz).add(dir.clone().multiplyScalar(0.5));
    var cylGeo = new THREE.CylinderGeometry(0.005, 0.005, length, 8);
    var cylMat = new THREE.MeshBasicMaterial({ color: c });
    var cyl = new THREE.Mesh(cylGeo, cylMat);
    cyl.position.copy(mid);
    cyl.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    scene.add(cyl);
  }

  axisLine(-0.05, 0, 0, maxX + 0.1, 0, 0, 0x0000ff);
  axisLine(0, -0.05, 0, 0, maxY + 0.1, 0, 0xff0000);
  axisLine(0, 0, -0.05, 0, 0, maxZ + 0.1, 0x00ff00);

  function mkTextLabel(text, x, y, z, color, fontSize) {
    var cv = document.createElement('canvas');
    cv.width = 128; cv.height = 32;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = (fontSize || '10px');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 16);
    var tx = new THREE.CanvasTexture(cv);
    tx.minFilter = THREE.NearestFilter;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tx, transparent: true, depthTest: false, depthWrite: false
    }));
    sp.position.set(x, y, z);
    sp.scale.set(0.4, 0.1, 1);
    sp.renderOrder = 999;
    scene.add(sp);
  }

  for (var i = 0; i < scopeLabels.length; i++) {
    mkTextLabel(scopeLabels[i], i * SPACING, -0.06, -0.1, '#0000ff', '9px');
  }
  for (var v = 0; v <= 3; v++) {
    mkTextLabel(layerLabels[v], -0.08, v * SPACING, -0.06, '#ff0000', '9px');
    mkTextLabel(depthLabels[v], -0.08, -0.06, v * SPACING, '#00ff00', '9px');
  }

  var balls = [];
  var positionGroups = {};

  nodes.forEach(function (n) {
    var sx = scopePositions[n.x] !== undefined ? scopePositions[n.x] : 0;
    var baseX = sx;
    var baseY = n.y * SPACING;
    var baseZ = n.z * SPACING;
    var posKey = baseX.toFixed(4) + ',' + baseY.toFixed(4) + ',' + baseZ.toFixed(4);
    if (!positionGroups[posKey]) {
      positionGroups[posKey] = [];
    }
    positionGroups[posKey].push(n);
  });

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  var sharedSphereGeo = {};
  var sharedCylGeo = new THREE.CylinderGeometry(0.004, 0.004, 1, 5);
  var sharedDotGeo = new THREE.SphereGeometry(0.006, 3, 3);

  function getSphereGeo(radius) {
    var key = radius.toFixed(4);
    if (!sharedSphereGeo[key]) {
      var seg = radius > 0.03 ? 8 : (radius > 0.02 ? 6 : 4);
      sharedSphereGeo[key] = new THREE.SphereGeometry(radius, seg, seg);
    }
    return sharedSphereGeo[key];
  }

  var sharedMaterials = {};

  function getBallMaterial(colorHex) {
    var key = 'ball_' + colorHex;
    if (!sharedMaterials[key]) {
      sharedMaterials[key] = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.1
      });
    }
    return sharedMaterials[key];
  }

  function getLineMaterial(colorHex) {
    var key = 'line_' + colorHex;
    if (!sharedMaterials[key]) {
      sharedMaterials[key] = new THREE.MeshBasicMaterial({ color: colorHex });
    }
    return sharedMaterials[key];
  }

  Object.keys(positionGroups).forEach(function (posKey) {
    var groupNodes = positionGroups[posKey];
    var count = groupNodes.length;
    var baseRadius = 0.04;
    var radius = baseRadius / Math.sqrt(count);
    radius = Math.max(radius, 0.015);

    var parts = posKey.split(',');
    var baseX = parseFloat(parts[0]);
    var baseY = parseFloat(parts[1]);
    var baseZ = parseFloat(parts[2]);
    var centerPos = new THREE.Vector3(baseX, baseY, baseZ);

    var posSeed = 0;
    for (var i = 0; i < posKey.length; i++) {
      posSeed += posKey.charCodeAt(i);
    }

    groupNodes.forEach(function (n, idx) {
      var offset = new THREE.Vector3();

      if (idx > 0 && count > 1) {
        var r1 = seededRandom(posSeed + idx * 7);
        var r2 = seededRandom(posSeed + idx * 13);
        var r3 = seededRandom(posSeed + idx * 17);

        var dist = 0.06;
        var angle = r1 * Math.PI * 2;
        var heightFactor = (r2 - 0.5) * 2;

        offset.x = Math.cos(angle) * dist * (0.7 + r3 * 0.6);
        offset.y = Math.sin(angle) * dist * (0.7 + r1 * 0.6);
        offset.z = heightFactor * 0.04;
      }

      var p = new THREE.Vector3(baseX + offset.x, baseY + offset.y, baseZ + offset.z);
      var colorIndex = scopeLabels.indexOf(n.x) % scopeColors.length;
      var ci = scopeColors[colorIndex];

      var g = getSphereGeo(radius);
      var m = getBallMaterial(ci);
      var b = new THREE.Mesh(g, m);
      b.position.copy(p);
      b.userData = n;
      scene.add(b);
      balls.push(b);

      if (offset.length() > 0.001) {
        var dir = new THREE.Vector3().subVectors(centerPos, p);
        var length = dir.length();
        var midPoint = new THREE.Vector3().addVectors(p, centerPos).multiplyScalar(0.5);

        var cylMat = getLineMaterial(ci);
        var cyl = new THREE.Mesh(sharedCylGeo, cylMat);
        cyl.position.copy(midPoint);
        cyl.scale.set(1, length, 1);
        cyl.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );
        scene.add(cyl);

        var dotMat = getLineMaterial(ci);
        var dot = new THREE.Mesh(sharedDotGeo, dotMat);
        dot.position.copy(centerPos);
        scene.add(dot);
      }
    });
  });

  var ringGeometryCache = {};

  function getRingGeometry(outerRadius, tubeRadius) {
    var key = outerRadius.toFixed(3) + '_' + tubeRadius.toFixed(3);
    if (!ringGeometryCache[key]) {
      ringGeometryCache[key] = new THREE.TorusGeometry(outerRadius, tubeRadius, 8, 16);
    }
    return ringGeometryCache[key];
  }

  var ringV = new THREE.Mesh(
    getRingGeometry(0.055, 0.008),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  ringV.visible = false;
  scene.add(ringV);

  var ringH = new THREE.Mesh(
    getRingGeometry(0.06, 0.008),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  ringH.visible = false;
  ringH.rotation.x = Math.PI / 2;
  scene.add(ringH);

  var statusEl = document.getElementById('nav3d-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'nav3d-status';
    statusEl.style.cssText = 'position:absolute;bottom:4px;left:4px;z-index:10;color:#000;font-size:10px;background:#c0c0c0;padding:1px 4px;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #000;border-bottom:1px solid #000;max-width:90%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    sceneDiv.appendChild(statusEl);
  }

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var hovered = null;

  function updateStatus(d) {
    if (!statusEl) return;
    if (d) {
      var tagsStr = '[' + d.x + ', ' + layerLabels[d.y] + ', ' + depthLabels[d.z] + ']';
      var parts = [];
      parts.push(d.title);
      if (d.filepath) parts.push(d.filepath);
      if (d.author) parts.push(d.author);
      if (d.date) parts.push(d.date);
      parts.push(tagsStr);
      if (d.summary) parts.push(d.summary);
      statusEl.textContent = parts.join(' | ');
    } else {
      statusEl.textContent = 'Hover over a node';
    }
  }

  renderer.domElement.addEventListener('mousemove', function (e) {
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

        ringV.position.copy(o.position);
        ringV.visible = true;
        ringH.position.copy(o.position);
        ringH.visible = true;

        var ballRadius = o.geometry.parameters.radius || 0.04;
        var ringRadius = ballRadius * 1.4;
        var tubeRadius = Math.max(ballRadius * 0.2, 0.003);

        ringV.geometry = getRingGeometry(ringRadius, tubeRadius);
        ringH.geometry = getRingGeometry(ringRadius * 1.1, tubeRadius);

        updateStatus(o.userData);
      }
    } else {
      if (hovered) {
        hovered.material.emissive.setHex(0);
        hovered = null;
        ringV.visible = false;
        ringH.visible = false;
        updateStatus(null);
      }
    }
  });

  renderer.domElement.addEventListener('click', function (e) {
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

  var resetBtn = document.getElementById('btn-reset-nav3d');
  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      camera.position.set(-0.8, 1.0, 1.0);
      controls.target.set(maxX / 2, maxY / 2, maxZ / 2);
      controls.update();
    });
  }

  function resize() {
    W = sceneDiv.clientWidth || 380;
    H = sceneDiv.clientHeight || 320;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', resize);

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.id === 'index-panel-nav3d' && mutation.target.style.display === 'block') {
        setTimeout(resize, 50);
      }
    });
  });
  var nav3dPanel = document.getElementById('index-panel-nav3d');
  if (nav3dPanel) {
    observer.observe(nav3dPanel, { attributes: true, attributeFilter: ['style'] });
  }

  function anim() {
    requestAnimationFrame(anim);
    controls.update();
    if (ringV.visible && hovered) {
      ringV.position.copy(hovered.position);
      ringH.position.copy(hovered.position);
    }
    renderer.render(scene, camera);
  }
  anim();
});