// WOLF MODEL v5 — refined low-poly lupino (head narrow, long snout, ear tilt, leg bends)
// Direct CDN imports
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

console.log("Wolf script v5 loaded");

// ---------- Scene / Camera / Renderer ----------
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071017);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(7.5, 3.8, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// ---------- Lights ----------
const dirLight = new THREE.DirectionalLight(0xffffff, 3.2);
dirLight.position.set(7, 12, 6);
dirLight.castShadow = true;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0x6b7f8a, 0x071018, 0.12);
scene.add(hemi);

const fill = new THREE.PointLight(0xffffff, 0.22);
fill.position.set(-5, 4, -4);
scene.add(fill);

// ---------- Ground ----------
const groundMat = new THREE.MeshStandardMaterial({ color: 0x121416, metalness: 0.06, roughness: 0.74 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 6), shadowMat);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.set(0, 0.01, 0);
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);

// ---------- Materials ----------
const metalMat = new THREE.MeshStandardMaterial({
  color: 0x93a6b1,
  metalness: 0.95,
  roughness: 0.10,
  flatShading: true
});
const darkMat = new THREE.MeshStandardMaterial({
  color: 0x0f1216,
  metalness: 0.66,
  roughness: 0.16,
  flatShading: true
});
const accentMat = new THREE.MeshStandardMaterial({
  color: 0x0b2f3a,
  emissive: new THREE.Color(0x00dfff),
  emissiveIntensity: 1.0,
  metalness: 0.4,
  roughness: 0.12,
  flatShading: true
});
metalMat.needsUpdate = darkMat.needsUpdate = accentMat.needsUpdate = true;

// ---------- Wolf Group ----------
const wolf = new THREE.Group();
wolf.name = 'robot_wolf';
scene.add(wolf);
wolf.position.y = 1.25; // a bit lower than v4 but lifted off ground

// ---------- Torso: narrow, tapered ----------
const torso = new THREE.Group();
wolf.add(torso);

// chest (front) - narrower in Z
const chestGeom = new THREE.BoxGeometry(1.22, 0.66, 0.48);
const chest = new THREE.Mesh(chestGeom, metalMat);
chest.position.set(0.5, 0, 0);
chest.castShadow = true;
torso.add(chest);

// rear (tapered): use a box rotated slightly and scaled to look narrower
const rearGeom = new THREE.BoxGeometry(1.05, 0.56, 0.42);
const rear = new THREE.Mesh(rearGeom, metalMat);
rear.position.set(-0.6, -0.03, 0);
rear.rotation.y = 0.02; // tiny twist to break perfect boxy look
rear.castShadow = true;
torso.add(rear);

// ---------- Neck + Head (narrow head, long snout) ----------
const neck = new THREE.Group();
neck.position.set(1.20, 0.16, 0);
torso.add(neck);

const head = new THREE.Group();
head.position.set(0.22, 0.32, 0);
neck.add(head);

// head block (narrower X and Z)
const headMain = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), metalMat);
headMain.scale.set(1.2,1,1);
headMain.position.set(0,.02,0);
headMain.castShadow = true;
head.add(headMain);

// Snout — triangular prism (thinner and longer)
const snoutLen = 0.5;
const snout = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.08, snoutLen, 3, 1, false),
  darkMat
);
snout.rotation.y=0;
snout.rotation.z = Math.PI / 2;
snout.rotation.x = Math.PI / 2 - 0.12; //inclinação -12
snout.scale.set(1,0.75,0.75);
snout.position.set(0.5, -0.05, 0);
snout.castShadow = true;
head.add(snout);

// Nose tip
const nose = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.06, 0.10), darkMat);
nose.position.set(0.4 + snoutLen / 2 + 0.05, -0.03, 0);
nose.castShadow = true;
head.add(nose);

