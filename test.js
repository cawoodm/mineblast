/* global THREE OrbitControls */
let camera, scene, renderer;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.OrthographicCamera();
  //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 10;

  scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://i.imgur.com/W6JfQal.jpg');

  let geometry = new THREE.PlaneGeometry(16, 9); // ensure correct aspect ratio
  let material = new THREE.MeshBasicMaterial({map: texture});

  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // scene.add(new THREE.CameraHelper(camera));
  // const controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.target.set(160, 120, 0);
  // controls.update();

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
