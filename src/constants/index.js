const commands = require('./commands');
const entities = require('./entities');
const game = require('./game');
const items = require('./items');

module.exports = {
  ...commands,
  ...entities,
  ...game,
  ...items
};
