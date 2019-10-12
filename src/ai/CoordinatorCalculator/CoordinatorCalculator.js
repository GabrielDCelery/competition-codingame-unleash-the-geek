const { Harvester, RadarDeployer, Wanderer } = require('./roles');

class CoordinatorCalculator {
  constructor({ map, gameState, playerMemory }) {
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);

    this.roles = {
      harvester: new Harvester({ map, gameState, playerMemory }),
      radarDeployer: new RadarDeployer({ map, gameState, playerMemory }),
      wanderer: new Wanderer({ map, gameState, playerMemory })
    };
  }

  getRecommendedCoordinate(role, args) {
    return this.roles[role].getRecommendedCoordinate(args);
  }
}

module.exports = CoordinatorCalculator;
