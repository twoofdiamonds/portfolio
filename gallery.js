// Basic 3D gallery using Three.js + OrbitControls (ES modules)
import * as THREE from "https://unpkg.com/three@0.164.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("scene-container");
const captionEl = document.getElementById("caption");

// List of artworks in the Art/ folder
// Title / description are editable labels for the UI
const artworks = [
  {
    src: "Art/Screenshot 2026-02-26 143259.png",
    title: "Concept sheet 1",
  },
  {
    src: "Art/Screenshot 2026-02-26 143314.png",
    title: "Concept sheet 2",
  },
  {
    src: "Art/Screenshot 2026-02-26 143320.png",
    title: "Concept sheet 3",
  },
  {
    src: "Art/Screenshot 2026-02-26 143328.png",
    title: "Concept sheet 4",
  },
  {
    src: "Art/Screenshot 2026-02-26 143333.png",
    title: "Concept sheet 5",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44.jpeg",
    title: "Slug-napper: Towards a Slug-Free Garden",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (1).jpeg",
    title: "Design poster 1",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (2).jpeg",
    title: "Design poster 2",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (3).jpeg",
    title: "Design poster 3",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (4).jpeg",
    title: "Design poster 4",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (5).jpeg",
    title: "Design poster 5",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (6).jpeg",
    title: "Design poster 6",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (7).jpeg",
    title: "Design poster 7",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (8).jpeg",
    title: "Design poster 8",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (9).jpeg",
    title: "Design poster 9",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (10).jpeg",
    title: "Design poster 10",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (11).jpeg",
    title: "Design poster 11",
  },
];

let renderer, scene, camera, controls;
let raycaster, mouse;
let framedMeshes = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020617);

  const fov = 55;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 200;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 2.5, 14);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 28;
  controls.minPolarAngle = 0.4;
  controls.maxPolarAngle = Math.PI - 0.8;

  // Lighting
  const hemi = new THREE.HemisphereLight(0x9ca3af, 0x020617, 0.55);
  scene.add(hemi);

  const keyLight = new THREE.SpotLight(0x5ce1e6, 2, 40, Math.PI / 6, 0.4, 1);
  keyLight.position.set(8, 10, 10);
  keyLight.target.position.set(0, 3, 0);
  scene.add(keyLight);
  scene.add(keyLight.target);

  const fillLight = new THREE.PointLight(0x3b82f6, 1.3, 35);
  fillLight.position.set(-10, 4, -6);
  scene.add(fillLight);

  // Subtle floor to anchor shadows visually
  const floorGeo = new THREE.CircleGeometry(26, 64);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.9,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  scene.add(floor);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  createGallery();

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("pointermove", onPointerMove);
}

function createGallery() {
  const radius = 12;
  const verticalOffset = 2.3;
  const textureLoader = new THREE.TextureLoader();

  artworks.forEach((art, index) => {
    const angle = (index / artworks.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // All frames use a common aspect ratio; the texture will letterbox if needed
    const frameWidth = 4;
    const frameHeight = 2.5;

    const planeGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
    const texture = textureLoader.load(
      art.src,
      () => {
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = 8;
      },
      undefined,
      () => {
        console.warn("Could not load", art.src);
      }
    );

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.6,
      metalness: 0.1,
    });

    const artworkPlane = new THREE.Mesh(planeGeo, mat);
    artworkPlane.position.set(x, verticalOffset, z);
    artworkPlane.lookAt(0, verticalOffset, 0);

    // Simple frame geometry behind the artwork
    const frameThickness = 0.14;
    const frameDepth = 0.12;
    const outerFrameGeo = new THREE.BoxGeometry(
      frameWidth + frameThickness,
      frameHeight + frameThickness,
      frameDepth
    );
    const innerCutoutGeo = new THREE.BoxGeometry(
      frameWidth,
      frameHeight,
      frameDepth + 0.02
    );

    // Use BSP-like trick with two meshes layered to fake thickness
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.5,
      roughness: 0.3,
    });
    const frameOuter = new THREE.Mesh(outerFrameGeo, frameMat);
    const frameInner = new THREE.Mesh(
      innerCutoutGeo,
      new THREE.MeshStandardMaterial({
        color: 0x0b1020,
        metalness: 0.2,
        roughness: 0.8,
      })
    );
    frameInner.scale.set(0.98, 0.98, 1);

    const frameGroup = new THREE.Group();
    frameGroup.add(frameOuter);
    frameGroup.add(frameInner);
    frameGroup.position.copy(artworkPlane.position);
    frameGroup.quaternion.copy(artworkPlane.quaternion);
    frameGroup.position.add(
      frameGroup.getWorldDirection(new THREE.Vector3()).multiplyScalar(-0.08)
    );

    const group = new THREE.Group();
    group.userData = { title: art.title, src: art.src };
    group.add(frameGroup);
    group.add(artworkPlane);

    scene.add(group);
    framedMeshes.push(group);
  });
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

let hovered = null;

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function updateHover() {
  raycaster.setFromCamera(mouse, camera);

  const objects = framedMeshes.flatMap((group) => group.children);
  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const group = intersects[0].object.parent;
    if (hovered !== group) {
      hovered = group;
      captionEl.textContent = group.userData.title;
      // Add subtle scale highlight
      framedMeshes.forEach((g) => {
        g.scale.setScalar(g === hovered ? 1.05 : 1.0);
      });
    }
  } else if (hovered) {
    hovered = null;
    captionEl.textContent = "Hover a piece to see details";
    framedMeshes.forEach((g) => g.scale.setScalar(1.0));
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateHover();
  renderer.render(scene, camera);
}

