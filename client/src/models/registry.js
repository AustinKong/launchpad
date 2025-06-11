const blockModules = import.meta.glob("../plugins/blocks/*/index.jsx", { eager: true });
const fieldModules = import.meta.glob("../plugins/fields/*/index.jsx", { eager: true });

const blockRegistry = {};
const fieldRegistry = {};

for (const path in blockModules) {
  const module = blockModules[path];
  const meta = module.meta;

  if (!meta?.blockType)
    throw new Error(`Block module at ${path} does not export a 'blockType' meta property.`);

  blockRegistry[meta.blockType] = {
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

const Registry = {
  blocks: () => blockRegistry,
  fields: () => fieldRegistry,
};

export default Registry;
