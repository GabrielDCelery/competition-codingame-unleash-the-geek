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
const DataHeatMap = require('./DataHeatMap');
const { HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE } = Data.AMOUNTS;

class Map {
  constructor({ mapWidth, mapHeight, heatMapDropRate, robotScanRange }) {
    this.getDataClass = this.getDataClass.bind(this);
    this.getDataTracker = this.getDataTracker.bind(this);
    this.getDistance = this.getDistance.bind(this);
    this.getNormalizedDistance = this.getNormalizedDistance.bind(this);
    this.getMaxDistance = this.getMaxDistance.bind(this);
    this.getDistanceMapper = this.getDistanceMapper.bind(this);
    this.getHeatMap = this.getHeatMap.bind(this);
    this.processHoleInput = this.processHoleInput.bind(this);
    this.processOreInput = this.processOreInput.bind(this);
    this.processEntityInput = this.processEntityInput.bind(this);
    this.reset = this.reset.bind(this);

    this.width = mapWidth;
    this.height = mapHeight;

    this.dataTracker = new DataTracker({
      width: this.width,
      height: this.height
    });
    this.distanceMapper = new DistanceMapper({
      width: this.width,
      height: this.height
    }).mapDistances({ maxDistance: robotScanRange });
    this.dataHeatMap = new DataHeatMap({
      width: this.width,
      height: this.height,
      dataTracker: this.dataTracker,
      distanceMapper: this.distanceMapper,
      heatMapDropRate
    });
  }

  getDataClass() {
    return Data;
  }

  getDistance({ startX, startY, endX, endY }) {
    return Math.abs(startX - endX) + Math.abs(startY - endY);
  }

  getNormalizedDistance({ startX, startY, endX, endY }) {
    const diff = Math.abs(startX - endX) + Math.abs(startY - endY);

    if (diff === 0) {
      return 0;
    }

    return diff / Math.round((this.width + this.height - 2) / 4);
  }

  getMaxDistance() {
    return this.width + this.height - 2;
  }

  getDataTracker() {
    return this.dataTracker;
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

    return this;
  }

  processOreInput({ x, y, amount }) {
    if (amount === READLINE_UNKNOWN_ORE_AMOUNT) {
      return this;
    }

    this.dataTracker.add({ x, y, what: ORE, amount: parseInt(amount) });

    return this;
  }

  processEntityInput({ x, y, type }) {
    if (x < 0 || y < 0 || this.width - 1 < x || this.height - 1 < y) {
      return;
    }
    switch (type) {
      case READLINE_ENTITY_ALLIED_ROBOT: {
        this.dataTracker.add({ x, y, what: ALLIED_ROBOT, amount: 1 });
        return this;
      }
      case READLINE_ENTITY_ENEMY_ROBOT: {
        this.dataTracker.add({ x, y, what: ENEMY_ROBOT, amount: 1 });
        return this;
      }
      case READLINE_ENTITY_RADAR: {
        this.dataTracker.add({ x, y, what: RADAR, amount: 1 });
        return this;
      }
      case READLINE_ENTITY_MINE: {
        this.dataTracker.add({ x, y, what: MINE, amount: 1 });
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }

  reset() {
    this.dataTracker.reset();
  }
}

module.exports = Map;
