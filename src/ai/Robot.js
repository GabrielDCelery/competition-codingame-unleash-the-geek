const {
  READLINE_ITEM_NONE,
  READLINE_ITEM_ORE
} = require('../constants')

class Robot {
  constructor({ x, y, item, map }) {
    this.x = x;
    this.y = y;
    this.item = item;
    this.map = map;
  }

  doesCargoHaveOre() {
    return this.item === READLINE_ITEM_ORE;
  }

  isCargoEmpty() {
    return this.item === READLINE_ITEM_NONE;
  }
}

module.exports = Robot;