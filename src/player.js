import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {Boxel} from './boxel';
import {Bullet} from './bullet';

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
      /*
      let block = new THREE.Mesh(new THREE.BoxGeometry(config.blockWidth * config.blockScale, config.blockHeight * config.blockScale, 2), mat);
      block.position.set(i * config.blockWidth, j * config.blockHeight, 5);
      this.mesh.add(block);
      */
      let box = boxel(i, j, 'player', mat);
      this.boxels.push(box);
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
  this.shoot = function () {
    let bullet = Bullet(boxel);
    // TODO: Mesh position is center of block!
    bullet.mesh.position.set(this.mesh.position.x + 2 * config.blockWidth, this.mesh.position.y + 4 * config.blockHeight, this.mesh.position.z);
    entities.add(bullet);
  };
  this.update = function (delta) {
    // Easing
    if (this.start) {
      this.timer = Date.now();
      this.timerOffset = 0;
      this.start = false;
    }
    if (this.direction) {
      let t = Date.now() - this.timer;
      let maxSpeed = 3;
      let duration = 300; // 1s
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
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  function easeInOutQuart(t, b, c, d) {
    let x = t / d;
    let calc = x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    return lerp(b, c, calc);
  }
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
  this.speed = {x: 0, y: 0};
  this.tags = ['player'];
  return this;
}

export {Player};
