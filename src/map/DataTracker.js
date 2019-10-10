const Data = require('./Data');
const Helpers = require('./Helpers');

const { HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE } = Data.AMOUNTS;

class DataTracker {
  constructor() {
    this.add = this.add.bind(this);
    this.getTotals = this.getTotals.bind(this);
    this.reset = this.reset.bind(this);

    this.data = {};
    this.totals = new Data();
    this.reset();
  }

  add({ x, y, what, amount }) {
    const key = Helpers.convertCoordinatesToKey({ x, y });

    const value = Number.isInteger(this.data[what][key])
      ? this.data[what][key]
      : 0;

    this.data[what][key] = value + amount;
    this.totals.add({ x, y, what, amount });
  }

  getTotals() {
    return this.totals;
  }

  reset() {
    this.totals = new Data();
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
