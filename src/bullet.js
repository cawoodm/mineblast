// import { Boxel } from "./boxel";
/**
 * A Bullet is a boxel which moves
 */
function Bullet(boxel) {
  const speed = 4;
  //const lifetime = 4 * 1000; // 4s
  // let mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  let me = boxel(0, 0, 'bullet', 0xcc0000, function (delta) {
    // TODO: Lifetime
    // TODO: Directions
    // console.log("bullet", this.position);
    // TODO: Replace with a motion system
    this.mesh.position.y += (speed * delta) / 10;
    // console.log(this.lifetime);
    // this.lifetime -= delta;
  });
  me.id = 'bullet' + Date.now();
  me.damage = 0;
  // me.lifetime = lifetime;
  return me;
  // this.mesh = new THREE.Mesh(new THREE.BoxGeometry(config.blockWidth * config.blockScale, config.blockHeight * config.blockScale, 2), mat);
  //this.update =
  //console.log(bullet);
  // return this;
}

export {Bullet};
