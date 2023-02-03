function Entities({ onAdd, onRemove }) {
  const e = [];
  return {
    e,
    add: (o) => {
      if (typeof onAdd === "function") onAdd(o);
      return e.push(o);
    },
  };
}

export { Entities };
