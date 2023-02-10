import * as THREE from 'three';
import {Boxel} from './boxel';

function Scene1({config, scene, entities, player}) {
  const materials = {
    floor: new THREE.MeshStandardMaterial({color: 0x338833}),
    roof: new THREE.MeshStandardMaterial({color: 0xcccccc}),
    crystal: new THREE.MeshStandardMaterial({color: 0x4477dd}),
    collider: new THREE.MeshStandardMaterial({color: 0x880000, transparent: true, opacity: 0.5}),
  };

  const {boxel, worldPos} = Boxel({config, scene, entities});
  let W = config.blockWidth;
  let H = config.blockHeight;
  let X = config.XW / W;
  let Y = config.YH / H;
  for (let x = 0; x < X; x++) for (let y = 0; y <= 3; y++) if (y <= 3) boxi(x, y, ['static', 'floor'], materials.floor);

  let lastY = Y - Math.random() * 20;
  for (let x = 0; x < X; x++) {
    let yRand = (Y - Math.random() * 20 + lastY) / 2; // Average
    let mat = materials.roof;
    let tags = ['static', 'roof'];
    if (Math.random() > 0.75) {
      tags.push('crystal');
      mat = materials.crystal;
    }
    for (let y = Y; y > yRand; y--) {
      boxi(x, y, tags, mat);
    }
    lastY = yRand;
  }

  // Add a collision box the size of our scene to stop player leaving
  boxi(0, 4, 'boundsLeft', config.showColliders && materials.collider);

  player.mesh.position.set(...worldPos(10, 4), 0);

  function boxi(x, y, tags, mat) {
    entities.add(boxel(x, y, tags, mat));
  }
}

export {Scene1};
