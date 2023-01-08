import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { lights } from "./lights.js";
import { Camera } from "./camera.js";
import { background } from "./background.js";
import { player } from "./player.js";
import { scene } from "./scene1.js";

class Main {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: false,
    });
    this._threejs.setPixelRatio(window.devicePixelRatio);
    let windowScale = Math.min(Math.floor(window.innerWidth / 320), Math.floor(window.innerHeight / 240));
    let windowSize = { w: windowScale * 320, h: windowScale * 240 };
    let windowAspect = windowSize.w / windowSize.h;
    console.log("scale=", windowScale, "aspect=", windowAspect, "size=", windowSize);
    this._threejs.setSize(windowSize.w, windowSize.h);
    document.body.appendChild(this._threejs.domElement);
    window.addEventListener("resize", this._OnWindowResize.bind(this), false);

    this.scene = scene;

    this.camera = Camera(320, 240, windowScale, windowAspect);

    lights.forEach((light) => this.scene.add(light));

    const controls = new OrbitControls(this.camera, this._threejs.domElement);
    controls.target.set(160, 120, 0);
    controls.update();

    //scene.add(new THREE.AxesHelper(5));
    scene.add(background);
    scene.add(player);

    // scene.background = texture;

    this._RAF();
  }

  _OnWindowResize() {
    console.log(this.camera.aspect);
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    // this.camera.updateProjectionMatrix();
    // this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this.scene, this.camera);
      this._RAF();
    });
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new Main();
});
