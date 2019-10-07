const {
  READLINE_ITEM_NONE,
  READLINE_ITEM_ORE,
  READLINE_ITEM_RADAR
} = require('../constants');
const RobotAI = rerquire('./RobotAI');

class Robot {
  constructor({ x, y, item, map, gameState }) {
    this.x = x;
    this.y = y;
    this.item = item;
    this.map = map;
    this.gameState = gameState;
    this.isCargoEmpty = this.isCargoEmpty.bind(this);
    this.doesCargoHaveOre = this.doesCargoHaveOre.bind(this);
    this.doesCargoHaveRadar = this.doesCargoHaveRadar.bind(this);
    this.isRadarAvailable = this.isRadarAvailable.bind(this);
    this.normalizedDistanceFromHQ = this.normalizedDistanceFromHQ.bind(this);
    this.hasOreNearby = this.hasOreNearby.bind(this);

    this.deliverOreToHome = this.deliverOreToHome.bind(this);
    this.deployRadar = this.deployRadar.bind(this);
    this.pickupRadar = this.pickupRadar.bind(this);
    this.collectNearbyOre = this.collectNearbyOre.bind(this);
    this.moveToBetterPosition = this.moveToBetterPosition.bind(this);

    this.robotAI = new RobotAI({
      actions: {
        deliverOreToHome: this.deliverOreToHome,
        deployRadar: this.deployRadar,
        pickupRadar: this.pickupRadar,
        collectNearbyOre: this.collectNearbyOre,
        moveToBetterPosition: this.moveToBetterPosition
      },
      stateGetters: {
        doesCargoHaveRadar: this.doesCargoHaveRadar,
        doesCargoHaveOre: this.doesCargoHaveOre,
        hasOreNearby: this.hasOreNearby,
        isCargoEmpty: this.isCargoEmpty,
        isRadarAvailable: this.isRadarAvailable,
        normalizedDistanceFromHQ: this.normalizedDistanceFromHQ
      }
    });
  }

  doesCargoHaveOre() {
    return this.item === READLINE_ITEM_ORE;
  }

  doesCargoHaveRadar() {
    return this.item === READLINE_ITEM_RADAR;
  }

  _hasCellHarvestableOre({ x, y }) {
    const bCellHasOre = this.map
      .getCells()
      .has({ x, y, what: this.map.getDataClass().AMOUNTS.ORE });
  }

  hasOreNearby() {
    for (
      let distance = 0, distanceMax = 3;
      distance < distanceMax;
      distance++
    ) {
      const coordinates = this.map
        .getCells()
        .getDistanceMapper()
        .getCoordinatesAtDistance({
          x: this.x,
          y: this.y,
          distance
        });

      for (let i = 0, iMax = coordinates.length; i < iMax; i++) {
        const [cellX, cellY] = coordinates[i];
        if (this._hasCellHarvestableOre({ x: cellX, y: cellY })) {
        }
      }
    }
  }

  isCargoEmpty() {
    return this.item === READLINE_ITEM_NONE;
  }

  isRadarAvailable() {
    return (
      this.gameState.radarCooldown === 0 &&
      this.gameState.actionsTaken.pickupRadar === false
    );
  }

  normalizedDistanceFromHQ() {
    return this.x / this.map.getCells().width;
  }

  deliverOreToHome() {}

  deployRadar() {}

  pickupRadar() {}

  collectNearbyOre() {}

  moveToBetterPosition() {}

  getAction() {
    return this.robotAI.getAction();
  }
}

module.exports = Robot;
