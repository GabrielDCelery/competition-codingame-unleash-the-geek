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
    this.robots = {};
    this.map = map;
    this.radarDistributorAI = new RadarDistributorAI({ map: this.map });
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

  generateCommandsForAlliedRobots() {
    const robotIds = Object.keys(this.robots).sort();
    const actionsToExecute = [];

    for (let i = 0, iMax = robotIds.length; i < iMax; i++) {
      actionsToExecute.push(this.robots[robotIds[i]].generateCommand());
    }

    return actionsToExecute;
  }
}

module.exports = Player;
