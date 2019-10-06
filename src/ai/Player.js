const {
  READLINE_ENTITY_ALLIED_ROBOT,
  READLINE_ITEM_NONE
} = require('../constants')
const RobotAI = require('./RobotAI')

class Player {
  constructor({ map }) {
    this.robots = {}
    this.map = map;
    this.radarCooldown = Infinity;
    this.trapCooldown = Infinity;
    this.isCargoEmpty = this.isCargoEmpty.bind(this);
    this.isRadarAvailable = this.isRadarAvailable.bind(this);
    this.normalizedDistanceFromHQ = this.normalizedDistanceFromHQ.bind(this);
    this.hasOreInZone = this.hasOreInZone.bind(this);
    this.hasOreInAdjacentZone = this.hasOreInAdjacentZone.bind(this);
    this.robotAI = new RobotAI({
      stateGetters: {
        isCargoEmpty: this.isCargoEmpty,
        isRadarAvailable: this.isRadarAvailable,
        normalizedDistanceFromHQ: this.normalizedDistanceFromHQ,
        hasOreInZone: this.hasOreInZone,
        hasOreInAdjacentZone: this.hasOreInAdjacentZone
      }
    })
  }

  setRadarCooldown(radarCooldown) {
    this.radarCooldown = radarCooldown;
  }

  setTrapCooldown(trapCooldown) {
    this.trapCooldown = trapCooldown;
  }

  isCargoEmpty(robotId) {
    return this.robots[robotId]['item'] === READLINE_ITEM_NONE;
  }

  isRadarAvailable() {
    return this.radarCooldown === 0;
  }

  normalizedDistanceFromHQ(robotId) {

  }

  hasOreInZone(robotId) {
    const { x, y } = this.robots[robotId]
  }

  hasOreInAdjacentZone() {

  }

  processEntityInput({ x, y, type, id, item }) {
    if (type === READLINE_ENTITY_ALLIED_ROBOT) {
      this.robots[id] = { x, y, item };
    }
  }

  generateCommandsForAlliedRobots() {
    const robotIds = Object.keys(this.robots);

    for (let i = 0, iMax = robotIds.length; i < iMax; i++) {
      const action = this.robotAI.getAction(robotIds[i]);
      console.log('MOVE 8 4')
    }
  }
}

module.exports = Player;