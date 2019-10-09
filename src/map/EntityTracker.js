const Data = require('./Data');

class EntityTracker {
  constructor() {
    this.add = this.add.bind(this);
    this.convertCoordinatesToKey = this.convertCoordinatesToKey.bind(this);
    this.destructureKeyToCoordinates = this.destructureKeyToCoordinates.bind(
      this
    );
    this.resetEntities = this.resetEntities.bind(this);
    this.entities = {};
    this.resetEntities();
  }

  convertCoordinatesToKey({ x, y }) {
    return `${x}_${y}`;
  }

  destructureKeyToCoordinates(key) {
    const [x, y] = key.split('_');
    return { x, y };
  }

  add({ x, y, what, amount }) {
    const key = this.convertCoordinatesToKey({ x, y });

    const value = Number.isInteger(this.entities[what][key])
      ? this.entities[what][key]
      : 0;

    this.entities[what][key] = value + amount;
  }

  resetEntities() {
    const amounts = Object.keys(Data.AMOUNTS);

    for (let amount in amounts) {
      this.entities[amount] = {};
    }
  }
}

module.exports = EntityTracker;
