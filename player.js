import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

const player = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({
    color: 0xff00ff,
  })
);
player.position.set(0, 0, 0);
player.castShadow = true;
player.receiveShadow = true;

export { player };
