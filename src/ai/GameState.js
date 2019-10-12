const {
  GAME_RADAR_RANGE,
  ITEM_NONE,
  ITEM_ORE,
  ITEM_RADAR
} = require('../constants');
const helpers = require('../helpers');

class GameState {
  constructor({ map, robots }) {
    this.getRadarCooldown = this.getRadarCooldown.bind(this);
    this.getTrapCooldown = this.getTrapCooldown.bind(this);
    this.setRadarCooldown = this.setRadarCooldown.bind(this);
    this.setTrapCoolDown = this.setTrapCoolDown.bind(this);
    this.isCoordinateTaken = this.isCoordinateTaken.bind(this);
    this.isActionTaken = this.isActionTaken.bind(this);
    this.markActionAsTaken = this.markActionAsTaken.bind(this);
    this.markCoordinateAsTaken = this.markCoordinateAsTaken.bind(this);
    this.resetTakenCoordinates = this.resetTakenCoordinates.bind(this);

    this.hasOreOnMap = this.hasOreOnMap.bind(this);
    this.hasEnoughRadars = this.hasEnoughRadars.bind(this);
    this.isRadarAvailable = this.isRadarAvailable.bind(this);

    this.map = map;
    this.robots = robots;

    this.radarCooldown = Infinity;
    this.trapCooldown = Infinity;
    this.coordinatesTaken = {};
    this.actionsTaken = {};
  }

  getRadarCooldown() {
    return this.radarCooldown;
  }

  getTrapCooldown() {
    return this.trapCooldown;
  }

  setRadarCooldown(radarCooldown) {
    this.radarCooldown = radarCooldown;

    return this;
  }

  setTrapCoolDown(trapCooldown) {
    this.trapCooldown = trapCooldown;

    return this;
  }

  isActionTaken(actionName) {
    return this.actionsTaken[actionName] === true;
  }

  markActionAsTaken(actionName) {
    return (this.actionsTaken[actionName] = true);
  }

  isCoordinateTaken({ x, y }) {
    return (
      this.coordinatesTaken[helpers.convertCoordinatesToKey({ x, y })] === true
    );
  }

  markCoordinateAsTaken({ x, y }) {
    this.coordinatesTaken[helpers.convertCoordinatesToKey({ x, y })] = true;
  }

  resetTakenCoordinates() {
    this.coordinatesTaken = {};
  }

  resetTakenActions() {
    this.actionsTaken = {};
  }

  // ****************************** STATE GETTERS ****************************** //

  hasEnoughRadars() {
    const { RADAR } = this.map.getDataTracker().getAmounts();
    const numOfRadarsDeployed = this.map
      .getDataTracker()
      .getTotals()
      .get({ what: RADAR });

    let numOfRadarsInCargoes = 0;
    const robotIds = Object.keys(this.robots);

    for (let i = 0, iMax = robotIds.length; i < iMax; i++) {
      const robot = this.robots[robotIds[i]];
      if (robot.getItem() === ITEM_RADAR) {
        numOfRadarsInCargoes++;
      }
    }

    const totalNumOfRadars = numOfRadarsDeployed + numOfRadarsInCargoes;
    const numOfRecommendedRadars =
      (this.map.width / (GAME_RADAR_RANGE + 1)) *
      (this.map.height / (GAME_RADAR_RANGE + 1));

    return numOfRecommendedRadars <= totalNumOfRadars;
  }

  hasOreOnMap() {
    const { ORE } = this.map.getDataTracker().getAmounts();

    return this.map
      .getDataTracker()
      .getTotals()
      .has({ what: ORE });
  }

  isRadarAvailable() {
    return this.radarCooldown === 0 && !this.isActionTaken('radarPickup');
  }
}

module.exports = GameState;
