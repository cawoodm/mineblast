function Grid(config) {
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
    // dp({ X1, X2, Y1, Y2 });
    for (let y = Y1; y < Y2 && y < this.grid.length; y++)
      for (let x = X1; x < X2 && x < this.grid[0].length; x++) {
        // console.log({ y, x }); //this.grid[y][x]);
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
    // dp({ X1, X2, Y1, Y2 });
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
const dp = console.log.bind(console);
const show = () => g.grid.forEach((y) => console.log(y));

let g = new Grid({ blockWidth: 10, blockHeight: 10, XW: 50, YH: 50 });
//console.log(g.grid);
g.add({ position: { x: 22, y: 44 } });
show();
dp(g.collides({ position: { x: 23, y: 44 } }));
//show();
