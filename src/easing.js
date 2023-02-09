function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}
function easeInOutQuart(t, b, c, d) {
  let x = t / d;
  let calc = x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  return lerp(b, c, calc);
}
function recoil(t, b, c, d) {
  /*   /\
   *  /  \
   * /    \
   *t=0   t=d
   */
  let x = t / d;
  let calc = x < 0.5 ? 2 * x : -2 * x + 2;
  let res = lerp(b, c, calc);
  console.log('recoil: t=', t, 'b=', b, 'c=', c, 'd=', d, ' ==>', res);
  return res;
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export {lerp, recoil, easeInOutQuad, easeInOutQuart};
