const Data = require('./Data');
const DataMap = require('./DataMap');
const helpers = require('../helpers');

const { HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE } = Data.AMOUNTS;

class DataTracker {
  constructor({ width, height }) {
    this.getDataMap = this.getDataMap.bind(this);
    this.getTotals = this.getTotals.bind(this);
    this.add = this.add.bind(this);
    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.reset = this.reset.bind(this);

    this.data = {};
    this.totals = new Data();
    this.dataMap = new DataMap({ width, height });
    this.reset();
  }

  getAmounts() {
    return Data.AMOUNTS;
  }

  getDataMap() {
    return this.dataMap;
  }

  getTotals() {
    return this.totals;
  }

  add({ x, y, what, amount }) {
    const key = helpers.convertCoordinatesToKey({ x, y });
    const value = this.data[what][key];

    this.data[what][key] = (Number.isInteger(value) ? value : 0) + amount;
    this.totals.add({ x, y, what, amount });
    this.dataMap.add({ x, y, what, amount });
  }

  has({ x, y, what }) {
    return this.dataMap.has({ x, y, what });
  }

  get({ x, y, what }) {
    return this.dataMap.get({ x, y, what });
  }

  reset() {
    this.totals = new Data();
    this.dataMap.reset();
    this.data = {
      [HOLE]: {},
      [ORE]: {},
      [ALLIED_ROBOT]: {},
      [ENEMY_ROBOT]: {},
      [RADAR]: {},
      [MINE]: {}
    };
  }
}

module.exports = DataTracker;
