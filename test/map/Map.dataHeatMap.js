const { expect } = require('chai');

describe('Cells.constructor()', () => {
  it('initialises an instance', async () => {
    // Given
    const configs = require('../../src/configs');
    const { READLINE_CELL_HAS_HOLE } = require('../../src/constants');
    const { Map } = require('../../src/map');

    // When
    const map = new Map(configs);

    map.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE });
    map.getHeatMap().reCalculateHeatMap();

    //console.log(JSON.stringify(map.getHeatMap().heatMap));

    // Then
  });
});
