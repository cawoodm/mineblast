function Entities({scene, onAdd, onRemove}) {
  const e = [];
  const indexById = {};
  return {
    e,
    add: (o) => {
      if (!Array.isArray(o.tags) && o.tag) {
        o.tags = [o.tag];
        delete o.tag;
      }
      if (!o.id) o.id = o.mesh?.uuid || 0;
      if (o.id) indexById[o.id] = o;
      e.push(o);
      if (o.mesh) scene.add(o.mesh);
      if (typeof onAdd === 'function') onAdd(o);
    },
    removeById: (id) => {
      let o = indexById[id];
      console.log('removeById', id, o);
      const index = e.indexOf(o);
      if (!index) throw new Error('Entities cannot remove unknown object', o);
      if (index) e.splice(index, 1);
      if (typeof onRemove === 'function') onRemove(o);
      if (o.mesh) scene.remove(o.mesh);
    },
    remove: (o) => {
      console.log('remove', o.tags, o);
      delete indexById[o.id];
      const index = e.indexOf(o);
      if (!index) throw new Error('Entities cannot remove unknown object', o);
      if (index) e.splice(index, 1);
      //if (typeof onRemove === 'function') onRemove(o);
      //if (o.mesh) scene.remove(o.mesh);
    },
    getById: (id) => {
      return indexById[id];
    },
    getByTag: (tag) => {
      return e.filter((e) => e.tags?.includes(tag));
    },
  };
}

export {Entities};
