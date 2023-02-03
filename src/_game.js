import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import Stats from 'stats.js';
// import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {lights} from './lights';
import {Renderer} from './renderer';
import {Entities} from './entities';
import {Camera} from './camera';
import {background} from './background';
import {Player} from './player';
import {Scene1} from './scene1';
import {Collider} from './CollisionGrid';

const config = {
  XW: 320,
  YH: 240,
  blockWidth: 5,
  blockHeight: 5,
  blockScale: 0.8,
  windowScale: 1,
  windowSize: {w: window.innerWidth, h: window.innerHeight},
  showColliders: true,
};
config.windowAspect = config.windowSize.w / config.windowSize.h;

function Game() {
  let G = {config};
  G.systems = {};
  G.scene = new THREE.Scene();
  G.entities = new Entities({onAdd, onRemove, scene: G.scene});
  G.renderer = new Renderer(G.config);
  G.state = {running: false};
  G.camera = Camera(G.config.XW, G.config.YH, G.config.windowScale, G.config.windowAspect);
  G.player = new Player(G);
  G.state = {};

  let {systems, entities, scene, player} = G;

  systems.gridCollider = new Collider(config);
  entities.add(systems.gridCollider);
  scene.add(G.player.mesh);
  entities.add(G.player);

  Scene1({config, scene, entities, player});

  scene.add(background);

  lights.forEach((light) => scene.add(light));

  // scene.add(new THREE.CameraHelper(camera));
  // const controls = new OrbitControls(G.camera, G.renderer.domElement);
  // controls.target.set(160, 120, 0);
  // controls.update();
  // scene.add(new THREE.AxesHelper(5));

  window.addEventListener('keydown', keypress.bind(this), false);
  window.addEventListener('resize', windowResize.bind(this), false);
  this.update = function (timestamp) {
    let delta = G.state.timestamp ? timestamp - G.state.timestamp : 0;
    this.entities.e.forEach((e) => {
      if (typeof e.update === 'function') e.update(delta);
    });
    G.state.timestamp = timestamp;
  };
  this.run = function () {
    this.state.running = true;
    window.requestAnimationFrame(this.loop.bind(this));
  };
  this.render = function () {
    this.renderer.render(scene, this.camera);
  };
  this.loop = function (d) {
    if (!this.state.running) return;
    // requestAnimationFrame(function sloop() {stats.update(); requestAnimationFrame(sloop)});
    this.update(d);
    this.render();
    window.requestAnimationFrame(this.loop.bind(this));
  };
  systems.gridCollider.update = function () {
    // dp("gridCollider", delta);
    let bullets = entities.getByTag('bullet');
    bullets.forEach((bullet) => {
      let collidesWith = this.collides({x: bullet.mesh.position.x / config.blockWidth, y: bullet.mesh.position.y / config.blockHeight});
      dp('collidesWith', collidesWith);
    });
  };
  Object.assign(this, G);
  this.run();
  return this;
  function onAdd(e) {
    // Add entity to collider if it has the "collision" Component
    if (e.collider?.grid) systems.gridCollider.add({...e.collider.grid, tag: e.tags});
    if (e.boxels)
      e.boxels.forEach((b) => {
        systems.gridCollider.add({...b.collider.grid, tag: e.tag});
      });
    // dp("Entity added", e);
  }
  function onRemove(e) {
    if (e.collider?.grid) systems.gridCollider.remove(e.collider.grid);
    // dp("Entity removed", e);
  }
}

function shoot() {
  _APP.player.shoot();
}
function pause() {
  _APP.state.running = _APP.state.running === true ? false : true;
}
function stats() {
  _APP.stats.dom.style.display = _APP.stats.dom.style.display === 'none' ? '' : 'none';
}
function keypress(e) {
  let res = null;
  if (!e.altKey && !e.ctrlKey) {
    if (['ArrowUp', 'KeyW'].includes(e.code)) res = shoot();
    else if (['ArrowLeft', 'KeyA'].includes(e.code)) res = _APP.player.left();
    else if (['ArrowRight', 'KeyD'].includes(e.code)) res = _APP.player.right();
    else if (e.code === 'KeyS') res = console.log(_APP.scene);
    else if (e.code === 'KeyP') res = pause();
    else if (e.code === 'KeyO') res = stats();
    else return;
  } else return;
  if (res === null) {
    e.preventDefault();
    dp('Unhandled keypress', e);
  }
  return res;
}
const dp = console.log.bind(console);
function windowResize() {
  // console.log(this.camera.aspect);
  // this.camera.aspect = window.innerWidth / window.innerHeight;
  // this.camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new Game();
  _APP.stats = new Stats();
  document.body.appendChild(_APP.stats.dom);
  requestAnimationFrame(function sloop() {
    _APP.stats.update();
    requestAnimationFrame(sloop);
  });
  window._APP = _APP;
});
