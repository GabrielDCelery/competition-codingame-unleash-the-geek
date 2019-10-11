const { READLINE_ENTITY_ALLIED_ROBOT } = require('../constants');
const Robot = require('./Robot');
const GameState = require('./GameState');
const PlayerAI = require('./PlayerAI');
const PlayerCommandGenerator = require('./PlayerCommandGenerator');
const DataHeatMapEvaluator = require('./DataHeatMapEvaluator');

class Player {
  constructor({ map, configs }) {
    this.updateGameState = this.updateGameState.bind(this);
    this.processEntityInput = this.processEntityInput.bind(this);
    this.generateCommandsForAlliedRobots = this.generateCommandsForAlliedRobots.bind(
      this
    );

    this.robots = {};
    this.configs = configs;
    this.map = map;
    this.gameState = new GameState({ map });
    this.playerAI = new PlayerAI();
    this.playerCommandGenerator = new PlayerCommandGenerator({ map });
    this.dataHeatMapEvaluator = new DataHeatMapEvaluator({ map });
  }

  updateGameState({ radarCooldown, trapCooldown }) {
    this.gameState.setRadarCooldown(radarCooldown);
    this.gameState.setTrapCoolDown(trapCooldown);
    this.gameState.resetTakenCoordinates();

    return this;
  }

  processEntityInput({ x, y, type, id, item }) {
    if (type === READLINE_ENTITY_ALLIED_ROBOT) {
      if (!this.robots[id]) {
        this.robots[id] = new Robot({
          map: this.map,
          gameState: this.gameState
        });
      }

      this.robots[id].setState({ id, x, y, item }).resetShortTermMemory();
    }
  }

  generateCommandsForAlliedRobots() {
    return Object.keys(this.robots)
      .sort()
      .map(robotId => {
        const robot = this.robots[robotId];
        const action = this.playerAI.getActionForRobot({
          robot,
          gameState: this.gameState
        });
        const command = this.playerCommandGenerator[action]({
          robot,
          gameState: this.gameState,
          dataHeatMapEvaluator: this.dataHeatMapEvaluator,
          configs: this.configs
        });

        return command;
      });
  }
}

module.exports = Player;
