import * as THREE from 'three';
import {Boxel} from './boxel';
import {note} from './soundFX';
import {rnda} from './common';

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
  // https://pages.mtu.edu/~suits/notefreqs.html
  let loNotes = [82.41, 87.31, 98, 110, 123.47, 130.81, 146.83, 164.81, 174.61, 196.0]; // E2-G3
  let hiNotes = [220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440]; // A3-A4
  const randomLoNote = () => note(rnda(loNotes));
  const randomHiNote = () => note(rnda(hiNotes));
  randomLoNote();
  window.setInterval(randomLoNote, 4000);
  window.setInterval(randomHiNote, 2100);
  // Add a collision box the size of our scene to stop player leaving
  boxi(0, 4, 'boundsLeft', config.showColliders && materials.collider);

  player.mesh.position.set(...worldPos(10, 4), 0);

  function boxi(x, y, tags, mat) {
    entities.add(boxel(x, y, tags, mat));
  }
}

export {Scene1};
