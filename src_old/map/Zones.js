const Data = require('./Data');
const GridDistanceMapper = require('./GridDistanceMapper');

class Zones {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.getWidth = this.getWidth.bind(this);
    this.getHeight = this.getHeight.bind(this);
    this.getDistanceMapper = this.getDistanceMapper.bind(this);
    this.getNormalizedDistance = this.getNormalizedDistance.bind(this);
    this.getCenterCell = this.getCenterCell.bind(this);
    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.add = this.add.bind(this);
    this.set = this.set.bind(this);
    this.reset = this.reset.bind(this);

    this.zoneSizeX = zoneSizeX;
    this.zoneSizeY = zoneSizeY;
    this.width = mapWidth / zoneSizeX;
    this.height = mapHeight / zoneSizeY;
    this.data = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this.data[x][y] = new Data();
      }
    }
    this.zonesDistanceMapper = new GridDistanceMapper({
      width: this.width,
      height: this.height
    });
    this.zonesDistanceMapper.mapDistances();
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDistanceMapper() {
    return this.zonesDistanceMapper;
  }

  getNormalizedDistance({ startX, startY, endX, endY }) {
    const diff = Math.abs(startX - endX) + Math.abs(startY - endY);

    if (diff === 0) {
      return;
    }

    return diff / (this.width + this.height - 2);
  }

  getCenterCell({ x, y }) {
    const left = x * this.zoneSizeX;
    const right = (x + 1) * this.zoneSizeX;
    const top = y * this.zoneSizeY;
    const bottom = (y + 1) * this.zoneSizeY;

    return {
      x: Math.floor((left + right) / 2),
      y: Math.floor((top + bottom) / 2)
    };
  }

  has({ x, y, what }) {
    return this.data[x][y].has({ what });
  }

  get({ x, y, what }) {
    return this.data[x][y].get({ what });
  }

  getAll({ x, y }) {
    return this.data[x][y].getAll();
  }

  add({ x, y, what, amount }) {
    return this.data[x][y].add({ what, amount });
  }

  set({ x, y, what, amount }) {
    return this.data[x][y].set({ what, amount });
  }

  reset() {
    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this.data[x][y].reset();
      }
    }
  }
}

module.exports = Zones;
