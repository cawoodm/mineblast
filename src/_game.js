import * as THREE from 'three';
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
  XW: 256,
  YH: 224,
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
  const cameraEntity = Camera(G.config.XW, G.config.YH, G.config.windowScale, G.config.windowAspect);
  G.camera = cameraEntity.camera;
  G.player = new Player(G);
  G.state = {};

  let {systems, entities, scene, player} = G;

  systems.gridCollider = new Collider(config);
  entities.add(systems.gridCollider);
  scene.add(G.player.mesh);
  entities.add(G.player);
  entities.add(cameraEntity);

  Scene1({config, scene, entities, player});

  scene.add(background);

  lights.forEach((light) => scene.add(light));

  // scene.add(new THREE.CameraHelper(camera));
  // const controls = new OrbitControls(G.camera, G.renderer.domElement);
  // controls.target.set(160, 120, 0);
  // controls.update();
  // scene.add(new THREE.AxesHelper(5));

  document.addEventListener('keydown', keypress.bind(this), false);
  document.addEventListener('resize', windowResize.bind(this), false);
  document.addEventListener('touchstart', swipeStart.bind(this), false);
  document.addEventListener('touchend', swipeEnd.bind(this), false);
  document.addEventListener('touchmove', swipeMove.bind(this), false);
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
  this.loop = function (timestamp) {
    if (!this.state.running) {
      this.state.timestamp = 0;
      return;
    }
    // requestAnimationFrame(function sloop() {stats.update(); requestAnimationFrame(sloop)});
    this.update(timestamp);
    this.render();
    window.requestAnimationFrame(this.loop.bind(this));
  };
  systems.gridCollider.update = function () {
    let bullets = entities.getByTag('bullet');
    bullets.forEach((bullet) => {
      let collisions = this.collides({x: bullet.mesh.position.x, y: bullet.mesh.position.y, w: bullet.collider.grid.w, h: bullet.collider.grid.h});
      collisions.forEach((e) => {
        G.entities.removeById(e.id);
        // Bullet should take hit damage and disintegrate
        if (++bullet.damage > 2) entities.removeById(bullet.id);
      });
    });
  };
  Object.assign(this, G);
  this.run();
  return this;
  function onAdd(e) {
    // Add static collision entities to collider
    if (e.collider?.grid && e.tags.includes('static')) systems.gridCollider.add(e.collider.grid);
    e.boxels?.forEach((b) => {
      systems.gridCollider.add({...b.collider.grid, tags: e.tags});
    });
  }
  function onRemove(e) {
    if (e.collider?.grid && e.tags.includes('static')) systems.gridCollider.remove(e.collider.grid);
  }
}

function shoot() {
  _APP.player.shoot();
  _APP.entities.getById('camera').shake(new THREE.Vector3(1, -1, 0), 250);
}
function pause() {
  _APP.state.running = _APP.state.running === true ? false : true;
  if (_APP.state.running) _APP.run();
}
function debug() {
  _APP.state.debug = _APP.state.debug === true ? false : true;
}
function stats() {
  _APP.stats.dom.style.display = _APP.stats.dom.style.display === 'none' ? '' : 'none';
}
function swipeStart(e) {
  if (!this.state.running) return;
  if (!e.touches) return;
  this.state.swipeX = e.touches[0].clientX;
}
function swipeEnd() {
  if (this.state.swipeX !== null) shoot();
}
function swipeMove(e) {
  if (!this.state.running) return;
  if (!e.touches) return;
  if (this.state.swipeX === null) return;
  let deltaX = e.touches[0].clientX - this.state.swipeX;
  if (deltaX > 8) this.player.right();
  else if (deltaX < -8) this.player.left();
  this.state.swipeX = null;
}
// eslint-disable-next-line complexity
function keypress(e) {
  let res = null;
  if (!e.altKey && !e.ctrlKey) {
    if (['ArrowUp', 'KeyW'].includes(e.code)) res = shoot();
    else if (['ArrowLeft', 'KeyA'].includes(e.code)) res = this.player.left();
    else if (['ArrowRight', 'KeyD'].includes(e.code)) res = this.player.right();
    else if (e.code === 'KeyS') res = console.log(this.scene);
    else if (e.code === 'KeyP') res = pause();
    else if (e.code === 'KeyX') res = debug();
    else if (e.code === 'KeyO') res = stats();
    else return;
  } else return;
  if (res === null) {
    e.preventDefault();
    dp('Unhandled keypress', e);
  }
  return res;
}
function dp() {
  if (_APP.state.debug) console.log(...arguments);
}
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
