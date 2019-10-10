const { ENTITY_ALLIED_ROBOT } = require('../constants');
const Robot = require('./Robot');
const RadarDistributorAI = require('./RadarDistributorAI');

class Player {
  constructor({ map }) {
    this.updateGamaeStateAtTurnStart = this.updateGamaeStateAtTurnStart.bind(
      this
    );
    this.processEntityInput = this.processEntityInput.bind(this);
    this.generateCommandsForAlliedRobots = this.generateCommandsForAlliedRobots.bind(
      this
    );
    this.requestRadarDropCoordinate = this.requestRadarDropCoordinate.bind(
      this
    );

    this.robots = {};
    this.map = map;
    this.radarDistributorAI = new RadarDistributorAI({ map: this.map });
    this.playerMethods = {
      requestRadarDropCoordinate: this.requestRadarDropCoordinate
    };
    this.updateGamaeStateAtTurnStart({
      radarCooldown: Infinity,
      trapCooldown: Infinity
    });
  }

  updateGamaeStateAtTurnStart({ radarCooldown, trapCooldown }) {
    this.gameState = {
      radarCooldown: radarCooldown,
      trapCooldown: trapCooldown,
      actionsTaken: {
        pickupRadar: false,
        pickupOre: {},
        digHole: {}
      }
    };
  }

  processEntityInput({ x, y, type, id, item }) {
    if (type === ENTITY_ALLIED_ROBOT) {
      if (!this.robots[id]) {
        this.robots[id] = new Robot({
          map: this.map,
          gameState: this.gameState,
          playerMethods: this.playerMethods,
          radarDistributorAI: this.radarDistributorAI
        });
      }

      this.robots[id]
        .setPersonalState({ id, x, y, item })
        .resetShortTermMemory();
    }
  }

  requestRadarDropCoordinate({ robotId }) {
    const { x, y } = this.radarDistributorAI.getNextRadarDeployCoordinates();

    return { x, y };
  }

  generateCommandsForAlliedRobots() {
    const robotIds = Object.keys(this.robots).sort();

    const sortedRobotIds = [];
    for (let robotId in robotIds) {
      sortedRobotIds.push([robotId, this.robots[robotId]['y']]);
    }

    sortedRobotIds.sort((a, b) => a[1] - b[1]);

    const actionsToExecute = new Array(5).fill(0);
    const robotOrders = [2, 1, 3, 0, 4];

    for (let i = 0, iMax = robotIds.length; i < iMax; i++) {
      const robotOrder = robotOrders[i];
      const robotId = sortedRobotIds[robotOrder][0];
      actionsToExecute[robotOrder] = this.robots[robotId].generateCommand();
    }

    return actionsToExecute;
  }
}

module.exports = Player;
