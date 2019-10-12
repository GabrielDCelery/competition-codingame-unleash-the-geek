const Data = require('./Data');
const GridDistanceMapper = require('./GridDistanceMapper');

class Cells {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
    this.getWidth = this.getWidth.bind(this);
    this.getHeight = this.getHeight.bind(this);
    this.getDistanceMapper = this.getDistanceMapper.bind(this);
    this.getNormalizedDistance = this.getNormalizedDistance.bind(this);
    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.add = this.add.bind(this);
    this.set = this.set.bind(this);
    this.reset = this.reset.bind(this);
    this.getZoneCoordinates = this.getZoneCoordinates.bind(this);

    this.width = mapWidth;
    this.height = mapHeight;
    this.data = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));
    this.zones = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this.data[x][y] = new Data();
        this.zones[x][y] = [
          Math.floor(x / zoneSizeX),
          Math.floor(y / zoneSizeY)
        ];
      }
    }

    this.cellsDistanceMapper = new GridDistanceMapper({
      width: this.width,
      height: this.height
    });
    this.cellsDistanceMapper.mapDistances({ maxDistance: 3 });
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDistanceMapper() {
    return this.cellsDistanceMapper;
  }

  getNormalizedDistance({ startX, startY, endX, endY }) {
    const diff = Math.abs(startX - endX) + Math.abs(startY - endY);

    if (diff === 0) {
      return 0;
    }

    return diff / (this.width + this.height - 2);
  }

  has({ x, y, what }) {
    return this.data[x][y].has({ what });
  }

  get({ x, y, what }) {
    return this.data[x][y].get({ what });
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

  getZoneCoordinates({ x, y }) {
    const [zoneX, zoneY] = this.zones[x][y];

    return {
      x: zoneX,
      y: zoneY
    };
  }
}

module.exports = Cells;
