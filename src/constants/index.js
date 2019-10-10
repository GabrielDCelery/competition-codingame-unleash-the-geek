const commands = require('./commands');
const game = require('./game');
const items = require('./items');
const names = require('./names');
const readlines = require('./readlines');

module.exports = {
  ...commands,
  ...game,
  ...items,
  ...names,
  ...readlines
};
