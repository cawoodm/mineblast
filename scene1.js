import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

const scene = new THREE.Scene();

const color = [
  new THREE.MeshStandardMaterial({ color: 0x338833 }),
  new THREE.MeshStandardMaterial({ color: 0x00dd00 }),
  new THREE.MeshStandardMaterial({ color: 0x0000dd }),
];

let W = 5;
let H = 5;
let X = 320 / W;
let Y = 240 / H;
for (let x = 0; x < X; x++) {
  for (let y = 0; y < Y; y++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(W * 0.8, H * 0.8, 2), color[0]);
    box.position.set(W / 2 + x * W, H / 2 + y * H, 0);
    scene.add(box);
  }
}

export { scene };
