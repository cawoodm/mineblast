var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);

  scene.add(new THREE.AmbientLight(0x101010));

  let viewBlock = 320 / 2;
  aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(-viewBlock * aspect, viewBlock * aspect, viewBlock, -viewBlock, 1000, -1000);
  camera.position.set(0, 0, 100);

  // Matrix of 64x48 "bloxels" each 5x5 pixels
  const color = new THREE.MeshStandardMaterial({ color: 0x338833 });
  let W = 5;
  let H = 5;
  let X = 320 / W;
  let Y = 240 / H;
  for (let x = -X / 2; x < X / 2; x++) {
    for (let y = -Y / 2; y < Y / 2; y++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(W * 0.8, H * 0.8, 2), color[0]);
      box.position.set(W / 2 + x * W, H / 2 + y * H, 0);
      scene.add(box);
    }
  }
}

function onWindowResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
