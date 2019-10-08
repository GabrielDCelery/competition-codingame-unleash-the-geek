const { ENTITY_ALLIED_ROBOT } = require('../constants');
const Robot = require('./Robot');

class Player {
  constructor({ map }) {
    this.updateGamaeStateAtTurnStart = this.updateGamaeStateAtTurnStart.bind(
      this
    );
    this.processEntityInput = this.processEntityInput.bind(this);
    this.generateCommandsForAlliedRobots = this.generateCommandsForAlliedRobots.bind(
      this
    );

    this.robots = {};
    this.map = map;
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
        pickupOre: {}
      }
    };
  }

  processEntityInput({ x, y, type, id, item }) {
    if (type === ENTITY_ALLIED_ROBOT) {
      this.robots[id] = new Robot({
        x,
        y,
        item,
        map: this.map,
        gameState: this.gameState
      }).resetShortTermMemory();
    }
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
    /*
    for (let i = 0, iMax = actionsToExecute.length; i < iMax; i++) {
      console.log(actionsToExecute[i]);
    }
    */
  }
}

module.exports = Player;
