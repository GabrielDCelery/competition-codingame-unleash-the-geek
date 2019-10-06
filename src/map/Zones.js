const Data = require('./Data')

class Zones {
  constructor({ mapWidth, mapHeight, zoneSizeX, zoneSizeY }) {
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
  }

  has({ x, y, what }) {
    return this.data[x][y].has({ what })
  }

  get({ x, y, what }) {
    return this.data[x][y].get({ what })
  }

  getAll({ x, y }) {
    return this.data[x][y].getAll()
  }

  add({ x, y, what, amount }) {
    return this.data[x][y].add({ what, amount })
  }

  set({ x, y, what, amount }) {
    return this.data[x][y].set({ what, amount })
  }

  resetEntities() {
    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this.data[x][y].resetEntities();
      }
    }
  }
}

module.exports = Zones;