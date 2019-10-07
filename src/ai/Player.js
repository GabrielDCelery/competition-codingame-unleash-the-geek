const { READLINE_ENTITY_ALLIED_ROBOT } = require('../constants');
const Robot = require('./Robot');

class Player {
  constructor({ map }) {
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
        pickupRadar: false
      }
    };
  }

  processEntityInput({ x, y, type, id, item }) {
    if (type === READLINE_ENTITY_ALLIED_ROBOT) {
      this.robots[id] = new Robot({
        x,
        y,
        item,
        map: this.map,
        gameState: this.gameState
      });
    }
  }

  generateCommandsForAlliedRobots() {
    const robotIds = Object.keys(this.robots);

    for (let i = 0, iMax = robotIds.length; i < iMax; i++) {
      //const action = this.robots[robotIds[i]].getAction();
      console.log('MOVE 8 4');
    }
  }
}

module.exports = Player;
