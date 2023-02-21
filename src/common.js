export function rnda(arr) {
  return arr[rndi(0, arr.length - 1)];
}
export function rndi(min, max) {
  return Math.round(min + Math.random() * (max - min));
}
export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}
export function invlerp(start, end, amt) {
  return (amt - start) / (end - start);
}
