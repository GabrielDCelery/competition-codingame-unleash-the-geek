const {
  //COMMAND_REQUEST,
  COMMAND_MOVE,
  COMMAND_DIG,
  COMMAND_WAIT
} = require('../constants');

class PlayerCommandGenerator {
  constructor({ map }) {
    this.makeRobotDeliverOreToHQ = this.makeRobotDeliverOreToHQ.bind(this);
    this.makeRobotDigHole = this.makeRobotDigHole.bind(this);
    this.makeRobotScout = this.makeRobotScout.bind(this);

    this.map = map;
  }

  makeRobotDeliverOreToHQ({ robot }) {
    return `${COMMAND_MOVE} ${0} ${robot.y}`;
  }

  makeRobotDigHole({ robot, gameState }) {
    const { x, y } = robot.getShortTermMemory().safeToDigHole;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_DIG} ${x} ${y}`;
  }

  makeRobotScout({ robot, gameState, dataHeatMapEvaluator, configs }) {
    const moveTo = dataHeatMapEvaluator.getRecommendedCoordinate({
      startX: robot.x,
      startY: robot.y,
      maxDistance: configs.robotScanRange,
      scorerMethod: dataHeatMapEvaluator.getScorerMehods().SCOUTING
    });

    if (moveTo === null) {
      return COMMAND_WAIT;
    }

    const { x, y } = moveTo;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_MOVE} ${x} ${y}`;
  }
}

module.exports = PlayerCommandGenerator;
