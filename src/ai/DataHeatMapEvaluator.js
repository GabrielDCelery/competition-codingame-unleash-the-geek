class DataHeatMapEvaluator {
  constructor({ map, gameState }) {
    this.map = map;
    this.gameState = gameState;
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);
  }

  static get SCORER_METHODS() {
    return {
      SCOUTING: '_scoutingScorer',
      DEPLOY_RADAR: '_deployRadarScorer'
    };
  }

  getScorerMehods() {
    return DataHeatMapEvaluator.SCORER_METHODS;
  }
  /*
  _deployRadarScorer({ data, normalizedDistances }) {
    const { HOLE, ORE, RADAR } = this.map.getAmountKeys();
    return (
      -1 * data[HOLE] +
      -1 * data[ORE] +
      -1 * data[RADAR] +
      -1 * normalizedDistances['robotTarget'] +
      0.5 * normalizedDistances['targetHQ']
    );
  }
  */
  _scoutingScorer({
    data,
    normalizedDistanceStartTarget,
    //normalizedDistanceStartHQ,
    normalizedDistanceTargetHQ,
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
      0.5 * data[RADAR] +
      -1 * data[MINE] +
      -0.25 * normalizedDistanceStartTarget
      //1 * normalizedDistanceTargetHQ
    );
  }

  getRecommendedCoordinate({ startX, startY, maxDistance, scorerMethod }) {
    let suggestionCoordinates = null;
    let suggestionScore = -Infinity;

    const { getNormalizedDistance } = this.map;
    const { getData } = this.map.getHeatMap();
    const { getCoordinatesAtDistance } = this.map.getDistanceMapper();

    for (let distance = 0; distance <= maxDistance; distance++) {
      const coordinatesToCheck = getCoordinatesAtDistance({
        x: startX,
        y: startY,
        distance
      });

      for (let i = 0, iMax = coordinatesToCheck.length; i < iMax; i++) {
        const [coordinateToCheckX, coordinateToCheckY] = coordinatesToCheck[i];
        const normalizedDistanceStartTarget = getNormalizedDistance({
          startX: startX,
          startY: startY,
          endX: coordinateToCheckX,
          endY: coordinateToCheckY
        });
        const normalizedDistanceStartHQ = getNormalizedDistance({
          startX: startX,
          startY: startY,
          endX: 0,
          endY: startY
        });
        const normalizedDistanceTargetHQ = getNormalizedDistance({
          startX: coordinateToCheckX,
          startY: coordinateToCheckY,
          endX: 0,
          endY: coordinateToCheckY
        });

        const data = getData({ x: coordinateToCheckX, y: coordinateToCheckY });
        const score = this[scorerMethod]({
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

module.exports = DataHeatMapEvaluator;
