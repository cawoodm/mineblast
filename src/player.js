import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {Boxel} from './boxel';
import {Bullet} from './bullet';
import {soundEffect} from './sound';
import {easeInOutQuart, recoil} from './easing';
//const {soundEffect} = require('./sound');

function Player({config, entities}) {
  let {boxel} = Boxel({config});
  this.id = 'player';
  this.speed = {x: 0, y: 0};
  this.mesh = new THREE.Group();
  this.boxels = [];
  let mat = new THREE.MeshStandardMaterial({color: 0xff00ff}); // , opacity: 0.5, transparent: true });
  let sprite = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      if (!sprite[3 - j][i]) continue;
      let box = boxel(i, j, 'player', mat);
      this.boxels.push(box);
      if (j > 2) box.mesh.name = 'barrel'; // Of the gun
      this.mesh.add(box.mesh);
      //block.castShadow = true;
    }
  this.left = function () {
    if (this.direction === -1) return; // Already moving left
    this.direction = -1;
    this.start = true;
    //if (this.speed.x >= 0) this.speed.x -= 1;
  };
  this.right = function () {
    if (this.direction === 1) return; // Already moving right
    this.direction = 1;
    this.start = true;
    // if (this.direction === -1) this.speed.x = 0;
  };
  this.recoiler = recoiler();
  this.shoot = function () {
    let bullet = Bullet(boxel);
    console.log(this.mesh);
    this.recoiler.start(this.mesh.children[5]);
    pewpew();
    // TODO: Mesh position is center of block!
    bullet.mesh.position.set(this.mesh.position.x + 2 * config.blockWidth, this.mesh.position.y + 3 * config.blockHeight, this.mesh.position.z);
    entities.add(bullet);
  };
  this.update = function (delta) {
    // Gun recoil
    if (this.recoiler.running) {
      this.recoiler.update(this.mesh.children[5]);
      //for (let i = 8; i < 12; i++) console.log(this.mesh.children[i].position);
    }
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
        this.direction = 0;
        this.speed.x = 0;
      } else {
        this.speed.x = this.direction * easeInOutQuart(t, 0, maxSpeed, duration);
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
    //console.log("Player speed", this.mesh.position.x, this.speed.x, (this.speed.x * delta) / 10);
  };

  this.speed = {x: 0, y: 0};
  this.tags = ['player'];
  return this;
  function pewpew() {
    soundEffect(
      1046.5, //frequency
      0.01, //attack
      0.2, //decay
      'square', // waveform type: "sine", "triangle", "square", "sawtooth"
      0.2, //Volume
      -0.8, //pan
      0, //wait before playing
      3200, //pitch bend amount
      false, //reverse bend
      0, //random pitch range
      215, //dissonance
      null, // [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
      undefined, //reverb: [duration, decay, reverse?]
      2 //Maximum duration of sound, in seconds
    );
  }
}

function recoiler() {
  return {
    running: false,
    start(mesh) {
      if (this.running) this.stop(mesh);
      this.running = true;
      this.timer = Date.now();
      this.timerOffset = 0;
      this.startPosition = {y: mesh.position.y};
    },
    update(mesh) {
      let t = Date.now() - this.timer;
      let maxY = 3;
      let duration = 110; // ms
      if (t >= duration) {
        console.log('stop at', mesh.position.y, 'should be', this.startPosition.y);
        return this.stop(mesh);
      }
      mesh.position.y = this.startPosition.y - recoil(t, 0, maxY, duration);
    },
    stop(mesh) {
      mesh.position.y = this.startPosition.y;
      this.running = false;
    },
  };
}

export {Player};
