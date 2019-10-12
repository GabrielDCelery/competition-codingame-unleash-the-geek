const { ITEM_NONE, ITEM_ORE, ITEM_RADAR } = require('../constants');

class Robot {
  constructor({ map, gameState }) {
    this.getItem = this.getItem.bind(this);
    this.getShortTermMemory = this.getShortTermMemory.bind(this);
    this.resetShortTermMemory = this.resetShortTermMemory.bind(this);
    this.setState = this.setState.bind(this);

    this.amIDead = this.amIDead.bind(this);
    this.doIExist = this.doIExist.bind(this);
    this.doesCargoHaveOre = this.doesCargoHaveOre.bind(this);
    this.doesCargoHaveRadar = this.doesCargoHaveRadar.bind(this);
    this.isCargoEmpty = this.isCargoEmpty.bind(this);
    this.normalizedDistanceFromHQ = this.normalizedDistanceFromHQ.bind(this);
    this.normalizedDistanceFromNearestOre = this.normalizedDistanceFromNearestOre.bind(
      this
    );
    this.safeToDigHoleNextToMe = this.safeToDigHoleNextToMe.bind(this);

    this.map = map;
    this.gameState = gameState;
  }

  getItem() {
    return this.item;
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
      safeToDigHole: null,
      safeToHarvest: null
    };

    return this;
  }

  // ****************************** STATE GETTERS ****************************** //

  amIDead() {
    return this.x < 0 || this.y < 0;
  }

  doIExist() {
    return true;
  }

  doesCargoHaveOre() {
    return this.item === ITEM_ORE;
  }

  doesCargoHaveRadar() {
    return this.item === ITEM_RADAR;
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

  normalizedDistanceFromNearestOre() {
    const { getNormalizedDistance } = this.map;
    const { getCoordinatesAtDistance } = this.map.getDistanceMapper();
    const { has } = this.map.getDataTracker();
    const { ORE } = this.map.getDataTracker().getAmounts();
    const { isCoordinateTaken } = this.gameState;

    for (
      let distance = 0, distanceMax = 8;
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
          has({ x: cellX, y: cellY, what: ORE }) &&
          !isCoordinateTaken({ x: cellX, y: cellY })
        ) {
          this.shortTermMemory.safeToHarvest = {
            x: cellX,
            y: cellY
          };
          return getNormalizedDistance({
            startX: this.x,
            startY: this.y,
            endX: cellX,
            endY: cellY
          });
        }
      }
    }

    return Infinity;
  }

  safeToDigHoleNextToMe() {
    const { HOLE, RADAR, MINE } = this.map.getDataTracker().getAmounts();
    const { has, hasInRange } = this.map.getDataTracker();
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
          !hasInRange({ x: cellX, y: cellY, distance: 4, what: RADAR }) &&
          !isCoordinateTaken({ x: cellX, y: cellY }) &&
          !has({ x: cellX, y: cellY, what: HOLE }) &&
          //!has({ x: cellX, y: cellY, what: RADAR }) &&
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
