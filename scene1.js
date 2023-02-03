import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

function Scene1(scene) {
  const color = [
    new THREE.MeshStandardMaterial({ color: 0x338833 }),
    new THREE.MeshStandardMaterial({ color: 0xcccccc }),
    new THREE.MeshStandardMaterial({ color: 0x0000dd }),
  ];

  let W = 5;
  let H = 5;
  let X = 320 / W;
  let Y = 240 / H;
  for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
      if (y <= 3) {
        // Floor
        boxel(x, y);
      } else if (y > Y - 7) {
        // Roof
        boxel(x, y);
      }
    }
  }
  function boxel(x, y) {
    let w = W * 0.8;
    let h = H * 0.8;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), color[1]);
    box.position.set(W / 2 + x * W, H / 2 + y * H, 0);
    scene.add(box);
  }
}

export { Scene1 };
