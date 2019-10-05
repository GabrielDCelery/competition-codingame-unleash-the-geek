const MAP_WIDTH = 30;
const MAP_HEIGHT = 15;
const ZONE_SIZE = 5;

const CELL_DATA_HAS_HOLE = 0;
const CELL_DATA_ORE_AMOUNT = 1;
const CELL_DATA_ZONE_COORDINATES = 2;

const ZONE_DATA_HOLE_AMOUNT = 0
const ZONE_DATA_ORE_AMOUNT = 1;
const ZONE_DATA_NUM_OF_ENEMY_ROBOTS = 2;

const {
  READLINE_CELL_HAS_HOLE,
  READLINE_ORE_AMOUNT_UNKNOWN,
  READLINE_ENTITY_ALLIED_ROBOT,
  READLINE_ENTITY_ENEMY_ROBOT,
  READLINE_ENTITY_RADAR,
  READLINE_ENTITY_TRAP
} = require('../constants')

class Map {
  constructor() {
    this._initCell = this._initCell.bind(this);
    this._initZone = this._initZone.bind(this)
    this._initMap = this._initMap.bind(this)
    this.setCellHasHole = this.setCellHasHole.bind(this)
    this.setCellOreAmount = this.setCellOreAmount.bind(this)
    this.setEntity = this.setEntity.bind(this)
    this.resetRobotPositions = this.resetRobotPositions.bind(this)
    this._initMap()
  }

  _initCell(x, y) {
    const cell = new Array([
      CELL_DATA_HAS_HOLE,
      CELL_DATA_ORE_AMOUNT,
      CELL_DATA_ZONE_COORDINATES
    ].length).fill(null);
    cell[CELL_DATA_HAS_HOLE] = false;
    cell[CELL_DATA_ORE_AMOUNT] = 0;
    cell[CELL_DATA_ZONE_COORDINATES] =
      [Math.floor(x / ZONE_SIZE), Math.floor(y / ZONE_SIZE)];

    this.cells[x][y] = cell;

    return cell;
  }

  _initZone(zoneX, zoneY) {
    const zone = new Array([
      ZONE_DATA_HOLE_AMOUNT,
      ZONE_DATA_ORE_AMOUNT,
      ZONE_DATA_NUM_OF_ENEMY_ROBOTS
    ].length).fill(null);
    zone[ZONE_DATA_HOLE_AMOUNT] = 0
    zone[ZONE_DATA_ORE_AMOUNT] = 0
    zone[ZONE_DATA_NUM_OF_ENEMY_ROBOTS] = 0

    this.zones[zoneX][zoneY] = zone;

    return zone;
  }

  _initMap() {
    this.zones = new Array(MAP_WIDTH / ZONE_SIZE)
      .fill(null)
      .map(() => new Array(MAP_HEIGHT / ZONE_SIZE).fill(null));
    this.cells = new Array(MAP_WIDTH)
      .fill(null)
      .map(() => new Array(MAP_HEIGHT).fill(null))

    for (let x = 0, xMax = MAP_WIDTH; x < xMax; x++) {
      for (let y = 0, yMax = MAP_HEIGHT; y < yMax; y++) {
        const cell = this._initCell(x, y)
        const [zoneX, zoneY] = cell[CELL_DATA_ZONE_COORDINATES]
        this._initZone(zoneX, zoneY)
      }
    }

    return this;
  }

  resetRobotPositions() {
    for (let x = 0, xMax = (MAP_WIDTH / ZONE_SIZE); x < xMax; x++) {
      for (let y = 0, yMax = (MAP_HEIGHT / ZONE_SIZE); y < yMax; y++) {
        const zone = this.zones[x][y];
        zone[ZONE_DATA_NUM_OF_ENEMY_ROBOTS] = 0;
      }
    }

    return this;
  }

  setCellHasHole(x, y, hole) {
    if (hole !== READLINE_CELL_HAS_HOLE) {
      return this;
    }

    const cell = this.cells[x][y];

    if (cell[CELL_DATA_HAS_HOLE] === true) {
      return this;
    }

    const [zoneX, zoneY] = cell[CELL_DATA_ZONE_COORDINATES];
    const zone = this.zones[zoneX][zoneY]

    cell[CELL_DATA_HAS_HOLE] = true;
    zone[ZONE_DATA_HOLE_AMOUNT]++;

    return this;
  }

  setCellOreAmount(x, y, amount) {
    if (amount === READLINE_ORE_AMOUNT_UNKNOWN) {
      return this;
    }

    const cell = this.cells[x][y];
    const [zoneX, zoneY] = cell[CELL_DATA_ZONE_COORDINATES];
    const zone = this.zones[zoneX][zoneY]

    zone[ZONE_DATA_ORE_AMOUNT] = zone[ZONE_DATA_ORE_AMOUNT] - cell[CELL_DATA_ORE_AMOUNT] + amount;
    cell[CELL_DATA_ORE_AMOUNT] = amount;

    return this;
  }

  setEntity(x, y, type) {
    switch (type) {
      case READLINE_ENTITY_ALLIED_ROBOT: {
        return this;
      }
      case READLINE_ENTITY_ENEMY_ROBOT: {
        const [zoneX, zoneY] = this.cells[x][y][CELL_DATA_ZONE_COORDINATES];
        this.zones[zoneX][zoneY][ZONE_DATA_NUM_OF_ENEMY_ROBOTS];
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