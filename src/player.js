import * as THREE from 'three';
import {Boxel} from './boxel';
import {Bullet} from './bullet';
import {pewpew} from './soundFX';
import {easeInOutQuart, recoil} from './easing';
//const {soundEffect} = require('./sound');

function Player({config, entities}) {
  let {boxel} = Boxel({config});
  this.id = 'player';
  this.speed = {x: 0, y: 0};
  this.mesh = new THREE.Group();
  this.boxels = [];
  let mat = new THREE.MeshStandardMaterial({color: 0xcc00cc}); // , opacity: 0.5, transparent: true });
  let sprite = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!sprite[3 - j][i]) continue;
      let box = boxel(i, j, 'player', mat);
      this.boxels.push(box);
      if (j >= 2) box.mesh.name = 'barrel'; // Of the gun
      this.mesh.add(box.mesh);
    }
  }
  this.recoilers = Recoilers(this.mesh.children.filter((m) => m.name === 'barrel'));
  this.shoot = function () {
    let bullet = Bullet(boxel);
    this.recoilers.start();
    pewpew();
    // TODO: Mesh position is center of block!
    bullet.mesh.position.set(this.mesh.position.x + 2 * config.blockWidth, this.mesh.position.y + 3 * config.blockHeight, this.mesh.position.z);
    entities.add(bullet);
  };
  this.push = function (force) {
    this.acceleration += force;
    this.start = true;
  };
  this.left = function (force = 1) {
    // if (typeof force === 'undefined') {
    //   this.direction = -1;
    //   this.start = true;
    //   this.force = force;
    // } else if (force === 0) {
    //   // Stop applying keyboard force
    //   this.direction = 0;
    //   this.start = false;
    //   this.force = 0;
    // } else {
    //   // Force applied from swipe
    this.direction = -1;
    this.start = true;
    this.force = force;
  };
  this.right = function (force = 1) {
    this.direction = 1;
    this.start = true;
    this.force = force;
  };
  this.update = function (delta) {
    // Gun recoil
    this.recoilers.update();
    // Easing
    if (this.start) {
      this.timer = Date.now();
      this.timerOffset = 0;
      this.start = false;
    }
    if (this.direction) {
      let t = Date.now() - this.timer;
      let maxSpeed = 4;
      let duration = 200; // 300ms
      if (t >= duration) {
        this.acceleration = 0;
        this.direction = 0;
        this.speed.x = 0;
      } else {
        this.speed.x = this.force * this.direction * easeInOutQuart(t, 0, maxSpeed, duration);
      }
    }
    // Update collision grid of my boxels
    this.boxels.forEach((boxel) => {
      boxel.collider.grid.x = this.mesh.position.x + boxel.mesh.position.x;
      boxel.collider.grid.y = this.mesh.position.y + boxel.mesh.position.y;
    });
    // TODO: Collision detection
    let newX = this.mesh.position.x + (this.speed.x * delta) / 10;
    if (newX < 0 || newX >= config.XW - 3 * config.blockWidth) this.speed.x = 0;
    else this.mesh.position.x = newX;
  };

  this.speed = {x: 0, y: 0};
  this.tags = ['player'];
  return this;
}

function Recoilers(meshes) {
  const recs = meshes.map((m) => recoiler(m));
  return {
    running: false,
    start() {
      if (this.running) this.stop();
      recs.forEach((r) => r.start());
      this.running = true;
    },
    update() {
      if (!this.running) return;
      recs.forEach((r) => r.update());
    },
    stop() {
      recs.forEach((r) => r.stop());
      this.running = false;
    },
  };
}

function recoiler(m) {
  const mesh = m;
  return {
    start() {
      this.timer = Date.now();
      this.timerOffset = 0;
      this.startPosition = {y: mesh.position.y};
    },
    update() {
      let t = Date.now() - this.timer;
      let maxY = 4;
      let duration = 120; // ms
      if (t >= duration) {
        return this.stop(mesh);
      }
      mesh.position.y = this.startPosition.y - recoil(t, 0, maxY, duration);
    },
    stop() {
      mesh.position.y = this.startPosition.y;
    },
  };
}

export {Player};
