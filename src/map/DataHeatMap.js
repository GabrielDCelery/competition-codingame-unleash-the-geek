const Data = require('./Data')
const GridDistanceMapper = require('./GridDistanceMapper')

class DataHeatMap {
  constructor({ totals, zones, heatMapDropRate }) {
    this.heatMapDropRate = heatMapDropRate || [1];
    this.totals = totals;
    this.zones = zones;
    this.zonesDistanceMapper = new GridDistanceMapper({ width: this.zones.width, height: this.zones.height });
    this.zonesDistanceMapper.mapDistances()
    this._resetHeatMap();
  }

  _resetHeatMap() {
    this.data = new Array(this.zones.width)
      .fill(null)
      .map(() => new Array(this.zones.height).fill(null));
    for (let x = 0, xMax = this.zones.width; x < xMax; x++) {
      for (let y = 0, yMax = this.zones.height; y < yMax; y++) {
        this.data[x][y] = JSON.parse(JSON.stringify(new Array(Object.keys(Data.AMOUNTS).length).fill(0)))
      }
    }
  }

  _distributeDecayingGridData({ x, y, what, distanceMax }) {
    const value = this.zones.get({ x, y, what });
    const total = this.totals.get({ what });

    for (let distance = 0; distance < distanceMax; distance++) {
      const coordinatesAtDistance = this.zonesDistanceMapper.getCoordinatesAtDistance({ x, y, distance });
      const rate = this.heatMapDropRate[distance];
      const incrementBy = value / total * rate;

      for (let i = 0, iMax = coordinatesAtDistance.length; i < iMax; i++) {
        const [heatMapX, heatMapY] = coordinatesAtDistance[i];
        this.data[heatMapX][heatMapY][what] += incrementBy;
      }
    }
  }

  reCaclulateHeatMap() {
    this._resetHeatMap();
    const whats = Object.values(Data.AMOUNTS);
    const distanceMax = Math.min(this.zonesDistanceMapper.getMaxDistance(), this.heatMapDropRate.length);

    for (let x = 0, xMax = this.zones.width; x < xMax; x++) {
      for (let y = 0, yMax = this.zones.height; y < yMax; y++) {
        for (let i = 0, iMax = whats.length; i < iMax; i++) {
          const what = whats[i];
          if (this.zones.has({ x, y, what })) {
            this._distributeDecayingGridData({ x, y, what, distanceMax });
          }
        }
      }
    }
  }
}

module.exports = DataHeatMap;