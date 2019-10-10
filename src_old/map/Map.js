const {
  ITEM_HOLE,
  ENTITY_ORE_UNKNOWN_AMOUNT,
  ENTITY_ALLIED_ROBOT,
  ENTITY_ENEMY_ROBOT,
  ENTITY_RADAR,
  ENTITY_MINE
} = require('../constants');

const Data = require('./Data');
const Cells = require('./Cells');
const Zones = require('./Zones');
const DataHeatMap = require('./DataHeatMap');
const EntityTracker = require('./EntityTracker');

class Map {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY, heatMapDropRate }) {
    this.getAmountKeys = this.getAmountKeys.bind(this);
    this.getCells = this.getCells.bind(this);
    this.getZones = this.getZones.bind(this);
    this.getDataHeatMap = this.getDataHeatMap.bind(this);
    this.processHoleInput = this.processHoleInput.bind(this);
    this.processOreInput = this.processOreInput.bind(this);
    this.processEntityInput = this.processEntityInput.bind(this);
    this.reset = this.reset.bind(this);

    this.totals = new Data();
    this.cells = new Cells({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.zones = new Zones({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.dataHeatMap = new DataHeatMap({
      totals: this.totals,
      zones: this.zones,
      heatMapDropRate
    });
    this.entityTracker = new EntityTracker();
  }

  getAmountKeys() {
    return { ...Data.AMOUNTS };
  }

  getCells() {
    return this.cells;
  }

  getZones() {
    return this.zones;
  }

  getDataHeatMap() {
    return this.dataHeatMap;
  }

  getTotals() {
    return this.totals;
  }

  processHoleInput({ x, y, hole }) {
    if (
      hole !== ITEM_HOLE ||
      this.cells.has({ x, y, what: Data.AMOUNTS.HOLE })
    ) {
      return this;
    }

    this.cells.set({ x, y, what: Data.AMOUNTS.HOLE, amount: 1 });
    this.zones.add({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.HOLE,
      amount: 1
    });
    this.totals.add({ what: Data.AMOUNTS.HOLE, amount: 1 });

    return this;
  }

  processOreInput({ x, y, amount }) {
    if (amount === ENTITY_ORE_UNKNOWN_AMOUNT) {
      return this;
    }

    const amountInt = parseInt(amount);

    const currentZoneAmount = this.zones.get({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.ORE
    });
    const currentCellAmount = this.cells.get({ x, y, what: Data.AMOUNTS.ORE });
    const currentTotalAmount = this.totals.get({ what: Data.AMOUNTS.ORE });

    this.zones.set({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.ORE,
      amount: currentZoneAmount - currentCellAmount + amountInt
    });
    this.totals.set({
      what: Data.AMOUNTS.ORE,
      amount: currentTotalAmount - currentCellAmount + amountInt
    });

    this.cells.set({ x, y, what: Data.AMOUNTS.ORE, amount: amountInt });

    return this;
  }

  processEntityInput({ x, y, type }) {
    switch (type) {
      case ENTITY_ALLIED_ROBOT: {
        this.cells.add({
          x,
          y,
          what: Data.AMOUNTS.ALLIED_ROBOT,
          amount: 1
        });
        this.zones.add({
          ...this.cells.getZoneCoordinates({ x, y }),
          what: Data.AMOUNTS.ALLIED_ROBOT,
          amount: 1
        });
        this.totals.add({
          what: Data.AMOUNTS.ALLIED_ROBOT,
          amount: 1
        });
        this.entityTracker.add({
          x,
          y,
          what: Data.AMOUNTS.ALLIED_ROBOT,
          amount: 1
        });
        return this;
      }
      case ENTITY_ENEMY_ROBOT: {
        this.cells.add({
          x,
          y,
          what: Data.AMOUNTS.ENEMY_ROBOT,
          amount: 1
        });
        this.zones.add({
          ...this.cells.getZoneCoordinates({ x, y }),
          what: Data.AMOUNTS.ENEMY_ROBOT,
          amount: 1
        });
        this.totals.add({
          what: Data.AMOUNTS.ENEMY_ROBOT,
          amount: 1
        });
        this.entityTracker.add({
          x,
          y,
          what: Data.AMOUNTS.ENEMY_ROBOT,
          amount: 1
        });
        return this;
      }
      case ENTITY_RADAR: {
        this.cells.set({
          x,
          y,
          what: Data.AMOUNTS.RADAR,
          amount: 1
        });
        this.zones.add({
          ...this.cells.getZoneCoordinates({ x, y }),
          what: Data.AMOUNTS.RADAR,
          amount: 1
        });
        this.totals.add({
          what: Data.AMOUNTS.RADAR,
          amount: 1
        });
        this.entityTracker.add({
          x,
          y,
          what: Data.AMOUNTS.RADAR,
          amount: 1
        });
        return this;
      }
      case ENTITY_MINE: {
        this.cells.set({
          x,
          y,
          what: Data.AMOUNTS.MINE,
          amount: 1
        });
        this.zones.add({
          ...this.cells.getZoneCoordinates({ x, y }),
          what: Data.AMOUNTS.MINE,
          amount: 1
        });
        this.totals.add({
          what: Data.AMOUNTS.MINE,
          amount: 1
        });
        this.entityTracker.add({
          x,
          y,
          what: Data.AMOUNTS.MINE,
          amount: 1
        });
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }

  reset() {
    this.totals.reset();
    this.cells.reset();
    this.zones.reset();
  }
}

module.exports = Map;
