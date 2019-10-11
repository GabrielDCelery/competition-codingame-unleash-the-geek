const {
  COMMAND_REQUEST,
  COMMAND_MOVE,
  COMMAND_DIG,
  COMMAND_WAIT
} = require('../constants');

class PlayerCommandGenerator {
  constructor() {
    this.makeRobotDeliverOreToHQ = this.makeRobotDeliverOreToHQ.bind(this);
    this.makeRobotDeployRadar = this.makeRobotDeployRadar.bind(this);
    this.makeRobotDigHole = this.makeRobotDigHole.bind(this);
    this.makeRobotPickupRadar = this.makeRobotPickupRadar.bind(this);
    this.makeRobotWander = this.makeRobotWander.bind(this);
  }

  makeRobotDeliverOreToHQ({ robot }) {
    return `${COMMAND_MOVE} ${0} ${robot.y}`;
  }

  makeRobotDigHole({ robot, gameState }) {
    const { x, y } = robot.getShortTermMemory().safeToDigHole;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_DIG} ${x} ${y}`;
  }

  makeRobotDeployRadar({ robot, gameState, coordinatorCalculator, configs }) {
    const moveTo = coordinatorCalculator.getRecommendedCoordinate(
      'radarDeployer',
      {
        robotX: robot.x,
        robotY: robot.y
      }
    );

    if (moveTo === null) {
      gameState.markCoordinateAsTaken({ x: robot.x, y: robot.y });
      return COMMAND_WAIT;
    }

    const { x, y } = moveTo;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_DIG} ${x} ${y}`;
  }

  makeRobotPickupRadar({ robot, gameState }) {
    gameState.markCoordinateAsTaken({ x: robot.x, y: robot.y });
    gameState.markActionAsTaken('radarPickup');

    return `${COMMAND_REQUEST} RADAR`;
  }

  makeRobotWander({ robot, gameState, coordinatorCalculator, configs }) {
    const moveTo = coordinatorCalculator.getRecommendedCoordinate('wanderer', {
      robotX: robot.x,
      robotY: robot.y,
      maxDistance: configs.robotScanRange
    });

    if (moveTo === null) {
      gameState.markCoordinateAsTaken({ x: robot.x, y: robot.y });
      return COMMAND_WAIT;
    }

    const { x, y } = moveTo;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_MOVE} ${x} ${y}`;
  }
}

module.exports = PlayerCommandGenerator;
