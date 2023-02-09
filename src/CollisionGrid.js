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
  this.gridLoop = function (obj) {
    let grid = this.grid;
    return (fcn) => {
      let X1 = Math.floor(obj.x / W);
      let X2 = Math.ceil((objWidth + obj.x) / W);
      let Y1 = Math.floor(obj.y / H);
      let Y2 = Math.ceil((objHeight + obj.y) / H);
      for (let y = Y1; y <= Y2 && y < grid.length; y++)
        for (let x = X1; x <= X2 && x < grid[0].length; x++) {
          fcn(x, y, obj);
        }
    };
  };
  this.add = function (obj) {
    // Index object to grid overlap zone
    if (!obj.id) throw new Error('CollisionGrid cannot index objects without an id', o);
    this.gridLoop(obj)((x, y) => {
      if (this.grid[y][x].indexOf(obj) < 0) {
        this.grid[y][x].push(obj);
      }
    });
  };
  this.collides = function (obj) {
    const TOL = 0.0001; // No collision if objects are perfectly aligned
    if (typeof obj.x !== 'number' || typeof obj.y !== 'number' || typeof obj.w !== 'number' || typeof obj.h !== 'number') throw new Error('Cannot check collision of object', obj);
    // Narrow search range to only grid overlap zone
    let res = [];
    this.gridLoop(obj)((x, y) => {
      this.grid[y][x].forEach((o) => {
        if ((between(obj.x + TOL, o.x, o.x + o.w) || between(obj.x + obj.w - TOL, o.x, o.x + o.w)) && (between(obj.y + TOL, o.y, o.y + o.h) || between(obj.y + obj.h - TOL, o.y, o.y + o.h)))
          if (obj !== o && res.indexOf(o) < 0) {
            res.push(o);
          }
      });
    });
    return res;
  };
  function between(a, b, c) {
    return a > b && a < c;
  }

  this.remove = function (obj) {
    this.gridLoop(obj)((x, y) => {
      removeFromArray(this.grid[y][x], obj);
    });
  };

  return this;
}

function removeFromArray(arr, o) {
  if (!o.id) throw new Error('CollisionGrid cannot remove objects without an id', o);
  const index = arr.findIndex((a) => a.id === o.id);
  if (index < 0) throw new Error('CollisionGrid cannot remove unknown object', o);
  arr.splice(index, 1);
}

export {Collider};
