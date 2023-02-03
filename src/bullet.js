import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

function Bullet(config) {
  let mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  let bullet = new THREE.Mesh(new THREE.BoxGeometry(config.blockWidth * config.blockScale, config.blockHeight * config.blockScale, 2), mat);
  bullet.update = update;
  //console.log(bullet);
  return bullet;
}

function update(d) {
  //console.log("bullet", this.position);
  this.position.y += 1;
}

export { Bullet };
