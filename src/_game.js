import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import Stats from "stats.js";
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
  sys.state = { running: false };

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
    this.state.running = true;
    window.requestAnimationFrame(this.loop.bind(this));
  };
  this.loop = function () {
    if (!this.state.running) return;
    // requestAnimationFrame(function sloop() {stats.update(); requestAnimationFrame(sloop)});
    this.renderer.render(scene, this.camera);
    this.update();
    this.run();
  };
  Object.assign(this, sys);
  this.run();
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
  _APP.state.running = _APP.state.running || false;
}
function stats() {
  _APP.stats.dom.style.display = _APP.stats.dom.style.display === "none" ? "" : "none";
}
function keypress(e) {
  dp("Keypress", e);
  let res = null;
  if (!e.altKey && !e.ctrlKey) {
    if (["ArrowUp", "KeyW"].includes(e.code)) res = shoot();
    else if (["ArrowLeft", "KeyA"].includes(e.code)) res = _APP.player.left();
    else if (["ArrowRight", "KeyD"].includes(e.code)) res = _APP.player.right();
    else if (e.code === "KeyS") res = console.log(_APP.scene);
    else if (e.code === "KeyP") res = pause();
    else if (e.code === "KeyO") res = stats();
    else return;
  } else return;
  if (res === null) e.preventDefault();
  return res;
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
  _APP.stats = new Stats();
  document.body.appendChild(_APP.stats.dom);
  requestAnimationFrame(function sloop() {
    _APP.stats.update();
    requestAnimationFrame(sloop);
  });
  window._APP = _APP;
});
