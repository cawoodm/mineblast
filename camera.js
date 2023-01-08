import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

function Camera(w, h, scale, aspect) {
  let viewBlock = w / 2;
  const camera = new THREE.OrthographicCamera(-viewBlock * aspect, viewBlock * aspect, viewBlock, -viewBlock, 100, -100);
  // let camera = new THREE.PerspectiveCamera(60, w / h, 1.0, 1000.0);
  camera.position.set(w / 2, h / 2, 100);
  camera.zoom = scale;
  return camera;
}

export { Camera };
