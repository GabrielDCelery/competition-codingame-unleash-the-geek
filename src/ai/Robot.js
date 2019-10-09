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
    this.amIOnBase = this.amIOnBase.bind(this);
    this.doIExist = this.doIExist.bind(this);
    this.doesCargoHaveOre = this.doesCargoHaveOre.bind(this);
    this.doesCargoHaveRadar = this.doesCargoHaveRadar.bind(this);
    this.hasOreNearby = this.hasOreNearby.bind(this);
    this.hasOreOnMap = this.hasOreOnMap.bind(this);
    this.isCargoEmpty = this.isCargoEmpty.bind(this);
    this.isRadarAvailable = this.isRadarAvailable.bind(this);
    this.normalizedDistanceFromHQ = this.normalizedDistanceFromHQ.bind(this);
    this.safeToDigHoleNextToMe = this.safeToDigHoleNextToMe.bind(this);

    this.collectNearbyOre = this.collectNearbyOre.bind(this);
    this.deliverOreToHome = this.deliverOreToHome.bind(this);
    this.deployRadar = this.deployRadar.bind(this);
    this.digHoleNextToMe = this.digHoleNextToMe.bind(this);
    this.moveToBetterPosition = this.moveToBetterPosition.bind(this);
    this.pickupRadar = this.pickupRadar.bind(this);

    this.x = x;
    this.y = y;
    this.item = item;
    this.map = map;
    this.gameState = gameState;

    this.robotAI = new RobotAI({
      stateGetters: {
        amIOnBase: this.amIOnBase,
        doIExist: this.doIExist,
        doesCargoHaveOre: this.doesCargoHaveOre,
        doesCargoHaveRadar: this.doesCargoHaveRadar,
        hasOreNearby: this.hasOreNearby,
        hasOreOnMap: this.hasOreOnMap,
        isCargoEmpty: this.isCargoEmpty,
        isRadarAvailable: this.isRadarAvailable,
        normalizedDistanceFromHQ: this.normalizedDistanceFromHQ,
        safeToDigHoleNextToMe: this.safeToDigHoleNextToMe
      }
    });
    this.dataHeatMapEvaluator = new DataHeatMapEvaluator({
      map: this.map
    });
  }

  resetShortTermMemory() {
    this.memory = {
      harvestableOre: null,
      safeCell: null
    };

    return this;
  }

  _convertCoordinatesToKey({ x, y }) {
    return `${x}_${y}`;
  }

  // ****************************** STATE GETTERS ****************************** //

  amIOnBase() {
    return this.x === 0;
  }

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

  hasOreOnMap() {
    const { ORE } = this.map.getAmountKeys();
    return this.map.getTotals().has({ ORE });
  }

  safeToDigHoleNextToMe() {
    const { HOLE, RADAR, MINE } = this.map.getAmountKeys();
    for (
      let distance = 0, distanceMax = 1;
      distance <= distanceMax;
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
        if (
          cellX !== 0 &&
          !this.gameState.actionsTaken.digHole[
            this._convertCoordinatesToKey({ x: cellX, y: cellY })
          ] &&
          !this.map.getCells().has({
            x: cellX,
            y: cellY,
            what: HOLE
          }) &&
          !this.map.getCells().has({
            x: cellX,
            y: cellY,
            what: RADAR
          }) &&
          !this.map.getCells().has({
            x: cellX,
            y: cellY,
            what: MINE
          })
        ) {
          this.memory.safeCell = {
            x: cellX,
            y: cellY
          };

          return true;
        }
      }
    }

    return false;
  }

  hasOreNearby() {
    for (
      let distance = 0, distanceMax = 2;
      distance <= distanceMax;
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

  deployRadar() {
    const { x, y } = this.dataHeatMapEvaluator.getRecommendedCoordinate({
      robotCellX: this.x,
      robotCellY: this.y,
      maxZoneDistance: 6,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.DEPLOY_RADAR
    });

    return `${COMMAND_DIG} ${x} ${y}`;
  }

  digHoleNextToMe() {
    const { x, y } = this.memory.safeCell;
    this.gameState.actionsTaken.digHole[
      this._convertCoordinatesToKey({ x, y })
    ] = true;

    return `${COMMAND_DIG} ${x} ${y}`;
  }

  pickupRadar() {
    this.gameState.actionsTaken.pickupRadar = true;

    if (this.x === 0) {
      return `${COMMAND_REQUEST} ${'RADAR'}`;
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
      maxZoneDistance: 3,
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
