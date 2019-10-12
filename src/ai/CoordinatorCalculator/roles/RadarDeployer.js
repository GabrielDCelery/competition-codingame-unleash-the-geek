const { GAME_RADAR_RANGE } = require('../../../constants');

class RadarDeployer {
  constructor({ map, gameState, playerMemory }) {
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);
    this.map = map;
    this.gameState = gameState;
    this.playerMemory = playerMemory;
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
          x: Math.floor((left + right) / 2) + 2,
          y: Math.floor((top + bottom) / 2)
        });
      }
    }
  }

  _scoreData({
    data,
    normalizedDistanceStartTarget,
    normalizedDistanceTargetHQ
  }) {
    const { HOLE, MINE } = this.map.getDataTracker().getAmounts();

    return (
      1 -
      data[HOLE] +
      1 -
      data[MINE] +
      (1 - normalizedDistanceStartTarget) +
      (1 - normalizedDistanceTargetHQ)
    );
  }

  _hasRadarAtLocation({ x, y }) {
    const { getCoordinatesAtDistance } = this.map.getDistanceMapper();
    const { RADAR } = this.map.getDataTracker().getAmounts();
    const { has } = this.map.getDataTracker();

    for (let distance = 0; distance <= 1; distance++) {
      const coordinatesToCheck = getCoordinatesAtDistance({ x, y, distance });

      for (let i = 0, iMax = coordinatesToCheck.length; i < iMax; i++) {
        const [coordinateToCheckX, coordinateToCheckY] = coordinatesToCheck[i];

        if (
          has({ x: coordinateToCheckX, y: coordinateToCheckY, what: RADAR })
        ) {
          return true;
        }
      }
    }
    return false;
  }

  _getDeployCoordinate({ x, y }) {
    const { getCoordinatesAtDistance } = this.map.getDistanceMapper();
    const { MINE } = this.map.getDataTracker().getAmounts();
    const { has } = this.map.getDataTracker();

    for (let distance = 0; distance <= 1; distance++) {
      const coordinatesToCheck = getCoordinatesAtDistance({ x, y, distance });

      for (let i = 0, iMax = coordinatesToCheck.length; i < iMax; i++) {
        const [coordinateToCheckX, coordinateToCheckY] = coordinatesToCheck[i];

        if (
          !has({ x: coordinateToCheckX, y: coordinateToCheckY, what: MINE })
        ) {
          return {
            x: coordinateToCheckX,
            y: coordinateToCheckY
          };
        }
      }
    }

    return null;
  }

  getRecommendedCoordinate({ robotX, robotY }) {
    let suggestionCoordinates = null;
    let suggestionScore = -Infinity;

    const { getData } = this.map.getHeatMap();
    const { getNormalizedDistance } = this.map;
    const { isRiskyCoordinate } = this.playerMemory;

    for (
      let i = 0, iMax = this.recommendedRadarCoordinates.length;
      i < iMax;
      i++
    ) {
      const recommendedRadarCoordinate = this.recommendedRadarCoordinates[i];

      if (
        !isRiskyCoordinate(recommendedRadarCoordinate) &&
        !this._hasRadarAtLocation(recommendedRadarCoordinate)
      ) {
        const coordinateToCheckX = recommendedRadarCoordinate.x;
        const coordinateToCheckY = recommendedRadarCoordinate.y;
        const normalizedDistanceStartTarget = getNormalizedDistance({
          startX: robotX,
          startY: robotY,
          endX: coordinateToCheckX,
          endY: coordinateToCheckY
        });
        const normalizedDistanceTargetHQ = getNormalizedDistance({
          startX: coordinateToCheckX,
          startY: coordinateToCheckY,
          endX: 0,
          endY: coordinateToCheckY
        });

        const data = getData({ x: coordinateToCheckX, y: coordinateToCheckY });
        const score = this._scoreData({
          data,
          normalizedDistanceStartTarget,
          normalizedDistanceTargetHQ
        });

        if (
          suggestionScore < score &&
          !this.gameState.isCoordinateTaken({
            x: coordinateToCheckX,
            y: coordinateToCheckY
          })
        ) {
          suggestionScore = score;
          suggestionCoordinates = this._getDeployCoordinate({
            x: coordinateToCheckX,
            y: coordinateToCheckY
          });
        }
      }
    }

    return suggestionCoordinates;
  }
}

module.exports = RadarDeployer;
