const helpers = require('../helpers');

class GameState {
  constructor({ map }) {
    this.getRadarCooldown = this.getRadarCooldown.bind(this);
    this.getTrapCooldown = this.getTrapCooldown.bind(this);
    this.setRadarCooldown = this.setRadarCooldown.bind(this);
    this.setTrapCoolDown = this.setTrapCoolDown.bind(this);
    this.isCoordinateTaken = this.isCoordinateTaken.bind(this);
    this.isRadarAvailable = this.isRadarAvailable.bind(this);
    this.markCoordinateAsTaken = this.markCoordinateAsTaken.bind(this);
    this.resetTakenCoordinates = this.resetTakenCoordinates.bind(this);

    this.hasOreOnMap = this.hasOreOnMap.bind(this);

    this.map = map;

    this.radarCooldown = Infinity;
    this.trapCooldown = Infinity;
    this.coordinatesTaken = {};
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

  // ****************************** STATE GETTERS ****************************** //

  hasOreOnMap() {
    const { ORE } = this.map.getDataTracker().getAmounts();

    return this.map
      .getDataTracker()
      .getTotals()
      .has({ what: ORE });
  }

  isRadarAvailable() {
    return this.radarCooldown === 0;
  }
}

module.exports = GameState;
