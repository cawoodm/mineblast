import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {Boxel} from './boxel';
import {Bullet} from './bullet';

function Player({config, entities}) {
  let {boxel} = Boxel({config});
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
    if (this.speed.x >= 0) this.speed.x -= 1;
  };
  this.right = function () {
    if (this.speed.x <= 0) this.speed.x += 1;
  };
  this.shoot = function () {
    let bullet = Bullet(boxel);
    bullet.mesh.position.set(this.mesh.position.x + 1.5 * config.blockWidth, this.mesh.position.y + 4 * config.blockHeight, this.mesh.position.z);
    entities.add(bullet);
  };
  this.update = function (delta) {
    // TODO: Collision detection
    //this.mesh.position.x += this.speed.x;
    let newX = this.mesh.position.x + (this.speed.x * delta) / 10;
    if (newX < 0 || newX >= config.XW - 3 * config.blockWidth) this.speed.x = 0;
    else this.mesh.position.x = newX;
    //console.log("Player speed", this.mesh.position.x, this.speed.x, (this.speed.x * delta) / 10);
  };
  this.speed = {x: 0, y: 0};
  this.tag = 'player';
  return this;
}

export {Player};
