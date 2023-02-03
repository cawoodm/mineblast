import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { lights } from "./lights.js";
import { Camera } from "./camera.js";
import { background } from "./background.js";
import { player } from "./player.js";
import { Scene1 } from "./scene1.js";

const _W = 320;
const _H = 240;

class Main {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    let windowScale = 2; // Math.min(Math.floor(window.innerWidth / _W), Math.floor(window.innerHeight / _H));
    let windowSize = { w: windowScale * _W, h: windowScale * _H };
    let windowAspect = windowSize.w / windowSize.h;
    // console.log("scale=", windowScale, "aspect=", windowAspect, "size=", windowSize);
    renderer.setSize(windowSize.w, windowSize.h, true);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", this._OnWindowResize.bind(this), false);

    scene = new THREE.Scene();

    lights.forEach((light) => scene.add(light));
    this.camera = Camera(_W, _H, windowScale, windowAspect);

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.target.set(160, 120, 0);
    controls.update();

    Scene1(scene);

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
    // renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      renderer.render(scene, this.camera);
      this._RAF();
    });
  }
}

let _APP = null;
let renderer, scene;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new Main();
});
