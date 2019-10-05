const {
  READLINE_CELL_HAS_HOLE,
  READLINE_ORE_AMOUNT_UNKNOWN,
  READLINE_ENTITY_ALLIED_ROBOT,
  READLINE_ENTITY_ENEMY_ROBOT,
  READLINE_ENTITY_RADAR,
  READLINE_ENTITY_TRAP
} = require('../constants')

/*
const MAP_WIDTH = 30;
const MAP_HEIGHT = 15;
const ZONE_SIZE = 5;
*/
const Cells = require('./Cells');
const Zones = require('./Zones')

class Map {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.cells = new Cells({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.zones = new Zones({ mapWidth, mapHeight, zoneSizeX, zoneSizeY })
    this.setCellHasHole = this.setCellHasHole.bind(this);
    this.setCellOreAmount = this.setCellOreAmount.bind(this)
    this.setEntity = this.setEntity.bind(this)
  }

  setCellHasHole({ x, y, hole }) {
    if (hole !== READLINE_CELL_HAS_HOLE || this.cells.hasHole({ x, y })) {
      return this;
    }

    this.cells.setHasHole({ x, y });
    this.zones.addHole(this.cells.getZoneCoordinates({ x, y }));

    return this;
  }

  setCellOreAmount({ x, y, amount }) {
    if (amount === READLINE_ORE_AMOUNT_UNKNOWN) {
      return this;
    }

    this.zones.setOreAmount({
      ...this.cells.getZoneCoordinates({ x, y }),
      amount: this.zones.getOreAmount(this.cells.getZoneCoordinates({ x, y })) -
        this.cells.getOreAmount({ x, y }) + amount
    })

    this.cells.setOreAmount({ x, y, amount })

    return this;
  }


  setEntity({ x, y, type }) {
    switch (type) {
      case READLINE_ENTITY_ALLIED_ROBOT: {
        return this;
      }
      case READLINE_ENTITY_ENEMY_ROBOT: {
        return this;
      }
      case READLINE_ENTITY_RADAR: {
        return this;
      }
      case READLINE_ENTITY_TRAP: {
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }
}

module.exports = Map;