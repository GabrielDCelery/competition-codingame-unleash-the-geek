const { Harvester, RadarDeployer, Wanderer } = require('./roles');

class CoordinatorCalculator {
  constructor({ map, gameState }) {
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);

    this.roles = {
      harvester: new Harvester({ map, gameState }),
      radarDeployer: new RadarDeployer({ map, gameState }),
      wanderer: new Wanderer({ map, gameState })
    };
  }

  getRecommendedCoordinate(role, args) {
    return this.roles[role].getRecommendedCoordinate(args);
  }
}

module.exports = CoordinatorCalculator;
