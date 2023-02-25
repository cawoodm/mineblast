import * as THREE from 'three';
// import Stats from 'stats.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {lights} from './lights';
import {Renderer} from './renderer';
import {Entities} from './entities';
import {Camera} from './camera';
import {Player} from './player';
import {Controls} from './controls';
// Systems
import {Collider} from './CollisionGrid';
import {Lifetime} from './Lifetime';
// Scenes
import {Scene1} from './scene1';

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
  systems.lifetimeManager = new Lifetime();
  entities.add(systems.lifetimeManager);
  scene.add(G.player.mesh);
  entities.add(G.player);
  entities.add(cameraEntity);

  Scene1({config, scene, entities, player});

  lights.forEach((light) => scene.add(light));

  // scene.add(new THREE.CameraHelper(camera));
  // const controls = new OrbitControls(G.camera, G.renderer.domElement);
  // controls.target.set(160, 120, 0);
  // controls.update();
  // scene.add(new THREE.AxesHelper(5));
  let {keyunpress, keypress, swipeStart, swipeEnd, swipeMove} = Controls(this);

  document.addEventListener('keydown', keypress.bind(this), false);
  document.addEventListener('keyup', keyunpress.bind(this), false);
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
  systems.lifetimeManager.update = function (delta) {
    let deceased = this.tick(delta);
    deceased.forEach((id) => {
      G.entities.removeById(id);
    });
  };
  this.shoot = () => {
    this.player.shoot();
    this.entities.getById('camera').shake(new THREE.Vector3(1, -1, 0), 250);
  };
  this.pause = () => {
    this.state.running = this.state.running === true ? false : true;
    if (this.state.running) this.run();
  };
  this.debug = () => {
    this.state.debug = this.state.debug === true ? false : true;
  };
  this.toggleStats = () => {
    this.stats.dom.style.display = this.stats.dom.style.display === 'none' ? '' : 'none';
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
    if (e.tags?.includes('bullet')) systems.lifetimeManager.add(e, 3000);
  }
  function onRemove(e) {
    if (e.collider?.grid && e.tags.includes('static')) systems.gridCollider.remove(e.collider.grid);
  }
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
  //_APP.stats = new Stats();
  if (_APP.stats) {
    document.body.appendChild(_APP.stats.dom);
    requestAnimationFrame(function sloop() {
      _APP.stats.update();
      requestAnimationFrame(sloop);
    });
  }
  window._APP = _APP;
});