// Ears: taller, slimmer, more tilted outward
function makeEar(x, z, side) {
  const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 3), metalMat);
  ear.position.set(x, 0.28, z);
  ear.scale.set(0.7, 1.6, 0.7);
  ear.rotation.x = -0.75;
  ear.rotation.z = side * 0.45; 
  ear.rotation.y = side * 1.2;
  ear.castShadow = true;
  return ear;
}
const leftEar = makeEar(0.06 , 0.10, 1);
const rightEar = makeEar(0.06, -0.20, -1);
head.add(leftEar, rightEar);

// Eyes: smaller rectangles/spheres closer to snout to emphasize muzzle
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.044, 6, 6), accentMat.clone());
leftEye.position.set(0.34, 0.05, 0.10);
leftEye.castShadow = false;
const rightEye = leftEye.clone();
rightEye.position.z = -0.10;
head.add(leftEye, rightEye);

// Eye light glow
const eyeLightL = new THREE.PointLight(0x00dfff, 1.0, 2.4, 2);
eyeLightL.position.copy(leftEye.position);
head.add(eyeLightL);
const eyeLightR = new THREE.PointLight(0x00dfff, 1.0, 2.4, 2);
eyeLightR.position.copy(rightEye.position);
head.add(eyeLightR);
/*
// Jaw: slightly narrower and with angled lower face
const jaw = new THREE.Group();
jaw.position.set(1.03, -0.12, 0);
head.add(jaw);
const jawBox = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.13, 0.34), darkMat);
jawBox.castShadow = true;
jaw.add(jawBox);
*/

// ----------------- Tail (long thin, more curved) -----------------
const tailGroup = new THREE.Group();
tailGroup.position.set(-1.05, -0.02, 0);
torso.add(tailGroup);
const tailBase = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.085, 0.10), metalMat);
tailBase.position.set(-0.5, 0, 0);
tailBase.castShadow = true;
tailGroup.add(tailBase);
const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.07, 0.08), darkMat);
tailTip.position.set(-1.0, 0, 0);
tailTip.castShadow = true;
tailGroup.add(tailTip);
tailGroup.rotation.z = 0.46; // more raised

// ---------- Legs (pose: slight bends, longer, slimmer) ----------
function makeLeg(xOffset, zOffset, isFront = true) {
  const leg = new THREE.Group();
  // start hip higher so leg appears longer
  leg.position.set(xOffset, -0.30, zOffset);

  // upper: slightly angled back (hip)
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.48, 0.18), metalMat);
  upper.position.set(0, -0.22, 0);
  upper.castShadow = true;
  upper.rotation.x = isFront ? 0.05 : -0.06; // front legs slightly forward, back legs slightly backward

  // knee group: lower leg with forward bend
  const lowerGroup = new THREE.Group();
  lowerGroup.position.set(0, -0.46, 0);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.44, 0.16), darkMat);
  lower.position.set(0, -0.22, 0);
  lower.castShadow = true;
  // bend the lower so paw is forward
  lower.rotation.x = isFront ? -0.08 : -0.14;

  // paw smaller and flat
  const paw = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.07, 0.30), darkMat);
  paw.position.set(0, -0.46, 0.045);
  paw.castShadow = true;

  lowerGroup.add(lower, paw);
  leg.add(upper, lowerGroup);
  return { legGroup: leg, upper, lowerGroup, paw };
}

const legs = [];
legs.push(makeLeg(0.82, -0.26, true));  // front right
legs.push(makeLeg(0.82, 0.26, true));   // front left
legs.push(makeLeg(-0.55, -0.26, false)); // back right
legs.push(makeLeg(-0.55, 0.26, false));  // back left

legs.forEach(l => {
  torso.add(l.legGroup);
  l.legGroup.traverse(node => { if (node.isMesh) node.castShadow = true; });
});

// ---------- Interaction & audio ----------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let jawOpen = false;
let runMode = false;
let runMultiplier = 1.0;

