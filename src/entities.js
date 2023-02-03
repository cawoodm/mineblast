function Entities({ scene, onAdd, onRemove }) {
  const e = [];
  const indexById = {};
  return {
    e,
    add: (o) => {
      // o.tag === "bullet" && console.log("EntityAdd", o.tag, o);
      if (!Array.isArray(o.tags) && o.tag) {
        o.tags = [o.tag];
        delete o.tag;
      }
      if (o.id) indexById[o.id] = o;
      e.push(o);
      if (o.mesh) scene.add(o.mesh);
      if (typeof onAdd === "function") onAdd(o);
    },
    remove: (o) => {
      if (o.id) delete indexById[o.id];
      const index = e.indexOf(o);
      if (index) e.splice(index, 1);
      if (typeof onRemove === "function") onRemove(o);
    },
    getById: (id) => {
      return indexById[id];
    },
    getByTag: (tag) => {
      return e.filter((e) => e.tags?.includes(tag));
    },
  };
}

export { Entities };
