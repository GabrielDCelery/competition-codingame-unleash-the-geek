module.exports = key => {
  const [x, y] = key.split('_');
  return { x, y };
};
