/**
 * A Simple, Optimized Axis-aligned bounding boxes (SO-AABB)
 *  - Simple because we assume every entity is a 1x1 block
 *  - Optimized because we fast index objects via grid position
 *    in order to speed up collision detection
 */
function Collider(config) {
  let W = config.blockWidth;
  let H = config.blockHeight;
  let X = config.XW / W; // 320/5=64
  let Y = config.YH / H;
  // Assume object is a 1x1 grid block
  let objWidth = 1;
  let objHeight = 1;
  this.grid = [];
  for (let y = 0; y < Y; y++) this.grid.push(Array.from({length: X}, () => []));
  /**
   *
   * @param {*} obj
   */
  this.add = function (obj) {
    // Index object to grid overlap zone
    console.log('add', obj);
    let X1 = Math.floor(obj.x / W);
    let X2 = Math.ceil(objWidth + obj.x / W);
    let Y1 = Math.floor(obj.y / H);
    let Y2 = Math.ceil(objHeight + obj.y / H);
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++) {
        if (this.grid[y][x].indexOf(obj) < 0) this.grid[y][x].push(obj);
      }
  };
  this.collides = function (obj) {
    // Narrow search range to only grid overlap zone
    let X1 = Math.floor(obj.x / W);
    let X2 = Math.ceil(objWidth + obj.x / W);
    let Y1 = Math.floor(obj.y / H);
    let Y2 = Math.ceil(objHeight + obj.y / H);
    let res = [];
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++)
        this.grid[y][x].forEach((o) => {
          if (obj !== o && res.indexOf(o) < 0) res.push(o);
        });
    return res;
  };

  return this;
}

export {Collider};
