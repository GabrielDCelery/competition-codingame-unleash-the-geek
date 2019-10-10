const Data = require('./Data');

class DataMap {
  constructor({ width, height }) {
    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.add = this.add.bind(this);
    this.set = this.set.bind(this);
    this.reset = this.reset.bind(this);

    this.width = width;
    this.height = height;
    this.data = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this.data[x][y] = new Data();
      }
    }
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
}

module.exports = DataMap;
