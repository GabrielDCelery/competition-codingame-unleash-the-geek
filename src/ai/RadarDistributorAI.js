const { GAME_RADAR_RANGE } = require('../constants');

class RadarDistributorAI {
  constructor({ map }) {
    this.map = map;
    this._createRecommendedCoordinates = this._createRecommendedCoordinates.bind(
      this
    );
    this.getNextRadarDeployCoordinates = this.getNextRadarDeployCoordinates.bind(
      this
    );
    this._createRecommendedCoordinates();
  }

  _createRecommendedCoordinates() {
    const zoneSize = GAME_RADAR_RANGE + 1;
    const numOfZonesX = this.map.getCells().getWidth() / zoneSize;
    const numOfZonesY = this.map.getCells().getHeight() / zoneSize;
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

  _getCoordinateToDropTo({ x, y }) {
    const { HOLE } = this.map.getAmountKeys();

    for (
      let distance = 0, distanceMax = 1;
      distance <= distanceMax;
      distance++
    ) {
      const coordinates = this.map
        .getCells()
        .getDistanceMapper()
        .getCoordinatesAtDistance({ x, y, distance });

      for (let i = 0, iMax = coordinates.length; i < iMax; i++) {
        const [cellX, cellY] = coordinates[i];
        const bHasHole = this.map
          .getCells()
          .has({ x: cellX, y: cellY, what: HOLE });

        if (!bHasHole) {
          return { x: cellX, y: cellY };
        }
      }
    }

    return null;
  }

  _getCoordinateScore({ x, y, robotX, robotY }) {
    const {
      HOLE,
      /*
      ORE,
      ALLIED_ROBOT,
      ENEMY_ROBOT,
      */
      RADAR,
      MINE
    } = this.map.getAmountKeys();
    const zoneCoordinate = this.map.getCells().getZoneCoordinates({ x, y });
    const data = this.map.getDataHeatMap().getData(zoneCoordinate);
    const normalizedDistanceFromHQ = this.map.getCells().getNormalizedDistance({
      startX: x,
      startY: y,
      endX: 0,
      endY: y
    });
    const normalizedDistanceFromDropoff = this.map
      .getCells()
      .getNormalizedDistance({
        startX: x,
        startY: y,
        endX: robotX,
        endY: robotY
      });

    return (
      -0.25 * data[HOLE] +
      -1 * data[RADAR] +
      -0.25 * data[MINE] +
      -0.25 *
        normalizedDistanceFromHQ /*+
      -0.25 * normalizedDistanceFromDropoff*/
    );
  }

  getNextRadarDeployCoordinates({ robotX, robotY }) {
    let nextRadarDeployCoordinate = null;
    let nextRadarDeployCoordinateScore = -Infinity;

    for (
      let i = 0, iMax = this.recommendedRadarCoordinates.length;
      i < iMax;
      i++
    ) {
      const recommendedCoordinate = this.recommendedRadarCoordinates[i];

      const score = this._getCoordinateScore({
        x: recommendedCoordinate['x'],
        y: recommendedCoordinate['y'],
        robotX,
        robotY
      });

      if (nextRadarDeployCoordinateScore < score) {
        nextRadarDeployCoordinate = recommendedCoordinate;
        nextRadarDeployCoordinateScore = score;
      }
      /*
      if (nextRadarDeployCoordinateScore < score) {
        const coordinateToDropTo = this._getCoordinateToDropTo(
          recommendedCoordinate
        );

        if (coordinateToDropTo !== null) {
          nextRadarDeployCoordinate = coordinateToDropTo;
          nextRadarDeployCoordinateScore = score;
        }
      }
      */
    }

    console.warn(nextRadarDeployCoordinate);

    return nextRadarDeployCoordinate;
  }
}

module.exports = RadarDistributorAI;
