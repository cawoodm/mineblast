import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

let mat2 = new THREE.MeshLambertMaterial({
  color: 0x330033,
  opacity: 1,
  blending: THREE.NoBlending,
  side: THREE.FrontSide,
  transparent: false,
  depthTest: false,
  wireframe: false,
});

const background = new THREE.Mesh(new THREE.PlaneGeometry(320, 240, 10, 10), mat2);
background.castShadow = false;
background.receiveShadow = true;
//plane.rotation.x = -Math.PI / 2;
background.position.set(160, 120, 0);

export { background };
