const { GAME_RADAR_RANGE } = require('../../../constants');

class RadarDeployer {
  constructor({ map, gameState }) {
    this.map = map;
    this.gameState = gameState;
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);
    this._init();
  }

  _init() {
    const zoneSize = GAME_RADAR_RANGE + 1;
    const numOfZonesX = this.map.width / zoneSize;
    const numOfZonesY = this.map.height / zoneSize;
    this.recommendedRadarCoordinates = [];

    for (let x = 0, xMax = numOfZonesX; x < xMax; x++) {
      for (let y = 0, yMax = numOfZonesY; y < yMax; y++) {
        const left = x * zoneSize;
        const right = (x + 1) * zoneSize;
        const top = y * zoneSize;
        const bottom = (y + 1) * zoneSize;

        this.recommendedRadarCoordinates.push({
          x: Math.floor((left + right) / 2),
          y: Math.floor((top + bottom) / 2)
        });
      }
    }
  }

  getRecommendedCoordinate({ robotX, robotY }) {}
}

module.exports = RadarDeployer;
