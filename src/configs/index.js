const heatMap = require('./heatMap');
const map = require('./map');
const robots = require('./robots');

module.exports = {
  ...heatMap,
  ...map,
  ...robots
};
