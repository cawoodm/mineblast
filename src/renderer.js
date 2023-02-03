import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function Renderer(config) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  //renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //renderer.domElement.style.imageRendering = 'pixelated';
  renderer.setPixelRatio(window.devicePixelRatio);
  // window.innerWidth / config.XW; //
  config.windowScale = Math.min(Math.floor(window.innerWidth / config.XW), Math.floor(window.innerHeight / config.YH));
  // let config.windowSize = { w: windowScale * config.XW, h: windowScale * config.YH };
  renderer.setSize(config.windowSize.w, config.windowSize.h);

  document.body.appendChild(renderer.domElement);

  return renderer;
}

export {Renderer};
