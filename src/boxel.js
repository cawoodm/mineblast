import * as THREE from 'three';
/**
 * A "boxel" is like a pixel but bigger
 * It has a grid collider and can be visible or invisible
 * Visible boxels are displayed as squares in a grid
 * Invisible boxels are mainly used for collision (e.g. boundaries)
 */
function Boxel({config}) {
  let W = config.blockWidth;
  let H = config.blockHeight;
  return {
    worldPos,
    boxel(x, y, tags, material, update) {
      let w = W * 0.8;
      let h = H * 0.8;
      if (typeof material === 'number') material = new THREE.MeshStandardMaterial({color: material});
      const mesh = material && new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
      let id = 'boxel_' + mesh.id;
      //const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), material[1]);
      let [worldX, worldY] = worldPosCenter(x, y);
      if (mesh) mesh.position.set(worldX, worldY, 0);
      return {
        id,
        tags,
        mesh,
        collider: {grid: {id, tags, x: worldX, y: worldY, w: config.blockWidth, h: config.blockHeight}},
        update,
      };
    },
  };

  function worldPosCenter(x, y) {
    return [config.blockWidth / 2 + config.blockWidth * x, config.blockHeight / 2 + config.blockHeight * y];
  }
  function worldPos(x, y) {
    return [config.blockWidth * x, config.blockHeight * y];
  }
}

export {Boxel};
