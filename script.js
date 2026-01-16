//old import
/*import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';
*/
//new import
import * as THREE from 'three';
// ORBIT CONTROLS utility (enable moving camera with mouse)
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log("Wolf script v5 loaded");

let audioCtx;
let wolfBuffer = null;

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

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0x6b7f8a, 0x071018, 1);
scene.add(hemi);

const fill = new THREE.PointLight(0xffffff, 1);
fill.position.set(-5, 4, -4);
scene.add(fill);

// ---------- Ground ----------
const groundMat = new THREE.MeshStandardMaterial({ color: 0x121416, metalness: 0.06, roughness: 0.74 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

const GROUND_SIZE_X = 100;
const GROUND_SIZE_Z = 100;

const GROUND_MIN_X = -GROUND_SIZE_X / 2;
const GROUND_MAX_X =  GROUND_SIZE_X / 2;
const GROUND_MIN_Z = -GROUND_SIZE_Z / 2;
const GROUND_MAX_Z =  GROUND_SIZE_Z / 2;
const EDGE_MARGIN = 1.4;

const groundPlane = ground;

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
wolf.position.y = 1.25; // raise above ground

// ---------- Torso: narrow, tapered ----------
const torso = new THREE.Group();
wolf.add(torso);

// chest (front) - narrower in Z
const chestGeom = new THREE.CylinderGeometry(0.38, 0.40, 1, 8);
const chest = new THREE.Mesh(chestGeom, metalMat);
chest.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / -2);
chest.position.set(0.5, 0, 0);
chest.castShadow = true;
torso.add(chest);

// rear (tapered): use a box rotated slightly and scaled to look narrower
const rearGeom = new THREE.CylinderGeometry(0.30, 0.38, 1, 8);
const rear = new THREE.Mesh(rearGeom, metalMat);
rear.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
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
const snoutLen = 0.9;
const snout = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.08, snoutLen, 3, 1, false),
  darkMat
);
snout.rotation.y=0;
snout.rotation.z = Math.PI / 2;
snout.rotation.x = Math.PI / 2 - 0.12; //inclinação -12
snout.scale.set(1,0.9,0.9);
snout.position.set(0.4, -0.06, 0);
snout.castShadow = true;
head.add(snout);

// Nose tip
const nose = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.06, 0.10), darkMat);
nose.position.set(0.3 + snoutLen / 2 + 0.05, -0.03, 0);
nose.castShadow = true;
head.add(nose);

// Ears: taller, slimmer, more tilted outward
function makeEar(side) {
  const ear = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.38, 3),
    metalMat
  );

  // POSIÇÃO — separação real
  ear.position.set(
    0.02,          // ligeiramente atrás do centro da cabeça
    0.30,          // altura
    side * 0.22    // separação esquerda / direita
  );

  // ESCALA low-poly
  ear.scale.set(0.7, 1.4, 0.7);

  // ROTAÇÕES
  ear.rotation.x = side * 0.95;        // inclinar para trás
  ear.rotation.y = side * 0.35;  // abrir em V
  ear.rotation.z = 0.3;            // NÃO usar Z

  ear.castShadow = true;
  return ear;
}
const leftEar  = makeEar( -1);
const rightEar = makeEar(1);
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

// ---------- Jaw (mandíbula) ----------
const jaw = new THREE.Group();
jaw.position.set(0.1, -0.02, 0);
head.add(jaw);

const jawMesh = new THREE.Mesh(new THREE.ConeGeometry(0.1, 1, 4),darkMat);

jawMesh.rotation.z = Math.PI / 2;
jawMesh.position.set(0.10, -0.08, 0);
jawMesh.castShadow = true;

jaw.add(jawMesh);


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
const clickTarget = new THREE.Vector3();
let hastarget = false;

// Jaw
let jawOpen = false;
let runMode = false;
let runMultiplier = 1.0;

// Beep sound
/* 
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
}*/

// Wolf howl sound
function playWolfSound() {
  if (!wolfBuffer || !audioCtx) return;

  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  source.buffer = wolfBuffer;
  source.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.value = 0.4; // volume

  source.start(0);
}

