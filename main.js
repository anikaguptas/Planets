import * as THREE from "three";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
const radius = 1.3;
const colors = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
const segments = 80;
const orbitradius = 4.5;
const spheres = new THREE.Group();
const textures = [
  "./2k_mars.jpg",
  "earth.jpg",
  "./venus.jpg",
  "./volcanic.jpg",
];
const Loader = new RGBELoader();
Loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/moonlit_golf_2k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);
const textureLoader = new THREE.TextureLoader();
// Create a big sphere with stars texture
const starSphereRadius = 10; // Adjust this value to make the sphere larger or smaller
const starSphereGeometry = new THREE.SphereGeometry(starSphereRadius, 64, 64);
const starTexture = textureLoader.load("./stars.png");
starTexture.colorSpace = THREE.SRGBColorSpace;
const starSphereMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.3,
});
const starSphere = new THREE.Mesh(starSphereGeometry, starSphereMaterial);
scene.add(starSphere);
const arr = [];
spheres.position.y = -0.8;
for (let i = 0; i < 4; i++) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({});
  let texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
  material.map = texture;
  // material.needsUpdate = true;
  const sphere = new THREE.Mesh(geometry, material);
  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitradius * Math.cos(angle);
  sphere.position.y = orbitradius * Math.sin(angle);
  arr.push(sphere);
  spheres.add(sphere);
}
spheres.rotation.x = 1.68;
scene.add(spheres);
camera.position.z = 8;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
fillLight.position.set(-5, 3, 5);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(0, 5, -5);
scene.add(backLight);

const animate = () => {
  requestAnimationFrame(animate);
  for (let i = 0; i < 4; i++) {
    arr[i].rotation.z += 0.0005;
  }
  renderer.render(scene, camera);
};
let lastWheelTime = 0;
const throttleDelay = 2000; // 1 seconds in milliseconds
let count = 0;
window.addEventListener("wheel", (e) => {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime >= throttleDelay) {
    const headings = document.querySelector(".heading");

    console.log(e);
    lastWheelTime = currentTime;
    if (e.deltaY > 0) {
      console.log("Scrolled down");
      count = (count + 1) % 4;
      console.log(count);
      if (count === 0) {
        gsap.to(headings, {
          duration: 1,
          y: `=${0}%`,
          ease: "power2.inOut",
        });
        gsap.to(spheres.rotation, {
          z: `+=${Math.PI / 2}`,
          duration: 1,
          ease: "expo.easeInOut",
        });
      } else {
        gsap.to(headings, {
          duration: 1,
          y: `-=${100}%`,
          ease: "power2.inOut",
        });
        gsap.to(spheres.rotation, {
          z: `+=${Math.PI / 2}`,
          duration: 1,
          ease: "expo.easeInOut",
        });
      }
    }
  }
});
animate();
