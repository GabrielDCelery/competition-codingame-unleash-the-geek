class Zones {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.getHoleAmount = this.getHoleAmount.bind(this)
    this.addHole = this.addHole.bind(this)
    this.getOreAmount = this.getOreAmount.bind(this)
    this.setOreAmount = this.setOreAmount.bind(this)
    this.resetEntities = this.resetEntities.bind(this)
    this.addAlliedRobot = this.addAlliedRobot.bind(this)
    this.addEnemyRobot = this.addEnemyRobot.bind(this)
    this.addRadar = this.addRadar.bind(this)
    this.addMine = this.addMine.bind(this)
    this._init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY })
  }

  static get DATA() {
    return {
      HOLE_AMOUNT: 0,
      ORE_AMOUNT: 1,
      ALLIED_ROBOT_AMOUNT: 2,
      ENEMY_ROBOT_AMOUNT: 3,
      RADAR_AMOUNT: 4,
      MINE_AMOUNT: 5
    }
  }

  _resetEntitiesInZone({ x, y }) {
    const zone = this.data[x][y];
    zone[Zones.DATA.ALLIED_ROBOT_AMOUNT] = 0
    zone[Zones.DATA.ENEMY_ROBOT_AMOUNT] = 0
    zone[Zones.DATA.RADAR_AMOUNT] = 0
    zone[Zones.DATA.MINE_AMOUNT] = 0
  }

  _initZone({ x, y }) {
    const zone = new Array([
      Zones.DATA.HOLE_AMOUNT,
      Zones.DATA.ORE_AMOUNT,
      Zones.DATA.ALLIED_ROBOT_AMOUNT,
      Zones.DATA.ENEMY_ROBOT_AMOUNT,
      Zones.DATA.RADAR_AMOUNT,
      Zones.DATA.MINE_AMOUNT
    ].length).fill(null);
    zone[Zones.DATA.HOLE_AMOUNT] = 0
    zone[Zones.DATA.ORE_AMOUNT] = 0
    zone[Zones.DATA.ALLIED_ROBOT_AMOUNT] = 0
    zone[Zones.DATA.ENEMY_ROBOT_AMOUNT] = 0
    zone[Zones.DATA.RADAR_AMOUNT] = 0
    zone[Zones.DATA.MINE_AMOUNT] = 0

    this.data[x][y] = zone;

    return zone;
  }

  _init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.width = mapWidth / zoneSizeX;
    this.height = mapHeight / zoneSizeY;
    this.data = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this._initZone({ x, y })
      }
    }
  }

  resetEntities() {
    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this._resetEntitiesInZone({ x, y });
      }
    }
  }

  getHoleAmount({ x, y }) {
    return this.data[x][y][Zones.DATA.HOLE_AMOUNT];
  }

  addHole({ x, y }) {
    return this.data[x][y][Zones.DATA.HOLE_AMOUNT]++;
  }

  getOreAmount({ x, y }) {
    return this.data[x][y][Zones.DATA.ORE_AMOUNT];
  }

  setOreAmount({ x, y, amount }) {
    return this.data[x][y][Zones.DATA.ORE_AMOUNT] = amount;
  }

  addAlliedRobot({ x, y }) {
    return this.data[x][y][Zones.DATA.ALLIED_ROBOT_AMOUNT]++;
  }

  addEnemyRobot({ x, y }) {
    return this.data[x][y][Zones.DATA.ENEMY_ROBOT_AMOUNT]++;
  }

  addRadar({ x, y }) {
    return this.data[x][y][Zones.DATA.RADAR_AMOUNT]++;
  }

  addMine({ x, y }) {
    return this.data[x][y][Zones.DATA.MINE_AMOUNT]++;
  }
}

module.exports = Zones;