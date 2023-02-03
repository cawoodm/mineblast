import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { lights } from "./lights.js";
import { Camera } from "./camera.js";
import { background } from "./background.js";
import { Player } from "./player.js";
import { Scene1 } from "./scene1.js";

const config = {
  XW: 320,
  YH: 240,
  blockWidth: 5,
  blockHeight: 5,
  blockScale: 0.8,
};

class Main {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //renderer.domElement.style.imageRendering = 'pixelated';
    renderer.setPixelRatio(window.devicePixelRatio);
    let windowScale = window.innerWidth / config.XW; // Math.min(Math.floor(window.innerWidth / _W), Math.floor(window.innerHeight / _H));
    let windowSize = { w: windowScale * config.XW, h: windowScale * config.YH };
    let windowAspect = windowSize.w / windowSize.h;
    renderer.setSize(windowSize.w, windowSize.h);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", this._OnWindowResize.bind(this), false);

    scene = new THREE.Scene();

    lights.forEach((light) => scene.add(light));
    this.camera = Camera(config.XW, config.YH, windowScale, windowAspect);

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.target.set(160, 120, 0);
    controls.update();

    this.player = Player(config);
    scene.add(this.player);
    Scene1(scene, this.player, config);

    //scene.add(new THREE.AxesHelper(5));
    scene.add(background);

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
