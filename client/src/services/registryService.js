const blockModules = import.meta.glob("../data/blocks/*.jsx", { eager: true });
const fieldModules = import.meta.glob("../data/fields/*.jsx", { eager: true });

// TODO: Export a readonly function. Instead of risking clients editing this
export const blockRegistry = {};
export const fieldRegistry = {};

for (const path in blockModules) {
  const module = blockModules[path];
  const meta = module.meta;

  if (!meta?.type)
    throw new Error(`Block module at ${path} does not export a 'type' meta property.`);

  blockRegistry[meta.type] = {
    Component: module.default,
    meta,
  };
}

for (const path in fieldModules) {
  const module = fieldModules[path];
  const meta = module.meta;

  if (!meta?.fieldType)
    throw new Error(`Field module at ${path} does not export a 'fieldType' meta property.`);

  fieldRegistry[meta.fieldType] = {
    Component: module.default,
    meta,
  };
}
