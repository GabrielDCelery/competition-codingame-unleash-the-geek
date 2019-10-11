class Scout {
  constructor({ map, gameState }) {
    this.map = map;
    this.gameState = gameState;
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);
  }

  _scoreData({
    data,
    normalizedDistanceStartTarget,
    //normalizedDistanceStartHQ,
    //normalizedDistanceTargetHQ,
    coordinateToCheckX
  }) {
    if (coordinateToCheckX === 0) {
      return -Infinity;
    }

    const {
      HOLE,
      ORE,
      ALLIED_ROBOT,
      ENEMY_ROBOT,
      RADAR,
      MINE
    } = this.map.getDataTracker().getAmounts();

    return (
      -1 * data[HOLE] +
      10 * data[ORE] +
      -1 * data[ALLIED_ROBOT] +
      -0.25 * data[ENEMY_ROBOT] +
      -0.5 * data[RADAR] +
      -1 * data[MINE] +
      -0.25 * normalizedDistanceStartTarget
      //1 * normalizedDistanceTargetHQ
    );
  }

  getRecommendedCoordinate({ robotX, robotY, maxDistance }) {
    let suggestionCoordinates = null;
    let suggestionScore = -Infinity;

    const { getNormalizedDistance } = this.map;
    const { getData } = this.map.getHeatMap();
    const { getCoordinatesAtDistance } = this.map.getDistanceMapper();

    for (let distance = 0; distance <= maxDistance; distance++) {
      const coordinatesToCheck = getCoordinatesAtDistance({
        x: robotX,
        y: robotY,
        distance
      });

      for (let i = 0, iMax = coordinatesToCheck.length; i < iMax; i++) {
        const [coordinateToCheckX, coordinateToCheckY] = coordinatesToCheck[i];
        const normalizedDistanceStartTarget = getNormalizedDistance({
          startX: robotX,
          startY: robotY,
          endX: coordinateToCheckX,
          endY: coordinateToCheckY
        });
        const normalizedDistanceStartHQ = getNormalizedDistance({
          startX: robotX,
          startY: robotY,
          endX: 0,
          endY: robotY
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
          normalizedDistanceStartHQ,
          normalizedDistanceTargetHQ,
          coordinateToCheckX,
          coordinateToCheckY
        });

        if (
          suggestionScore < score &&
          !this.gameState.isCoordinateTaken({
            x: coordinateToCheckX,
            y: coordinateToCheckY
          })
        ) {
          suggestionScore = score;
          suggestionCoordinates = {
            x: coordinateToCheckX,
            y: coordinateToCheckY
          };
        }
      }
    }

    return suggestionCoordinates;
  }
}

module.exports = Scout;
