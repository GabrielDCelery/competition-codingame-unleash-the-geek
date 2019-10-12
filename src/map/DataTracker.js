const Data = require('./Data');
const DataMap = require('./DataMap');
const helpers = require('../helpers');

const { HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE } = Data.AMOUNTS;

class DataTracker {
  constructor({ width, height }) {
    this.getData = this.getData.bind(this);
    this.getDataMap = this.getDataMap.bind(this);
    this.getTotals = this.getTotals.bind(this);
    this.add = this.add.bind(this);
    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.reset = this.reset.bind(this);
    this.hasInRange = this.hasInRange.bind(this);
    this.howManyCellsOf = this.howManyCellsOf.bind(this);
    this.getListOfCoordinatesOf = this.getListOfCoordinatesOf.bind(this);

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

  hasInRange({ x, y, distance, what }) {
    const keys = Object.keys(this.data[what]);

    for (let i = 0, iMax = keys.length; i < iMax; i++) {
      const coordinate = helpers.destructureKeyToCoordinates(keys[i]);
      const amount = this.data[what][keys[i]];
      const diff = Math.abs(x - coordinate.x) + Math.abs(y - coordinate.y);

      if (0 < amount && diff <= distance) {
        return true;
      }
    }

    return false;
  }

  howManyCellsOf({ what }) {
    let numOfCellsOf = 0;
    const keys = Object.keys(this.data[what]);

    for (let i = 0, iMax = keys.length; i < iMax; i++) {
      const amount = this.data[what][keys[i]];

      if (0 < amount) {
        numOfCellsOf += 1;
      }
    }

    return numOfCellsOf;
  }

  getData({ what }) {
    return this.data[what];
  }

  getListOfCoordinatesOf({ what }) {
    const keys = Object.keys(this.data[what]);
    const coordinates = [];

    for (let i = 0, iMax = keys.length; i < iMax; i++) {
      const key = keys[i];
      const amount = this.data[what][key];

      if (0 < amount) {
        coordinates.push(helpers.destructureKeyToCoordinates(key));
      }
    }

    return coordinates;
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
