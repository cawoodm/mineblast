import * as THREE from 'three';

let lights = [];
let light = new THREE.DirectionalLight(0xffffff, 1.0);
lights.push(light);
light.position.set(0, 200, 100);
// light.target.position.set(0, 0, 0);
// light.castShadow = true;
// light.shadow.bias = -0.001;
// light.shadow.mapSize.width = 2048;
// light.shadow.mapSize.height = 2048;
// light.shadow.camera.near = 0.1;
// light.shadow.camera.far = 500.0;
// light.shadow.camera.near = 0.5;
// light.shadow.camera.far = 500.0;
// light.shadow.camera.left = 100;
// light.shadow.camera.right = -100;
// light.shadow.camera.top = 100;
// light.shadow.camera.bottom = -100;

lights.push(new THREE.AmbientLight(0x999999));

export {lights};
