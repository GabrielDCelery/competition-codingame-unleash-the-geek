class Zones {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.coordinates = null;
    this.getHoleAmount = this.getHoleAmount.bind(this)
    this.addHole = this.addHole.bind(this)
    this.getOreAmount = this.getOreAmount.bind(this)
    this.setOreAmount = this.setOreAmount.bind(this)
    this._init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY })
  }

  static get DATA() {
    return {
      HOLE_AMOUNT: 0,
      ORE_AMOUNT: 1,
      NUM_OF_ENEMY_ROBOTS: 2
    }
  }

  _initZone({ x, y }) {
    const zone = new Array([
      Zones.DATA.HOLE_AMOUNT,
      Zones.DATA.ORE_AMOUNT,
      Zones.DATA.NUM_OF_ENEMY_ROBOTS
    ].length).fill(null);
    zone[Zones.DATA.HOLE_AMOUNT] = 0
    zone[Zones.DATA.ORE_AMOUNT] = 0
    zone[Zones.DATA.NUM_OF_ENEMY_ROBOTS] = 0

    this.coordinates[x][y] = zone;

    return zone;
  }

  _init({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.width = mapWidth / zoneSizeX;
    this.height = mapHeight / zoneSizeY;
    this.coordinates = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this._initZone({ x, y })
      }
    }
  }

  getHoleAmount({x, y}) {
    return this.coordinates[x][y][Zones.DATA.HOLE_AMOUNT];
  }

  addHole({ x, y }) {
    this.coordinates[x][y][Zones.DATA.HOLE_AMOUNT]++;
  }

  getOreAmount({ x, y }) {
    return this.coordinates[x][y][Zones.DATA.ORE_AMOUNT];
  }

  setOreAmount({ x, y, amount }) {
    return this.coordinates[x][y][Zones.DATA.ORE_AMOUNT] = amount;
  }
}

module.exports = Zones;