class Cells {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.coordinates = null;
    this.getZoneCoordinates = this.getZoneCoordinates.bind(this)
    this.hasHole = this.hasHole.bind(this)
    this.setHasHole = this.setHasHole.bind(this)
    this.getOreAmount = this.getOreAmount.bind(this)
    this.setOreAmount = this.setOreAmount.bind(this)
    this._init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY });
  }

  static get DATA() {
    return {
      HAS_HOLE: 0,
      ORE_AMOUNT: 1,
      ALLIED_ROBOT_AMOUNT: 2,
      ENEMY_ROBOT_AMOUNT: 3,
      HAS_RADAR: 4,
      HAS_MINE: 5,
      ZONE_COORDINATES: 6
    }
  }

  _initCell({ x, y, zoneSizeX, zoneSizeY }) {
    const cell = new Array([
      Cells.DATA.HAS_HOLE,
      Cells.DATA.ORE_AMOUNT,
      Cells.DATA.ALLIED_ROBOT_AMOUNT,
      Cells.DATA.ENEMY_ROBOT_AMOUNT,
      Cells.DATA.HAS_RADAR,
      Cells.DATA.HAS_MINE,
      Cells.DATA.ZONE_COORDINATES
    ].length).fill(null);
    cell[Cells.DATA.HAS_HOLE] = false;
    cell[Cells.DATA.ORE_AMOUNT] = 0;
    cell[Cells.DATA.ALLIED_ROBOT_AMOUNT] = 0;
    cell[Cells.DATA.ENEMY_ROBOT_AMOUNT] = 0;
    cell[Cells.DATA.HAS_RADAR] = false;
    cell[Cells.DATA.HAS_MINE] = false;
    cell[Cells.DATA.ZONE_COORDINATES] = [Math.floor(x / zoneSizeX), Math.floor(y / zoneSizeY)];

    this.coordinates[x][y] = cell;
  }

  _init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.coordinates = new Array(mapWidth)
      .fill(null)
      .map(() => new Array(mapHeight).fill(null))

    for (let x = 0, xMax = mapWidth; x < xMax; x++) {
      for (let y = 0, yMax = mapHeight; y < yMax; y++) {
        this._initCell({ x, y, zoneSizeX, zoneSizeY })
      }
    }
  }

  getZoneCoordinates({ x, y }) {
    const [zoneX, zoneY] = this.coordinates[x][y][Cells.DATA.ZONE_COORDINATES];

    return {
      x: zoneX,
      y: zoneY
    }
  }

  hasHole({ x, y }) {
    return this.coordinates[x][y][Cells.DATA.HAS_HOLE];
  }

  setHasHole({ x, y }) {
    return this.coordinates[x][y][Cells.DATA.HAS_HOLE] = true;
  }

  getOreAmount({ x, y }) {
    return this.coordinates[x][y][Cells.DATA.ORE_AMOUNT];
  }

  setOreAmount({ x, y, amount }) {
    return this.coordinates[x][y][Cells.DATA.ORE_AMOUNT] = amount;
  }
}

module.exports = Cells;