const {
  READLINE_CELL_HAS_HOLE,
  READLINE_ORE_AMOUNT_UNKNOWN,
  READLINE_ENTITY_ALLIED_ROBOT,
  READLINE_ENTITY_ENEMY_ROBOT,
  READLINE_ENTITY_RADAR,
  READLINE_ENTITY_TRAP
} = require('../constants')

const Cells = require('./Cells');
const Zones = require('./Zones')

class Map {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.setCellHasHole = this.setCellHasHole.bind(this);
    this.setCellOreAmount = this.setCellOreAmount.bind(this)
    this.addEntity = this.addEntity.bind(this)
    this.resetEntities = this.resetEntities.bind(this)
    this._init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY })
  }

  _init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.cells = new Cells({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
    this.zones = new Zones({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
  }

  resetEntities() {
    this.cells.resetEntities();
    this.zones.resetEntities();
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

  addEntity({ x, y, type }) {
    switch (type) {
      case READLINE_ENTITY_ALLIED_ROBOT: {
        this.cells.addAlliedRobot({ x, y });
        this.zones.addAlliedRobot(this.cells.getZoneCoordinates({ x, y }));
        return this;
      }
      case READLINE_ENTITY_ENEMY_ROBOT: {
        this.cells.addEnemyRobot({ x, y });
        this.zones.addEnemyRobot(this.cells.getZoneCoordinates({ x, y }));
        return this;
      }
      case READLINE_ENTITY_RADAR: {
        this.cells.setHasRadar({ x, y })
        this.zones.addRadar(this.cells.getZoneCoordinates({ x, y }));
        return this;
      }
      case READLINE_ENTITY_TRAP: {
        this.cells.setHasMine({ x, y })
        this.zones.addMine(this.cells.getZoneCoordinates({ x, y }));
        return this;
      }
      default:
        console.error(`Missing entity type! -> ${type}`);
    }
  }
}

module.exports = Map;