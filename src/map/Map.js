const {
  READLINE_CELL_HAS_HOLE,
  READLINE_ORE_AMOUNT_UNKNOWN,
  READLINE_ENTITY_ALLIED_ROBOT,
  READLINE_ENTITY_ENEMY_ROBOT,
  READLINE_ENTITY_RADAR,
  READLINE_ENTITY_MINE
} = require('../constants')

const Data = require('./Data')
const Cells = require('./Cells');
const Zones = require('./Zones')

class Map {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.total = new Data();
    this.cells = new Cells({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.zones = new Zones({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
  }

  processHoleInput({ x, y, hole }) {
    if (
      hole !== READLINE_CELL_HAS_HOLE ||
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
    this.total.add({ what: Data.AMOUNTS.HOLE, amount: 1 })

    return this;
  }

  processOreInput({ x, y, amount }) {
    if (amount === READLINE_ORE_AMOUNT_UNKNOWN) {
      return this;
    }

    const currentZoneAmount = this.zones.get({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.ORE
    });
    const currentCellAmount = this.cells.get({ x, y, what: Data.AMOUNTS.ORE });
    const currentTotalAmount = this.total.get({ what: Data.AMOUNTS.ORE })

    this.zones.set({
      ...this.cells.getZoneCoordinates({ x, y }),
      what: Data.AMOUNTS.ORE,
      amount: currentZoneAmount - currentCellAmount + amount
    })
    this.total.set({
      what: Data.AMOUNTS.ORE,
      amount: currentTotalAmount - currentCellAmount + amount
    })

    this.cells.set({ x, y, what: Data.AMOUNTS.ORE, amount })

    return this;
  }

  processEntityInput({ x, y, type }) {
    switch (type) {
      case READLINE_ENTITY_ALLIED_ROBOT: {
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
        this.total.add({
          what: Data.AMOUNTS.ALLIED_ROBOT,
          amount: 1
        })
        return this;
      }
      case READLINE_ENTITY_ENEMY_ROBOT: {
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
        this.total.add({
          what: Data.AMOUNTS.ENEMY_ROBOT,
          amount: 1
        })
        return this;
      }
      case READLINE_ENTITY_RADAR: {
        this.cells.set({
          x,
          y,
          what: Data.AMOUNTS.RADAR,
          amount: 1
        })
        this.zones.add({
          ...this.cells.getZoneCoordinates({ x, y }),
          what: Data.AMOUNTS.RADAR,
          amount: 1
        });
        this.total.add({
          what: Data.AMOUNTS.RADAR,
          amount: 1
        })
        return this;
      }
      case READLINE_ENTITY_MINE: {
        this.cells.set({
          x,
          y,
          what: Data.AMOUNTS.MINE,
          amount: 1
        })
        this.zones.add({
          ...this.cells.getZoneCoordinates({ x, y }),
          what: Data.AMOUNTS.MINE,
          amount: 1
        });
        this.total.add({
          what: Data.AMOUNTS.MINE,
          amount: 1
        })
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }

  resetEntities() {
    this.total.resetEntities();
    this.cells.resetEntities();
    this.zones.resetEntities();
  }
}

module.exports = Map;