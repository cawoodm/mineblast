export function rnda(arr) {
  return arr[rndi(0, arr.length - 1)];
}
export function rndi(min, max) {
  return Math.round(min + Math.random() * (max - min));
}
