import * as THREE from 'three';
import {CameraShake} from './CameraShake';

function Camera(w, h, scale, aspect) {
  let viewBlock = (0.75 * w) / 2;
  let camera;
  let ortho = true;
  if (ortho) {
    camera = new THREE.OrthographicCamera(-viewBlock * aspect, viewBlock * aspect, viewBlock, -viewBlock, 1, 1000);
    //camera.setViewOffset(0, 0, w, h);
    camera.position.set(w / 2, h / 2, 100);
  } else {
    camera = new THREE.PerspectiveCamera(60, aspect, 1.0, 1000.0);
    camera.position.set(w / 2, h / 2, 300);
  }
  let cameraShake = CameraShake();
  return {
    camera,
    id: 'camera',
    update() {
      cameraShake.update(camera);
    },
    shake(vecToAdd, milliseconds) {
      cameraShake.shake(camera, vecToAdd, milliseconds);
    },
  };
}

export {Camera};
