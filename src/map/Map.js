const {
  ITEM_HOLE,
  ITEM_ORE_UNKNOWN_AMOUNT,
  ENTITY_ALLIED_ROBOT,
  ENTITY_ENEMY_ROBOT,
  ENTITY_RADAR,
  ENTITY_MINE
} = require('../constants');

const Data = require('./Data');
const Cells = require('./Cells');
const Zones = require('./Zones');
const DataHeatMap = require('./DataHeatMap');

class Map {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY, heatMapDropRate }) {
    this.totals = new Data();
    this.cells = new Cells({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.zones = new Zones({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.dataHeatMap = new DataHeatMap({
      totals: this.totals,
      zones: this.zones,
      heatMapDropRate
    });
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
    if (amount === ITEM_ORE_UNKNOWN_AMOUNT) {
      return this;
    }

    const currentZoneAmount = this.zones.get({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.ORE
    });
    const currentCellAmount = this.cells.get({ x, y, what: Data.AMOUNTS.ORE });
    const currentTotalAmount = this.totals.get({ what: Data.AMOUNTS.ORE });

    this.zones.set({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.ORE,
      amount: currentZoneAmount - currentCellAmount + amount
    });
    this.totals.set({
      what: Data.AMOUNTS.ORE,
      amount: currentTotalAmount - currentCellAmount + amount
    });

    this.cells.set({ x, y, what: Data.AMOUNTS.ORE, amount });

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
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }

  resetEntities() {
    this.totals.resetEntities();
    this.cells.resetEntities();
    this.zones.resetEntities();
  }
}

module.exports = Map;
