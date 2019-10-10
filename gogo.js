const { Map } = require('./src/map');

const map = new Map({
  mapWidth: 30,
  mapHeight: 15,
  heatMapDropRate: [
    1,
    0.625,
    0.390625,
    0.244140625,
    0.15258789062,
    0.09536743164,
    0.05960464477,
    0.03725290298,
    0.02328306436,
    0.01455191522,
    0.00909494701
  ]
});

map.getHeatMap().reCalculateHeatMap();
