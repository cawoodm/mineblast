var camera, scene, canvas, renderer;
var geometry, material, mesh;

const fragmentShader = `
#include <common>
 
uniform vec3 iResolution;
uniform float iTime;
 
// By iq: https://www.shadertoy.com/user/iq  
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
 
    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
 
    // Output to screen
    fragColor = vec4(col,1.0);
}
 
void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
const uniforms = {
  iTime: { value: 0 },
  iResolution: { value: new THREE.Vector3() },
};

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas = renderer.domElement;
  document.body.appendChild(canvas);
  window.addEventListener("resize", onWindowResize, false);

  scene.add(new THREE.AmbientLight(0x101010));

  camera = new THREE.OrthographicCamera(
    -1, // left
    1, // right
    1, // top
    -1, // bottom
    -1, // near,
    1 // far
  );
  const plane = new THREE.PlaneBufferGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  scene.add(new THREE.Mesh(plane, material));

  //   let viewBlock = 320 / 2;
  //   aspect = window.innerWidth / window.innerHeight;
  //   camera = new THREE.OrthographicCamera(-viewBlock * aspect, viewBlock * aspect, viewBlock, -viewBlock, 1000, -1000);
  //   camera.position.set(0, 0, 100);

  //   // Matrix of 64x48 "bloxels" each 5x5 pixels
  //   const color = new THREE.MeshStandardMaterial({ color: 0x338833 });
  //   let W = 5;
  //   let H = 5;
  //   let X = 320 / W;
  //   let Y = 240 / H;
  //   for (let x = -X / 2; x < X / 2; x++) {
  //     for (let y = -Y / 2; y < Y / 2; y++) {
  //       const box = new THREE.Mesh(new THREE.BoxGeometry(W * 0.8, H * 0.8, 2), color[0]);
  //       box.position.set(W / 2 + x * W, H / 2 + y * H, 0);
  //       scene.add(box);
  //     }
  //   }
}
function update(time) {
  time *= 0.001; // convert to seconds
  uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
  uniforms.iTime.value = time;
}

function onWindowResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
  update(time);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();
