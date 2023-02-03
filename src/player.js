import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

function Player(config) {
  const player = new THREE.Group();
  let mat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
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
  return player;
}

export { Player };
