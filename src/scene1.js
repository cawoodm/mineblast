import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {Boxel} from './boxel';

function Scene1({config, scene, entities, player}) {
  const materials = {
    floor: new THREE.MeshStandardMaterial({color: 0x338833}),
    roof: new THREE.MeshStandardMaterial({color: 0xcccccc}),
    blue: new THREE.MeshStandardMaterial({color: 0x0000dd}),
    collider: new THREE.MeshStandardMaterial({color: 0x880000, transparent: true, opacity: 0.5}),
  };

  const {boxel, worldPos} = Boxel({config, scene, entities});
  let W = config.blockWidth;
  let H = config.blockHeight;
  let X = config.XW / W;
  let Y = config.YH / H;
  for (let x = 0; x < X; x++)
    for (let y = 0; y < Y; y++)
      if (y <= 3) boxi(x, y, ['static', 'floor'], materials.floor);
      else if (y > Y - 20 && Math.random() > 0.25) boxi(x, y, ['static', 'roof'], materials.roof);

  // Add a collision box the size of our scene to stop player leaving
  boxi(0, 4, 'boundsLeft', config.showColliders && materials.collider);

  player.mesh.position.set(...worldPos(10, 4), 0);

  function boxi(x, y, tags, mat) {
    entities.add(boxel(x, y, tags, mat));
  }
}

export {Scene1};
