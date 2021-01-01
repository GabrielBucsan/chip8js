const createMemory = (sizeInBytes) => {
  const buffer = new ArrayBuffer(sizeInBytes);
  const dataView = new DataView(buffer);
  return dataView;
};

export default { createMemory };
