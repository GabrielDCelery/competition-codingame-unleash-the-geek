const {
  ITEM_NONE,
  ITEM_ORE,
  ITEM_RADAR,
  COMMAND_REQUEST,
  COMMAND_MOVE,
  COMMAND_DIG,
  COMMAND_WAIT
} = require('../constants');
const RobotAI = require('./RobotAI');
const DataHeatMapEvaluator = require('./DataHeatMapEvaluator');

class Robot {
  constructor({ x, y, item, map, gameState }) {
    this.doesCargoHaveOre = this.doesCargoHaveOre.bind(this);
    this.doesCargoHaveRadar = this.doesCargoHaveRadar.bind(this);
    this.doIExist = this.doIExist.bind(this);
    this.hasOreNearby = this.hasOreNearby.bind(this);
    this.isCargoEmpty = this.isCargoEmpty.bind(this);
    this.isRadarAvailable = this.isRadarAvailable.bind(this);
    this.normalizedDistanceFromHQ = this.normalizedDistanceFromHQ.bind(this);

    this.deliverOreToHome = this.deliverOreToHome.bind(this);
    this.deployRadar = this.deployRadar.bind(this);
    this.pickupRadar = this.pickupRadar.bind(this);
    this.collectNearbyOre = this.collectNearbyOre.bind(this);
    this.moveToBetterPosition = this.moveToBetterPosition.bind(this);

    this.x = x;
    this.y = y;
    this.item = item;
    this.map = map;
    this.gameState = gameState;

    this.robotAI = new RobotAI({
      stateGetters: {
        doesCargoHaveRadar: this.doesCargoHaveRadar,
        doesCargoHaveOre: this.doesCargoHaveOre,
        doIExist: this.doIExist,
        hasOreNearby: this.hasOreNearby,
        isCargoEmpty: this.isCargoEmpty,
        isRadarAvailable: this.isRadarAvailable,
        normalizedDistanceFromHQ: this.normalizedDistanceFromHQ
      }
    });
    this.dataHeatMapEvaluator = new DataHeatMapEvaluator({
      map: this.map
    });
  }

  resetShortTermMemory() {
    this.memory = {
      harvestableOre: null
    };

    return this;
  }

  _convertCoordinatesToKey({ x, y }) {
    return `${x}_${y}`;
  }

  // ****************************** STATE GETTERS ****************************** //

  doesCargoHaveOre() {
    return this.item === ITEM_ORE;
  }

  doesCargoHaveRadar() {
    return this.item === ITEM_RADAR;
  }

  doIExist() {
    return true;
  }

  _hasCellHarvestableOre({ x, y }) {
    const bCellHasOre = this.map
      .getCells()
      .has({ x, y, what: this.map.getAmountKeys().ORE });
    // TODO ACCOUNT FOR ENEMY AND MINES
    const bMarkedForPickup = this.gameState.actionsTaken.pickupOre[
      this._convertCoordinatesToKey({ x, y })
    ];

    return bCellHasOre && !bMarkedForPickup;
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
          this.memory.harvestableOre = {
            x: cellX,
            y: cellY
          };
          return true;
        }
      }
    }

    return false;
  }

  isCargoEmpty() {
    return this.item === ITEM_NONE;
  }

  isRadarAvailable() {
    return (
      this.gameState.radarCooldown === 0 &&
      this.gameState.actionsTaken.pickupRadar === false
    );
  }

  normalizedDistanceFromHQ() {
    return this.x / this.map.getCells().getWidth();
  }

  // ****************************** COMMAND GENERATORS ****************************** //

  deliverOreToHome() {
    if (this.x === 0) {
      return COMMAND_WAIT;
    }

    return `${COMMAND_MOVE} 0 ${this.y}`;
  }

  deployRadar() {}

  pickupRadar() {
    this.gameState.actionsTaken.pickupRadar = true;

    if (this.x === 0) {
      return `${COMMAND_REQUEST} ${ITEM_RADAR}`;
    }

    return `${COMMAND_MOVE} 0 ${this.y}`;
  }

  collectNearbyOre() {
    const { x, y } = this.memory.harvestableOre;
    this.gameState.actionsTaken.pickupOre[
      this._convertCoordinatesToKey({ x, y })
    ] = true;

    return `${COMMAND_DIG} ${x} ${y}`;
  }

  moveToBetterPosition() {
    const { x, y } = this.dataHeatMapEvaluator.getRecommendedCoordinate({
      robotCellX: this.x,
      robotCellY: this.y,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    return `${COMMAND_MOVE} ${x} ${y}`;
  }

  generateCommand() {
    const action = this.robotAI.getAction();

    return this[action]();
  }
}

module.exports = Robot;
