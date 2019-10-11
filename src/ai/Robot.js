const { ITEM_NONE, ITEM_ORE, ITEM_RADAR } = require('../constants');

class Robot {
  constructor({ map, gameState }) {
    this.setState = this.setState.bind(this);
    this.getShortTermMemory = this.getShortTermMemory.bind(this);
    this.resetShortTermMemory = this.resetShortTermMemory.bind(this);

    this.doIExist = this.doIExist.bind(this);
    this.doesCargoHaveOre = this.doesCargoHaveOre.bind(this);
    this.isCargoEmpty = this.isCargoEmpty.bind(this);
    this.normalizedDistanceFromHQ = this.normalizedDistanceFromHQ.bind(this);
    this.safeToDigHoleNextToMe = this.safeToDigHoleNextToMe.bind(this);

    this.map = map;
    this.gameState = gameState;
  }

  setState({ id, x, y, item }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.item = item;

    return this;
  }

  getShortTermMemory() {
    return this.shortTermMemory;
  }

  resetShortTermMemory() {
    this.shortTermMemory = {
      safeToDigHole: null
    };

    return this;
  }

  // ****************************** STATE GETTERS ****************************** //

  doIExist() {
    return true;
  }

  doesCargoHaveOre() {
    return this.item === ITEM_ORE;
  }

  isCargoEmpty() {
    return this.item === ITEM_NONE;
  }

  normalizedDistanceFromHQ() {
    return this.map.getNormalizedDistance({
      startX: this.x,
      startY: this.y,
      endX: 0,
      endY: this.y
    });
  }

  safeToDigHoleNextToMe() {
    const { HOLE, RADAR, MINE } = this.map.getDataTracker().getAmounts();
    const { has } = this.map.getDataTracker();
    const { getCoordinatesAtDistance } = this.map.getDistanceMapper();
    const { isCoordinateTaken } = this.gameState;

    for (
      let distance = 0, distanceMax = 1;
      distance <= distanceMax;
      distance++
    ) {
      const coordinates = getCoordinatesAtDistance({
        x: this.x,
        y: this.y,
        distance
      });

      for (let i = 0, iMax = coordinates.length; i < iMax; i++) {
        const [cellX, cellY] = coordinates[i];
        if (
          cellX !== 0 &&
          !isCoordinateTaken({ x: cellX, y: cellY }) &&
          !has({ x: cellX, y: cellY, what: HOLE }) &&
          !has({ x: cellX, y: cellY, what: RADAR }) &&
          !has({ x: cellX, y: cellY, what: MINE })
        ) {
          this.shortTermMemory.safeToDigHole = {
            x: cellX,
            y: cellY
          };

          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Robot;
