class DataHeatMapEvaluator {
  constructor({ map }) {
    this.map = map;
    this._moveToBetterPositionScorer = this._moveToBetterPositionScorer.bind(
      this
    );
  }

  static get SCORER_METHODS() {
    return {
      MOVE_TO_BETTER_POSITION: '_moveToBetterPositionScorer'
    };
  }

  _moveToBetterPositionScorer({ data, normalizedDistance }) {
    const {
      HOLE,
      ORE,
      ALLIED_ROBOT,
      ENEMY_ROBOT,
      RADAR,
      MINE
    } = this.map.getAmountKeys();

    return (
      -1 * data[HOLE] +
      1 * data[ORE] +
      1 * data[ALLIED_ROBOT] +
      -1 * data[ENEMY_ROBOT] +
      1 * data[RADAR] +
      -1 * data[MINE] +
      -1 * normalizedDistance
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
        const normalizedDistance = this.map.getCells().getNormalizedDistance({
          startX: robotCellX,
          startY: robotCellY,
          endX: zoneToCheckCenterCoordinates['x'],
          endY: zoneToCheckCenterCoordinates['y']
        });

        const data = this.map
          .getDataHeatMap()
          .getData({ x: zoneToCheckX, y: zoneToCheckY });
        const score = this[scorerMethod]({ data, normalizedDistance });

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
