import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { Bullet } from "./bullet";

function Player({ config, scene, entities }) {
  const player = new THREE.Group();
  let mat = new THREE.MeshStandardMaterial({ color: 0xff00ff }); // , opacity: 0.5, transparent: true });
  let sprite = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      if (!sprite[3 - j][i]) continue;
      let block = new THREE.Mesh(new THREE.BoxGeometry(config.blockWidth * config.blockScale, config.blockHeight * config.blockScale, 2), mat);
      block.position.set(i * config.blockWidth, j * config.blockHeight, 0);
      //block.castShadow = true;
      player.add(block);
    }
  player.left = function () {
    this.speed.x -= 1;
  };
  player.right = function () {
    this.speed.x += 1;
  };
  player.shoot = function () {
    let bullet = new Bullet(config);
    bullet.position.set(player.position.x + 1.5 * config.blockWidth, player.position.y + 4 * config.blockHeight, 0);
    player.add(bullet);
    scene.add(bullet);
    entities.add(bullet);
    //console.log(entities);
  };
  player.update = function (d) {
    this.position.x += this.speed.x;
  };
  player.speed = { x: 0, y: 0 };
  scene.add(player);
  entities.add(player);
  return player;
}

export { Player };