renderer.domElement.addEventListener('pointerdown', (ev) => {
  loadWolfSound();
  
  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = - ((ev.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

   // Clique no LOBO → mandíbula
  const hitsWolf = raycaster.intersectObject(wolf, true);
  if (hitsWolf.length > 0) {
    toggleJaw();
    return; // importante: não processar o chão
  }

  const hits = raycaster.intersectObject(groundPlane,false);//(wolf, true);

  //  Clique no CHÃO → mover alvo
  if (hits.length > 0) 
  {clickTarget.copy(hits[0].point); 
      clickTarget.x = THREE.MathUtils.clamp(
      clickTarget.x,
      GROUND_MIN_X,
      GROUND_MAX_X
    );

    clickTarget.z = THREE.MathUtils.clamp(
      clickTarget.z,
      GROUND_MIN_Z,
      GROUND_MAX_Z
    );
    hastarget = true;}

    //toggleJaw();
});


//let jawOpen = false;
let jawAnim = null;
function toggleJaw() {
  if (jawAnim) return;

  jawOpen = !jawOpen;
  //playBeep();
  playWolfSound();

  const startRot = jaw.rotation.z;
  const endRot = jawOpen ? -0.45 : 0;
  const duration = 220;
  const t0 = performance.now();

  jawAnim = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);

    jaw.rotation.z = startRot + (endRot - startRot) * eased;

    if (p < 1) requestAnimationFrame(jawAnim);
    else jawAnim = null;
  };

  requestAnimationFrame(jawAnim);

  // flash nos olhos
  leftEye.material.emissiveIntensity = 3.2;
  rightEye.material.emissiveIntensity = 3.2;
  setTimeout(() => {
    leftEye.material.emissiveIntensity = 1.0;
    rightEye.material.emissiveIntensity = 1.0;
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

async function loadWolfSound() {
  if (wolfBuffer) return;

  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();

  const response = await fetch(
    'https://www.google.com/logos/fnbx/animal_sounds/wolf.mp3'
  );

  const arrayBuffer = await response.arrayBuffer();
  wolfBuffer = await audioCtx.decodeAudioData(arrayBuffer);
}

function redirectFromEdge() {
  const safeX = THREE.MathUtils.clamp(
    wolf.position.x,
    GROUND_MIN_X + EDGE_MARGIN,
    GROUND_MAX_X - EDGE_MARGIN
  );

  const safeZ = THREE.MathUtils.clamp(
    wolf.position.z,
    GROUND_MIN_Z + EDGE_MARGIN,
    GROUND_MAX_Z - EDGE_MARGIN
  );

  clickTarget.set(
    safeX + (Math.random() - 0.5) * 6,
    0,
    safeZ + (Math.random() - 0.5) * 6
  );

  hastarget = true;
}

function animate() {
  const dt = clock.getDelta();
  const t = clock.elapsedTime * runMultiplier;
  const nearEdge =
  wolf.position.x < GROUND_MIN_X + EDGE_MARGIN ||
  wolf.position.x > GROUND_MAX_X - EDGE_MARGIN ||
  wolf.position.z < GROUND_MIN_Z + EDGE_MARGIN ||
  wolf.position.z > GROUND_MAX_Z - EDGE_MARGIN;

  if (nearEdge) {
    redirectFromEdge();
  }

  // Patrol
  patrolX += dt * baseSpeed * runMultiplier;
  wolf.position.x = Math.sin(patrolX * 0.6) * 1.2;
  if (!hastarget){
  wolf.rotation.y = Math.sin(patrolX * 0.32) * 0.06;
  }
  // Legs
  const gait = 5.8 * runMultiplier;
  const phases = [
    Math.sin(t * gait + 0),
    Math.sin(t * gait + Math.PI),
    Math.sin(t * gait + Math.PI / 2),
    Math.sin(t * gait - Math.PI / 2)
  ];
  legs.forEach((l, i) => {
    const ph = phases[i];
    // movimento para frente / trás (andar)
    l.legGroup.rotation.z = (0.28 * ph) + (i < 2 ? -0.10 : 0.10);

    // dobra do joelho
    l.lowerGroup.rotation.z = Math.max(-0.85, -0.35 * ph);

    // pequena inclinação da pata
    l.paw.rotation.z = Math.max(-0.35, -0.18 * ph);
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

  if (hastarget) {
    const dir = new THREE.Vector3().subVectors(clickTarget, wolf.position);

    dir.y = 0; // keep only horizontal direction

    const dist = dir.length();

    if (dist > 0.15) {
      dir.normalize();

      const targetAngle = Math.atan2(dir.x, dir.z);

      wolf.rotation.y = THREE.MathUtils.lerp( wolf.rotation.y, targetAngle, 0.12 );
    }

    //old movement code
    /*
    wolf.position.add(
    new THREE.Vector3(
      Math.sin(wolf.rotation.y),
      0,
      Math.cos(wolf.rotation.y)
    ).multiplyScalar(dt * 0.6 * runMultiplier)
    );*/

    wolf.position.add(dir.clone().multiplyScalar(dt * 0.6 * runMultiplier));

      wolf.position.x = THREE.MathUtils.clamp(
      wolf.position.x,
      GROUND_MIN_X,
      GROUND_MAX_X
    );

    wolf.position.z = THREE.MathUtils.clamp(
      wolf.position.z,
      GROUND_MIN_Z,
      GROUND_MAX_Z
    );
  }

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
