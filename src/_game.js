import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { lights } from "./lights";
import { Renderer } from "./renderer";
import { Camera } from "./camera";
import { background } from "./background";
import { Player } from "./player";
import { Scene1 } from "./scene1";
import { Bullet } from "./bullet";

const config = {
  XW: 320,
  YH: 240,
  blockWidth: 5,
  blockHeight: 5,
  blockScale: 0.8,
  windowScale: 1,
  windowSize: { w: window.innerWidth, h: window.innerHeight },
};

function Game() {
  let camera, renderer, player, scene, entities;
  entities = [];
  scene = new THREE.Scene();
  let sys = { config, scene, entities };

  renderer = new Renderer(config);

  lights.forEach((light) => scene.add(light));
  config.windowAspect = config.windowSize.w / config.windowSize.h;
  camera = Camera(config.XW, config.YH, config.windowScale, config.windowAspect);

  player = Player(sys);

  Scene1(scene, player, config);

  scene.add(background);

  // scene.add(new THREE.CameraHelper(camera));
  // const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(160, 120, 0); controls.update();
  // scene.add(new THREE.AxesHelper(5));

  window.addEventListener("keydown", keypress.bind(this), false);
  window.addEventListener("resize", windowResize.bind(this), false);
  this.update = function () {
    this.entities.forEach((e) => {
      if (typeof e.update === "function") e.update();
    });
  };
  this.run = function () {
    window.requestAnimationFrame(this.loop.bind(this));
  };
  this.loop = function () {
    this.renderer.render(scene, this.camera);
    this.update();
    this.run();
  };
  this.run();
  Object.assign(this, { camera, renderer, player, scene, entities });
  return this;
}

function shoot() {
  _APP.player.shoot();
}
function keypress(e) {
  dp("Keypress", e.code);
  e.preventDefault();
  e.stopPropagation();
  if (e.code === "Space") return shoot();
  if (e.code === "ArrowLeft") return _APP.player.left();
  if (e.code === "ArrowRight") return _APP.player.right();
  if (e.code === "KeyS") console.log(_APP.scene);
}
const dp = console.log.bind(console);
function windowResize() {
  console.log(this.camera.aspect);
  // this.camera.aspect = window.innerWidth / window.innerHeight;
  // this.camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
}

let _APP = null;
let scene;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new Game();
});
