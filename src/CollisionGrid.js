/**
 * An Optimized Axis-aligned bounding boxes (O-AABB)
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
    // console.log('add', obj);
    let X1 = Math.floor(obj.x / W);
    let X2 = Math.ceil(objWidth + obj.x / W);
    let Y1 = Math.floor(obj.y / H);
    let Y2 = Math.ceil(objHeight + obj.y / H);
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++) {
        if (this.grid[y][x].indexOf(obj) < 0) {
          if (obj.id === 'boxel_133') {
            // console.log('Adding boxel_133', y, x);
          }
          this.grid[y][x].push(obj);
        }
      }
  };
  this.collides = function (obj) {
    const TOL = 0.0001; // No collision if objects are perfectly aligned
    if (typeof obj.x !== 'number' || typeof obj.y !== 'number' || typeof obj.w !== 'number' || typeof obj.h !== 'number') throw new Exception('Cannot check collision of object', o);
    // Narrow search range to only grid overlap zone
    let X1 = Math.floor(obj.x / W);
    let X2 = Math.ceil((objWidth + obj.x) / W);
    let Y1 = Math.floor(obj.y / H);
    let Y2 = Math.ceil((objHeight + obj.y) / H);
    let res = [];
    for (let y = Y1; y <= Y2 && y < this.grid.length; y++)
      for (let x = X1; x <= X2 && x < this.grid[0].length; x++)
        this.grid[y][x].forEach((o) => {
          // TODO: Check obj.x against o.x
          // if (o.id === 'boxel_133') debugger;
          if ((between(obj.x + TOL, o.x, o.x + o.w) || between(obj.x + obj.w - TOL, o.x, o.x + o.w)) && (between(obj.y + TOL, o.y, o.y + o.h) || between(obj.y + obj.h - TOL, o.y, o.y + o.h))) if (obj !== o && res.indexOf(o) < 0) res.push(o);
        });
    return res;
  };
  function between(a, b, c) {
    return a > b && a < c;
  }

  this.remove = function (obj) {
    let X1 = Math.floor(obj.x / W);
    let X2 = Math.ceil((objWidth + obj.x) / W);
    let Y1 = Math.floor(obj.y / H);
    let Y2 = Math.ceil((objHeight + obj.y) / H);
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++) {
        //if (obj.id === 'boxel_133') console.log('Removing boxel_133', y, x);
        removeFromArray(this.grid[y][x], obj);
      }
  };

  return this;
}

function removeFromArray(arr, o) {
  const index = arr.indexOf(o);
  if (index < 0) throw new Error('CollisionGrid cannot remove unknown object', o);
  arr.splice(index, 1);
  // console.log('GridCollider removed', o);
}

export {Collider};
