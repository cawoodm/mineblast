/**
 * A lifetime manager for entities
 *  - Keep an obhect alive for xs
 *  - Remove when it dies
 */
function Lifetime() {
  const objects = {};
  this.id = 'lifetimeManager';
  this.add = function (obj, lifetime) {
    // Index object to grid overlap zone
    if (!obj.id) throw new Error('Lifetime cannot index objects without an id', obj);
    objects[obj.id] = {lifetime};
  };
  this.tick = function (delta) {
    // Age objects and return list of the deceased
    let res = [];
    Object.keys(objects).forEach((id) => {
      objects[id].lifetime -= delta;
      if (objects[id].lifetime <= 0) {
        res.push(id);
        delete objects[id];
      }
    });
    return res;
  };
  this.alive = function (obj) {
    return objects[obj.id]?.lifetime > 0;
  };
  this.remove = function (obj) {
    delete objects[obj.id];
  };

  return this;
}

export {Lifetime};
