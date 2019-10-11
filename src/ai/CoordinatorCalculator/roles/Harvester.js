class Harvester {
  constructor({ map, gameState }) {
    this.map = map;
    this.gameState = gameState;
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);
    this._init();
  }

  _init() {}

  getRecommendedCoordinate() {}
}

module.exports = Harvester;
