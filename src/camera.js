import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function Camera(w, h, scale, aspect) {
  let viewBlock = (0.75 * w) / 2;
  let camera;
  let ortho = false;
  if (ortho) {
    camera = new THREE.OrthographicCamera(-viewBlock * aspect, viewBlock * aspect, viewBlock, -viewBlock, 100, -100);
    //camera.setViewOffset(0, 0, w, h);
    camera.position.set(w / 2, h / 2, 100);
  } else {
    camera = new THREE.PerspectiveCamera(60, w / h, 1.0, 1000.0);
    camera.position.set(w / 2, h / 2, 300);
  }
  return camera;
}

export {Camera};
