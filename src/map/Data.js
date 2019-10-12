class Data {
  constructor() {
    this.values = new Array(Object.keys(Data.AMOUNTS).length).fill(0);
  }

  static get AMOUNTS() {
    return {
      HOLE: 0,
      ORE: 1,
      ALLIED_ROBOT: 2,
      ENEMY_ROBOT: 3,
      RADAR: 4,
      MINE: 5
    };
  }

  has({ what }) {
    return this.values[what] > 0;
  }

  get({ what }) {
    return this.values[what];
  }

  getAll() {
    return this.values;
  }

  add({ what, amount }) {
    return (this.values[what] += amount);
  }

  set({ what, amount }) {
    return (this.values[what] = amount);
  }

  reset() {
    this.values = new Array(Object.keys(Data.AMOUNTS).length).fill(0);
  }
}

module.exports = Data;
