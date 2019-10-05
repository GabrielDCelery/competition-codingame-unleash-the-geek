class Cells {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.getZoneCoordinates = this.getZoneCoordinates.bind(this)
    this.hasHole = this.hasHole.bind(this)
    this.setHasHole = this.setHasHole.bind(this)
    this.getOreAmount = this.getOreAmount.bind(this)
    this.setOreAmount = this.setOreAmount.bind(this)
    this.resetEntities = this.resetEntities.bind(this)
    this.addAlliedRobot = this.addAlliedRobot.bind(this)
    this.addEnemyRobot = this.addEnemyRobot.bind(this)
    this.setHasRadar = this.setHasRadar.bind(this)
    this.setHasMine = this.setHasMine.bind(this)
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

  _resetEntitiesOnCell({ x, y }) {
    const cell = this.data[x][y];
    cell[Cells.DATA.ALLIED_ROBOT_AMOUNT] = 0;
    cell[Cells.DATA.ENEMY_ROBOT_AMOUNT] = 0;
    cell[Cells.DATA.HAS_RADAR] = false;
    cell[Cells.DATA.HAS_MINE] = false;
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

    this.data[x][y] = cell;
  }

  _init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.width = mapWidth;
    this.height = mapHeight;
    this.data = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null))

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this._initCell({ x, y, zoneSizeX, zoneSizeY })
      }
    }
  }

  resetEntities() {
    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this._resetEntitiesOnCell({ x, y });
      }
    }
  }

  getZoneCoordinates({ x, y }) {
    const [zoneX, zoneY] = this.data[x][y][Cells.DATA.ZONE_COORDINATES];

    return {
      x: zoneX,
      y: zoneY
    }
  }

  hasHole({ x, y }) {
    return this.data[x][y][Cells.DATA.HAS_HOLE];
  }

  setHasHole({ x, y }) {
    return this.data[x][y][Cells.DATA.HAS_HOLE] = true;
  }

  getOreAmount({ x, y }) {
    return this.data[x][y][Cells.DATA.ORE_AMOUNT];
  }

  setOreAmount({ x, y, amount }) {
    return this.data[x][y][Cells.DATA.ORE_AMOUNT] = amount;
  }

  addAlliedRobot({ x, y }) {
    return this.data[x][y][Cells.DATA.ALLIED_ROBOT_AMOUNT]++;
  }

  addEnemyRobot({ x, y }) {
    return this.data[x][y][Cells.DATA.ENEMY_ROBOT_AMOUNT]++;
  }

  setHasRadar({ x, y }) {
    return this.data[x][y][Cells.DATA.HAS_RADAR] = true;
  }

  setHasMine({ x, y }) {
    return this.data[x][y][Cells.DATA.HAS_MINE] = true;
  }
}

module.exports = Cells;