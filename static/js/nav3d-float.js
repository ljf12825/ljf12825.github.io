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
      var filtered = data.filter(function (n) {
        if (typeof n.y !== 'number' || typeof n.z !== 'number') return false;
        if (!Number.isInteger(n.y) || n.y < 0 || n.y > 5) return false;
        if (!Number.isInteger(n.z) || n.z < 0) return false;
        return true;
      });

      filtered.forEach(function (n) {
        if (typeof n.alive !== 'number' || (n.alive !== 0 && n.alive !== 1)) {
          console.warn('Node missing valid alive field, defaulting to 1:', n.title);
          n.alive = 1;
        }
      });

      return filtered;
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
  camera.position.set(-0.5, 1.2, 1.5);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
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
  var light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(5, 8, 5);
  scene.add(light);

  var backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  backLight.position.set(-5, -3, -5);
  scene.add(backLight);

  var scopeLabels = [];
  nodes.forEach(function (n) {
    if (scopeLabels.indexOf(n.x) === -1) scopeLabels.push(n.x);
  });
  scopeLabels.sort();

  var scopeColors = [
    0x00ff99, 0xff33cc, 0x6633ff, 0xffcc00, 0x0099ff, 0x33ff66, 0xff0066,
    0xccff00, 0xff99cc, 0x6600ff, 0xff9900, 0x00ccff, 0x33ff33, 0xff6699,
    0x9933ff, 0xff6600, 0xff33ff, 0x00ff66, 0x3366ff, 0xffcc66, 0xcc00ff,
    0x66ff00, 0xff3366, 0x00ffcc, 0xff9933, 0xff00cc, 0x33ccff, 0x99ff00
  ];

  var depthNames = ['Aware', 'Use', 'Configure', 'Extend', 'Analyze', 'Internals'];
  var versionSequence = [];
  var versionDataEl = document.getElementById('nav3d-version-data');

  if (versionDataEl) {
    try {
      var versionRaw = versionDataEl.textContent.trim();
      var parsed = JSON.parse(versionRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        versionSequence = parsed;
      }
    } catch (e) {
      console.error('Parse version data error:', e);
    }
  }

  if (!versionSequence || versionSequence.length === 0) {
    var maxZ = 0;
    var tempLabels = {};
    nodes.forEach(function (n) {
      if (n.z > maxZ) maxZ = n.z;
      if (n.zLabel && !tempLabels[n.z]) {
        tempLabels[n.z] = n.zLabel;
      }
    });

    for (var i = 0; i <= maxZ; i++) {
      if (tempLabels[i]) {
        versionSequence.push(tempLabels[i]);
      } else {
        versionSequence.push('Z' + i);
      }
    }
  }

  console.log('Final versionSequence length:', versionSequence.length);

  var SPACING = 0.2;
  var scopePositions = {};
  scopeLabels.forEach(function (label, index) {
    scopePositions[label] = index * SPACING;
  });

  var maxX = Math.max(0.4, (scopeLabels.length - 1) * SPACING);
  var maxY = 5 * SPACING;
  var maxZ = Math.max(4 * SPACING, (versionSequence.length - 1) * SPACING + SPACING);

  camera.position.set(-maxX * 0.8, maxY * 1.2, -maxZ * 0.8);
  controls.target.set(maxX / 2, maxY / 2, maxZ / 2);
  controls.update();

  function create3DGrid() {
    var gridGroup = new THREE.Group();
    var mat = new THREE.LineBasicMaterial({ color: 0xb0b0b0, transparent: true, opacity: 0.5 });
    var maxZI = versionSequence.length - 1;

    for (var xi = 0; xi < scopeLabels.length; xi++) {
      var x = xi * SPACING;
      for (var y = 0; y <= 5; y++) {
        for (var z = 0; z <= maxZI; z++) {
          if (z < maxZI) {
            var geo1 = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x, y * SPACING, z * SPACING),
              new THREE.Vector3(x, y * SPACING, (z + 1) * SPACING)
            ]);
            gridGroup.add(new THREE.Line(geo1, mat));
          }
          if (y < 5) {
            var geo2 = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x, y * SPACING, z * SPACING),
              new THREE.Vector3(x, (y + 1) * SPACING, z * SPACING)
            ]);
            gridGroup.add(new THREE.Line(geo2, mat));
          }
        }
      }
    }
    if (scopeLabels.length > 1) {
      for (var y = 0; y <= 5; y++) {
        for (var z = 0; z <= maxZI; z++) {
          var geo3 = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, y * SPACING, z * SPACING),
            new THREE.Vector3(maxX, y * SPACING, z * SPACING)
          ]);
          gridGroup.add(new THREE.Line(geo3, mat));
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
    sp.scale.set(0.3, 0.1, 1);
    sp.renderOrder = 999;
    scene.add(sp);
  }

  for (var i = 0; i < scopeLabels.length; i++) {
    mkTextLabel(scopeLabels[i], i * SPACING, -0.06, -0.1, '#0000ff', '9px');
  }

  for (var v = 0; v <= 5; v++) {
    mkTextLabel(depthNames[v], -0.1, v * SPACING, -0.06, '#ff0000', '8px');
  }

  for (var z = 0; z < versionSequence.length; z++) {
    mkTextLabel(versionSequence[z], -0.08, -0.08, z * SPACING, '#00ff00', '7px');
  }

  function createSpikyBall(radius, spikeCount, colorHex) {
    var group = new THREE.Group();

    var centerGeo = new THREE.SphereGeometry(radius * 0.12, 4, 4);
    var centerMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.8,
      metalness: 0.0
    });
    var center = new THREE.Mesh(centerGeo, centerMat);
    group.add(center);

    var spikeRadius = radius * 0.18;
    var spikeGeo = new THREE.ConeGeometry(spikeRadius, radius * 1.8, 5, 2);
    var spikeMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.5,
      metalness: 0.0,
      flatShading: true
    });

    var phi = Math.PI * (3 - Math.sqrt(5));

    for (var i = 0; i < spikeCount; i++) {
      var y = 1 - (i / (spikeCount - 1)) * 2;
      var radiusAtY = Math.sqrt(1 - y * y);
      var theta = phi * i;

      var nx = Math.cos(theta) * radiusAtY;
      var ny = y;
      var nz = Math.sin(theta) * radiusAtY;

      var direction = new THREE.Vector3(nx, ny, nz).normalize();

      var spikeLength = radius * 1.8;
      var startDist = radius * 0.08;

      var spike = new THREE.Mesh(spikeGeo, spikeMat);
      spike.position.copy(
        direction.clone().multiplyScalar(startDist + spikeLength / 2)
      );

      var quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
      );
      spike.setRotationFromQuaternion(quaternion);

      group.add(spike);
    }

    return group;
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
      var seg = radius > 0.03 ? 12 : (radius > 0.02 ? 8 : 6);
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

  function getDeprecatedLineMaterial() {
    if (!sharedMaterials['deprecated_line']) {
      sharedMaterials['deprecated_line'] = new THREE.MeshBasicMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.5
      });
    }
    return sharedMaterials['deprecated_line'];
  }

  Object.keys(positionGroups).forEach(function (posKey) {
    var groupNodes = positionGroups[posKey];
    var count = groupNodes.length;
    var baseRadius = 0.04;
    var radius = baseRadius / Math.sqrt(count);
    radius = Math.max(radius, 0.02);

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

      var nodeObj;

      if (n.alive === 0) {
        var spikeCount = 20;
        nodeObj = createSpikyBall(radius, spikeCount, ci);
        nodeObj.position.copy(p);
        nodeObj.userData = n;
        nodeObj.userData.isDeprecated = true;
        nodeObj.userData.nodeType = 'spiky';
      } else {
        var normalGeo = getSphereGeo(radius);
        var normalMat = getBallMaterial(ci);

        nodeObj = new THREE.Mesh(normalGeo, normalMat);
        nodeObj.position.copy(p);
        nodeObj.userData = n;
        nodeObj.userData.isDeprecated = false;
        nodeObj.userData.nodeType = 'sphere';
      }

      scene.add(nodeObj);
      balls.push(nodeObj);

      if (offset.length() > 0.001) {
        var dir = new THREE.Vector3().subVectors(centerPos, p);
        var length = dir.length();
        var midPoint = new THREE.Vector3().addVectors(p, centerPos).multiplyScalar(0.5);

        var cylMat;
        if (n.alive === 0) {
          cylMat = getDeprecatedLineMaterial();
        } else {
          cylMat = getLineMaterial(ci);
        }

        var cyl = new THREE.Mesh(sharedCylGeo, cylMat);
        cyl.position.copy(midPoint);
        cyl.scale.set(1, length, 1);
        cyl.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );
        scene.add(cyl);

        var dotMat;
        if (n.alive === 0) {
          dotMat = getDeprecatedLineMaterial();
        } else {
          dotMat = getLineMaterial(ci);
        }

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
    getRingGeometry(0.04, 0.006),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  ringV.visible = false;
  scene.add(ringV);

  var ringH = new THREE.Mesh(
    getRingGeometry(0.045, 0.006),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  ringH.visible = false;
  ringH.rotation.x = Math.PI / 2;
  scene.add(ringH);

  var ringVDeprecated = new THREE.Mesh(
    getRingGeometry(0.05, 0.006),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  ringVDeprecated.visible = false;
  scene.add(ringVDeprecated);

  var ringHDeprecated = new THREE.Mesh(
    getRingGeometry(0.055, 0.006),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  ringHDeprecated.visible = false;
  ringHDeprecated.rotation.x = Math.PI / 2;
  scene.add(ringHDeprecated);

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
      var depthName = depthNames[d.y] || ('Y' + d.y);
      var versionName = d.zLabel || ('Z' + d.z);
      var aliveStatus = d.alive === 0 ? 'DEPRECATED' : 'ACTIVE';
      var tagsStr = '[' + d.x + ', ' + depthName + ', ' + versionName + ']' + ' | ' + aliveStatus;
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

  function getWorldPos(obj) {
    var pos = new THREE.Vector3();
    obj.getWorldPosition(pos);
    return pos;
  }

  renderer.domElement.addEventListener('mousemove', function (e) {
    var r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var allTargets = [];
    var meshToBall = new Map();

    balls.forEach(function (ball) {
      if (ball.isGroup) {
        ball.traverse(function (child) {
          if (child.isMesh) {
            allTargets.push(child);
            meshToBall.set(child, ball);
          }
        });
      } else {
        allTargets.push(ball);
        meshToBall.set(ball, ball);
      }
    });

    var hits = raycaster.intersectObjects(allTargets);
    if (hits.length > 0) {
      var hitMesh = hits[0].object;
      var ball = meshToBall.get(hitMesh) || hitMesh;
      var data = ball.userData;

      if (hovered !== ball) {
        hovered = ball;

        ringV.visible = false;
        ringH.visible = false;
        ringVDeprecated.visible = false;
        ringHDeprecated.visible = false;

        var worldPos = getWorldPos(ball);
        var isDep = data.alive === 0;

        if (isDep) {
          ringVDeprecated.position.copy(worldPos);
          ringVDeprecated.visible = true;
          ringHDeprecated.position.copy(worldPos);
          ringHDeprecated.visible = true;
        } else {
          ringV.position.copy(worldPos);
          ringV.visible = true;
          ringH.position.copy(worldPos);
          ringH.visible = true;
        }

        updateStatus(data);
      }
    } else {
      if (hovered) {
        hovered = null;
        ringV.visible = false;
        ringH.visible = false;
        ringVDeprecated.visible = false;
        ringHDeprecated.visible = false;
        updateStatus(null);
      }
    }
  });

  renderer.domElement.addEventListener('click', function (e) {
    var r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var allTargets = [];
    var meshToBall = new Map();

    balls.forEach(function (ball) {
      if (ball.isGroup) {
        ball.traverse(function (child) {
          if (child.isMesh) {
            allTargets.push(child);
            meshToBall.set(child, ball);
          }
        });
      } else {
        allTargets.push(ball);
        meshToBall.set(ball, ball);
      }
    });

    var hits = raycaster.intersectObjects(allTargets);
    if (hits.length > 0) {
      var ball = meshToBall.get(hits[0].object) || hits[0].object;
      var d = ball.userData;
      if (d.permalink) window.location.href = d.permalink;
    }
  });

  var resetBtn = document.getElementById('btn-reset-nav3d');
  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      camera.position.set(-maxX * 0.8, maxY * 1.2, -maxZ * 0.8);
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

    if (hovered) {
      var worldPos = getWorldPos(hovered);
      if (ringV.visible) {
        ringV.position.copy(worldPos);
        ringH.position.copy(worldPos);
      }
      if (ringVDeprecated.visible) {
        ringVDeprecated.position.copy(worldPos);
        ringHDeprecated.position.copy(worldPos);
      }
    }

    renderer.render(scene, camera);
  }
  anim();
});