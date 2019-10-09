class DataHeatMapEvaluator {
  constructor({ map }) {
    this.map = map;
    this.getRecommendedCoordinate = this.getRecommendedCoordinate.bind(this);
  }

  static get SCORER_METHODS() {
    return {
      MOVE_TO_BETTER_POSITION: '_moveToBetterPositionScorer',
      DEPLOY_RADAR: '_deployRadarScorer'
    };
  }

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

  _moveToBetterPositionScorer({ data, normalizedDistances }) {
    const {
      HOLE,
      ORE,
      ALLIED_ROBOT,
      ENEMY_ROBOT,
      RADAR,
      MINE
    } = this.map.getAmountKeys();

    return (
      -0.5 * data[HOLE] +
      2 * data[ORE] +
      -0.5 * data[ALLIED_ROBOT] +
      -0.5 * data[ENEMY_ROBOT] +
      0.5 * data[RADAR] +
      -1 * data[MINE] +
      -0.2 * normalizedDistances['robotTarget'] +
      0.2 * normalizedDistances['targetHQ']
    );
  }

  getRecommendedCoordinate({
    robotCellX,
    robotCellY,
    maxZoneDistance,
    scorerMethod
  }) {
    let suggestionCoordinates = null;
    let suggestionScore = -Infinity;

    const robotCurrentZone = this.map
      .getCells()
      .getZoneCoordinates({ x: robotCellX, y: robotCellY });

    for (
      let zoneDistance = 0;
      zoneDistance <= maxZoneDistance;
      zoneDistance++
    ) {
      const zoneCoordinatesToCheck = this.map
        .getZones()
        .getDistanceMapper()
        .getCoordinatesAtDistance({
          ...robotCurrentZone,
          distance: zoneDistance
        });

      for (let i = 0, iMax = zoneCoordinatesToCheck.length; i < iMax; i++) {
        const [zoneToCheckX, zoneToCheckY] = zoneCoordinatesToCheck[i];
        const zoneToCheckCenterCoordinates = this.map
          .getZones()
          .getCenterCell({ x: zoneToCheckX, y: zoneToCheckY });
        const normalizedRobotTargetDistance = this.map
          .getCells()
          .getNormalizedDistance({
            startX: robotCellX,
            startY: robotCellY,
            endX: zoneToCheckCenterCoordinates['x'],
            endY: zoneToCheckCenterCoordinates['y']
          });
        const normalizedRobotHqDistance = this.map
          .getCells()
          .getNormalizedDistance({
            startX: robotCellX,
            startY: robotCellY,
            endX: 0,
            endY: robotCellY
          });
        const normalizedTargetHqDistance = this.map
          .getCells()
          .getNormalizedDistance({
            startX: zoneToCheckCenterCoordinates['x'],
            startY: zoneToCheckCenterCoordinates['y'],
            endX: 0,
            endY: zoneToCheckCenterCoordinates['y']
          });

        const data = this.map
          .getDataHeatMap()
          .getData({ x: zoneToCheckX, y: zoneToCheckY });
        const score = this[scorerMethod]({
          data,
          normalizedDistances: {
            robotTarget: normalizedRobotTargetDistance,
            robotHQ: normalizedRobotHqDistance,
            targetHQ: normalizedTargetHqDistance
          }
        });

        if (suggestionScore <= score) {
          suggestionScore = score;
          suggestionCoordinates = zoneToCheckCenterCoordinates;
        }
      }
    }

    return suggestionCoordinates;
  }
}

module.exports = DataHeatMapEvaluator;
