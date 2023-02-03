import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { lights } from "./lights";
import { Renderer } from "./renderer";
import { Entities } from "./entities";
import { Camera } from "./camera";
import { background } from "./background";
import { Player } from "./player";
import { Scene1 } from "./scene1";
import { Collider } from "./CollisionGrid";

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
  let state, camera, renderer, player, scene, entities;
  entities = new Entities({ onAdd, onRemove });
  scene = new THREE.Scene();
  let sys = { state, config, scene, player, entities, camera, renderer };

  sys.renderer = new Renderer(config);

  lights.forEach((light) => scene.add(light));
  config.windowAspect = config.windowSize.w / config.windowSize.h;
  sys.camera = Camera(config.XW, config.YH, config.windowScale, config.windowAspect);

  sys.player = Player(sys);

  Scene1(sys);

  scene.add(background);

  // scene.add(new THREE.CameraHelper(camera));
  // const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(160, 120, 0); controls.update();
  // scene.add(new THREE.AxesHelper(5));

  window.addEventListener("keydown", keypress.bind(this), false);
  window.addEventListener("resize", windowResize.bind(this), false);
  this.update = function () {
    this.entities.e.forEach((e) => {
      if (typeof e.update === "function") e.update();
    });
  };
  this.run = function () {
    window.requestAnimationFrame(this.loop.bind(this));
  };
  this.loop = function () {
    if (this.state === "paused") return;
    this.renderer.render(scene, this.camera);
    this.update();
    this.run();
  };
  this.run();
  Object.assign(this, sys);
  return this;
  function onAdd(e) {
    // dp("Entity added", e);
  }
  function onRemove(e) {
    // dp("Entity removed", e);
  }
}

function shoot() {
  _APP.player.shoot();
}
function pause() {
  _APP.state = _APP.state === "paused" ? "running" : "paused";
}
function keypress(e) {
  dp("Keypress", e.code);
  e.preventDefault();
  // e.stopPropagation();
  if (["ArrowUp", "KeyW"].includes(e.code)) return shoot();
  if (["ArrowLeft", "KeyA"].includes(e.code)) return _APP.player.left();
  if (["ArrowRight", "KeyD"].includes(e.code)) return _APP.player.right();
  if (e.code === "KeyS") console.log(_APP.scene);
  if (e.code === "KeyP") pause();
}
const dp = console.log.bind(console);
function windowResize() {
  console.log(this.camera.aspect);
  // this.camera.aspect = window.innerWidth / window.innerHeight;
  // this.camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new Game();
  window._APP = _APP;
});
