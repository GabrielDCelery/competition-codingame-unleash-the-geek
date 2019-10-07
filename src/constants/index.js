const commands = require('./commands');
const readlines = require('./readlines');

module.exports = {
  ...commands,
  ...readlines
};
