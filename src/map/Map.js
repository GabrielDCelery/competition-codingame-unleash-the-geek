const {
  READLINE_CELL_HAS_HOLE,
  READLINE_UNKNOWN_ORE_AMOUNT,
  READLINE_ENTITY_ALLIED_ROBOT,
  READLINE_ENTITY_ENEMY_ROBOT,
  READLINE_ENTITY_RADAR,
  READLINE_ENTITY_MINE
} = require('../constants');

const Data = require('./Data');
const DistanceMapper = require('./DistanceMapper');

const DataTracker = require('./DataTracker');
const DataMap = require('./DataMap');
const DataHeatMap = require('./DataHeatMap');
const { HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE } = Data.AMOUNTS;

class Map {
  constructor({ mapWidth, mapHeight, heatMapDropRate }) {
    this.getDistance = this.getDistance.bind(this);
    this.getMaxDistance = this.getMaxDistance.bind(this);
    this.getDistanceMapper = this.getDistanceMapper.bind(this);
    this.getHeatMap = this.getHeatMap.bind(this);
    this.processHoleInput = this.processHoleInput.bind(this);
    this.processOreInput = this.processOreInput.bind(this);
    this.processEntityInput = this.processEntityInput.bind(this);
    this.reset = this.reset.bind(this);

    this.width = mapWidth;
    this.height = mapHeight;

    this.dataMap = new DataMap({
      width: this.width,
      height: this.height
    });

    this.dataTracker = new DataTracker();
    this.distanceMapper = new DistanceMapper({
      width: this.width,
      height: this.height
    }).mapDistances();
    this.dataHeatMap = new DataHeatMap({
      width: this.width,
      height: this.height,
      dataMap: this.dataMap,
      dataTracker: this.dataTracker,
      distanceMapper: this.distanceMapper,
      heatMapDropRate
    });
  }

  getDistance({ x, y, endX, endY }) {
    return Math.abs(x - endX) + Math.abs(y - endY);
  }

  getMaxDistance() {
    return this.width + this.height - 2;
  }

  getDistanceMapper() {
    return this.distanceMapper;
  }

  getHeatMap() {
    return this.dataHeatMap;
  }

  processHoleInput({ x, y, hole }) {
    if (hole !== READLINE_CELL_HAS_HOLE) {
      return this;
    }

    this.dataTracker.add({ x, y, what: HOLE, amount: 1 });
    this.dataMap.add({ x, y, what: HOLE, amount: 1 });

    return this;
  }

  processOreInput({ x, y, amount }) {
    if (amount === READLINE_UNKNOWN_ORE_AMOUNT) {
      return this;
    }

    const amountInt = parseInt(amount);

    this.dataTracker.add({ x, y, what: ORE, amount: amountInt });
    this.dataMap.add({ x, y, what: ORE, amount: amountInt });

    return this;
  }

  processEntityInput({ x, y, type }) {
    switch (type) {
      case READLINE_ENTITY_ALLIED_ROBOT: {
        this.dataTracker.add({ x, y, what: ALLIED_ROBOT, amount: 1 });
        this.dataMap.add({ x, y, what: ALLIED_ROBOT, amount: 1 });
        return this;
      }
      case READLINE_ENTITY_ENEMY_ROBOT: {
        this.dataTracker.add({ x, y, what: ENEMY_ROBOT, amount: 1 });
        this.dataMap.add({ x, y, what: ENEMY_ROBOT, amount: 1 });
        return this;
      }
      case READLINE_ENTITY_RADAR: {
        this.dataTracker.add({ x, y, what: RADAR, amount: 1 });
        this.dataMap.set({ x, y, what: RADAR, amount: 1 });
        return this;
      }
      case READLINE_ENTITY_MINE: {
        this.dataTracker.add({ x, y, what: MINE, amount: 1 });
        this.dataMap.set({ x, y, what: MINE, amount: 1 });
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }

  reset() {
    this.dataTracker.reset();
    this.dataMap.reset();
  }
}

module.exports = Map;
