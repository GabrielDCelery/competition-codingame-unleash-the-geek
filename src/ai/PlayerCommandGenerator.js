const {
  COMMAND_REQUEST,
  COMMAND_MOVE,
  COMMAND_DIG,
  COMMAND_WAIT
} = require('../constants');

class PlayerCommandGenerator {
  constructor() {
    this.makeRobotWait = this.makeRobotWait.bind(this);
    this.makeRobotDeliverOreToHQ = this.makeRobotDeliverOreToHQ.bind(this);
    this.makeRobotDeployRadar = this.makeRobotDeployRadar.bind(this);
    this.makeRobotDigHole = this.makeRobotDigHole.bind(this);
    this.makeRobotHarvestOre = this.makeRobotHarvestOre.bind(this);
    this.makeRobotPickupRadar = this.makeRobotPickupRadar.bind(this);
    this.makeRobotWander = this.makeRobotWander.bind(this);
  }

  makeRobotWait({}) {
    return `${COMMAND_WAIT} dead`;
  }

  makeRobotDeliverOreToHQ({ robot }) {
    return `${COMMAND_MOVE} ${0} ${robot.y} deliver ore`;
  }

  makeRobotDigHole({ robot, gameState }) {
    const { x, y } = robot.getShortTermMemory().safeToDigHole;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_DIG} ${x} ${y} sample`;
  }

  makeRobotHarvestOre({ robot, gameState }) {
    const { x, y } = robot.getShortTermMemory().safeToHarvest;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_DIG} ${x} ${y} harvest`;
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
      return `${COMMAND_DIG} ${robot.x} ${robot.y} deploy radar`;
    }

    const { x, y } = moveTo;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_DIG} ${x} ${y} deploy radar`;
  }

  makeRobotPickupRadar({ robot, gameState }) {
    gameState.markCoordinateAsTaken({ x: robot.x, y: robot.y });
    gameState.markActionAsTaken('radarPickup');

    return `${COMMAND_REQUEST} RADAR pickup radar`;
  }

  makeRobotWander({ robot, gameState, coordinatorCalculator, configs }) {
    const moveTo = coordinatorCalculator.getRecommendedCoordinate('wanderer', {
      robotX: robot.x,
      robotY: robot.y,
      maxDistance: configs.robotScanRange
    });

    if (moveTo === null) {
      gameState.markCoordinateAsTaken({ x: robot.x, y: robot.y });
      return `${COMMAND_WAIT} move`;
    }

    const { x, y } = moveTo;
    gameState.markCoordinateAsTaken({ x, y });

    return `${COMMAND_MOVE} ${x} ${y} move`;
  }
}

module.exports = PlayerCommandGenerator;
