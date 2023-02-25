import * as THREE from 'three';

function Background(config) {
  let material1 = new THREE.MeshStandardMaterial({
    color: 0x333333,
    //color: 0x111111,
    blending: THREE.NoBlending,
    side: THREE.FrontSide,
    //depthTest: false,
    wireframe: false,
  });

  const background1 = new THREE.Mesh(new THREE.PlaneGeometry(config.XW, config.YH, 10, 10), material1);
  background1.position.set(0, 0, -1);
  //background1.position.set(config.XW / 2, config.YH / 2, -1);

  const texture = new THREE.TextureLoader().load('public/background.jpg');
  let aspect = 1200 / 675;
  const material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.3});
  const background = new THREE.Mesh(new THREE.PlaneGeometry(120 * 3, 67 * 3, 10, 10), material);
  //background.rotation.x = -Math.PI / 2;
  background.position.set(config.XW / 2, config.YH / 2, -1);

  background.add(background1);
  return background;
}

export {Background};
