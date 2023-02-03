/**
 * Very Simple Axis-aligned bounding boxes (VS-AABB)
 * Assume every entity is a block
 */
function Collider(config) {
  let W = config.blockWidth;
  let H = config.blockHeight;
  let X = config.XW / W; // 320/5=64
  let Y = config.YH / H;
  console.log({ X, Y });
  this.grid = [];
  for (let y = 0; y < Y; y++) this.grid.push(Array.from({ length: X }, () => []));
  this.add = function (obj) {
    objWidth = 1; // Assume object is a block
    objHeight = 1; // Assume object is a block
    let X1 = Math.floor(obj.position.x / W);
    let X2 = Math.ceil(1 + obj.position.x / W);
    let Y1 = Math.floor(obj.position.y / H);
    let Y2 = Math.ceil(1 + obj.position.y / H);
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++) {
        if (this.grid[y][x].indexOf(obj) < 0) this.grid[y][x].push(obj);
      }
  };
  this.collides = function (obj) {
    objWidth = 1; // Assume object is a block
    objHeight = 1; // Assume object is a block
    let X1 = Math.floor(obj.position.x / W);
    let X2 = Math.ceil(1 + obj.position.x / W);
    let Y1 = Math.floor(obj.position.y / H);
    let Y2 = Math.ceil(1 + obj.position.y / H);
    let res = [];
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++)
        this.grid[y][x].forEach((o, i) => {
          if (obj !== o && res.indexOf(o) < 0) res.push(o);
        });
    return res;
  };

  return this;
}

export { Collider };
