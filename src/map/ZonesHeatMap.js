class ZonesHeatMap {
  constructor({ zones }) {
    this._init({ zones })
  }

  _init({ zones }) {
    this.zones = zones;
  }
}

module.exports = ZonesHeatMap;