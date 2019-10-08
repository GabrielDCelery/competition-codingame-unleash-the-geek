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
    const actionsToExecute = [];

    for (let i = 0, iMax = robotIds.length; i < iMax; i++) {
      const action = this.robots[robotIds[i]].generateCommand();
      actionsToExecute.push(action);
    }

    for (let i = 0, iMax = actionsToExecute.length; i < iMax; i++) {
      console.log(actionsToExecute[i]);
    }
  }
}

module.exports = Player;
