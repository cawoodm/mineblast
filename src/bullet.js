// import { Boxel } from "./boxel";
/**
 * A Bullet is a boxel which moves
 */
function Bullet(boxel) {
  const speed = 0.3;
  // let mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  return boxel(0, 0, 'bullet', 0xcc0000, function (delta) {
    // TODO: Collision detection
    //console.log("bullet", this.position);
    this.mesh.position.y += (speed * delta) / 10;
  });
  // this.mesh = new THREE.Mesh(new THREE.BoxGeometry(config.blockWidth * config.blockScale, config.blockHeight * config.blockScale, 2), mat);
  //this.update =
  //console.log(bullet);
  // return this;
}

export {Bullet};
