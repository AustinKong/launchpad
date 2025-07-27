const blockModules = import.meta.glob("../data/blocks/*.jsx", { eager: true });
const fieldModules = import.meta.glob("../data/fields/*.jsx", { eager: true });

const _blockRegistry = {};
const _fieldRegistry = {};

for (const path in blockModules) {
  const module = blockModules[path];
  const meta = module.meta;

  if (!meta?.type)
    throw new Error(`Block module at ${path} does not export a 'type' meta property.`);

  _blockRegistry[meta.type] = {
    Component: module.default,
    meta,
  };
}

for (const path in fieldModules) {
  const module = fieldModules[path];
  const meta = module.meta;

  if (!meta?.fieldType)
    throw new Error(`Field module at ${path} does not export a 'fieldType' meta property.`);

  _fieldRegistry[meta.fieldType] = {
    Component: module.default,
    meta,
  };
}

export const blockRegistry = {
  get(type) {
    if (!_blockRegistry[type]) {
      throw new Error(`Block type "${type}" is not registered.`);
    }
    return _blockRegistry[type];
  },
  list() {
    return Object.keys(_blockRegistry).map((type) => ({
      type,
      ..._blockRegistry[type],
    }));
  },
  grouped() {
    return Object.entries(_blockRegistry).reduce((acc, [type, { meta }]) => {
      if (!acc[meta.group]) acc[meta.group] = [];
      acc[meta.group].push({ type, ..._blockRegistry[type] });
      return acc;
    }, {});
  },
};

export const fieldRegistry = {
  get(fieldType) {
    if (!_fieldRegistry[fieldType]) {
      throw new Error(`Field type "${fieldType}" is not registered.`);
    }
    return _fieldRegistry[fieldType];
  },
  list() {
    return Object.keys(_fieldRegistry).map((fieldType) => ({
      fieldType,
      ..._fieldRegistry[fieldType],
    }));
  },
  grouped() {
    return Object.entries(_fieldRegistry).reduce((acc, [fieldType, { meta }]) => {
      if (!acc[meta.group]) acc[meta.group] = [];
      acc[meta.group].push({ fieldType, ..._fieldRegistry[fieldType] });
      return acc;
    }, {});
  },
};