let audioCtx;
function playBeep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = 420;
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.value = 0.0001;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    o.stop(audioCtx.currentTime + 0.19);
  } catch (e) {}
}

renderer.domElement.addEventListener('pointerdown', (ev) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = - ((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(wolf, true);
  if (hits.length > 0) toggleJaw();
});

let jawAnim = null;
function toggleJaw() {
  jawOpen = !jawOpen;
  playBeep();
  const start = { r: jaw.rotation.x || 0 };
  const end = { r: jawOpen ? -0.62 : 0 };
  const dur = 220;
  const t0 = performance.now();
  jawAnim = (tn) => {
    const p = Math.min(1, (tn - t0) / dur);
    jaw.rotation.x = start.r + (end.r - start.r) * (1 - Math.pow(1 - p, 4));
    if (p < 1) requestAnimationFrame(jawAnim);
    else jawAnim = null;
  };
  requestAnimationFrame(jawAnim);

  const prevL = leftEye.material.emissiveIntensity;
  const prevR = rightEye.material.emissiveIntensity;
  leftEye.material.emissiveIntensity = 3.2;
  rightEye.material.emissiveIntensity = 3.2;
  setTimeout(() => {
    leftEye.material.emissiveIntensity = prevL;
    rightEye.material.emissiveIntensity = prevR;
  }, 140);
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    runMode = !runMode;
    runMultiplier = runMode ? 2.35 : 1.0;
    cameraBump();
  }
});

function cameraBump() {
  const t0 = performance.now();
  const dur = 320;
  const start = camera.position.clone();
  const target = camera.position.clone().add(new THREE.Vector3(0, runMode ? 0.45 : -0.18, runMode ? -0.9 : 0.5));
  function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = p < 0.5 ? (Math.pow(p * 2, 2) / 2) : (1 - Math.pow((1 - p) * 2, 2) / 2);
    camera.position.lerpVectors(start, target, eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---------- Animation ----------
const clock = new THREE.Clock();
let patrolX = 0;
const baseSpeed = 0.88;

function animate() {
  const dt = clock.getDelta();
  const t = clock.elapsedTime * runMultiplier;

  // Patrol
  patrolX += dt * baseSpeed * runMultiplier;
  wolf.position.x = Math.sin(patrolX * 0.6) * 1.2;
  wolf.rotation.y = Math.sin(patrolX * 0.32) * 0.06;

  // gait
  const gait = 5.8 * runMultiplier;
  const phases = [
    Math.sin(t * gait + 0),
    Math.sin(t * gait + Math.PI),
    Math.sin(t * gait + Math.PI / 2),
    Math.sin(t * gait - Math.PI / 2)
  ];
  legs.forEach((l, i) => {
    const ph = phases[i];
    // apply base pose offsets so legs look bent even at rest
    l.legGroup.rotation.x = (0.18 * ph) + (i < 2 ? -0.06 : 0.04);
    l.lowerGroup.rotation.x = Math.max(-0.75, -0.26 * ph) + (i < 2 ? -0.05 : -0.02);
    l.paw.rotation.x = Math.max(-0.28, -0.12 * ph);
  });

  // head subtle
  head.rotation.y = Math.sin(t * 0.9) * 0.18;
  head.rotation.x = Math.sin(t * 1.05) * 0.035;

  // tail
  tailGroup.rotation.z = 0.46 + Math.sin(t * 1.6) * 0.22;

  // eyes
  const pulse = 1.0 + Math.sin(t * 3.2) * 0.32;
  leftEye.material.emissiveIntensity = pulse;
  rightEye.material.emissiveIntensity = pulse;
  eyeLightL.position.copy(leftEye.position);
  eyeLightR.position.copy(rightEye.position);

  // torso micro-movement
  chest.rotation.x = Math.sin(t * 1.2) * 0.006 * runMultiplier;
  rear.rotation.x = Math.sin(t * 1.2) * 0.004 * runMultiplier;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ---------- Resize ----------
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
