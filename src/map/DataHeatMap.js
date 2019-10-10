const Data = require('./Data');
const { HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE } = Data.AMOUNTS;

class DataHeatMap {
  constructor({
    width,
    height,
    dataMap,
    dataTracker,
    distanceMapper,
    heatMapDropRate
  }) {
    this.getData = this.getData.bind(this);
    this.reCalculateHeatMap = this.reCalculateHeatMap.bind(this);

    this.width = width;
    this.height = height;
    this.dataMap = dataMap;
    this.dataTracker = dataTracker;
    this.distanceMapper = distanceMapper;
    this.heatMapDropRate = heatMapDropRate || [1];
    this._resetHeatMap();
  }

  _resetHeatMap() {
    this.heatMap = new Array(this.width)
      .fill(null)
      .map(() => new Array(this.height).fill(null));
    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        this.heatMap[x][y] = JSON.parse(
          JSON.stringify(
            new Array(
              [HOLE, ORE, ALLIED_ROBOT, ENEMY_ROBOT, RADAR, MINE].length
            ).fill(0)
          )
        );
      }
    }
  }

  _distributeDecayingGridData({ x, y, what, distanceMax }) {
    const value = this.dataMap.get({ x, y, what });
    const total = this.dataTracker.getTotals().get({ what });
    for (let distance = 0; distance < distanceMax; distance++) {
      const coordinatesAtDistance = this.distanceMapper.getCoordinatesAtDistance(
        { x, y, distance }
      );
      const rate = this.heatMapDropRate[distance];
      const incrementBy = (value / total) * rate;

      for (let i = 0, iMax = coordinatesAtDistance.length; i < iMax; i++) {
        const [heatMapX, heatMapY] = coordinatesAtDistance[i];
        this.heatMap[heatMapX][heatMapY][what] += incrementBy;
      }
    }
  }

  getData({ x, y }) {
    return this.heatMap[x][y];
  }

  reCalculateHeatMap() {
    this._resetHeatMap();
    const whats = [HOLE];
    const distanceMax = Math.min(
      this.width + this.height - 2,
      this.heatMapDropRate.length
    );

    for (let x = 0, xMax = this.width; x < xMax; x++) {
      for (let y = 0, yMax = this.height; y < yMax; y++) {
        for (let i = 0, iMax = whats.length; i < iMax; i++) {
          const what = whats[i];
          if (this.dataMap.has({ x, y, what })) {
            this._distributeDecayingGridData({ x, y, what, distanceMax });
          }
        }
      }
    }

    return this;
  }
}

module.exports = DataHeatMap;
