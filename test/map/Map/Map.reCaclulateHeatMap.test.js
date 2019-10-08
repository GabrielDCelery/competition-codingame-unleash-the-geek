const { expect } = require('chai');

describe('Map.getDataHeatMap().reCalculateHeatMap()', () => {
  it('generates a new heatmap', async () => {
    // Given
    // const { ITEM_HOLE } = require('../../../src/constants')
    const configs = require('../../../src/configs');
    const Map = require('../../../src/map/Map');
    const instance = new Map(configs.map);

    // When

    //instance.processHoleInput({ x: 0, y: 0, hole: ITEM_HOLE });
    instance.processOreInput({ x: 0, y: 0, amount: 100 });
    instance.getDataHeatMap().reCalculateHeatMap();

    // Then
    expect(instance.getDataHeatMap().data).to.deep.equal([
      [[0, 1, 0, 0, 0, 0], [0, 0.625, 0, 0, 0, 0], [0, 0.390625, 0, 0, 0, 0]],
      [
        [0, 0.625, 0, 0, 0, 0],
        [0, 0.390625, 0, 0, 0, 0],
        [0, 0.244140625, 0, 0, 0, 0]
      ],
      [
        [0, 0.390625, 0, 0, 0, 0],
        [0, 0.244140625, 0, 0, 0, 0],
        [0, 0.15258789062, 0, 0, 0, 0]
      ],
      [
        [0, 0.244140625, 0, 0, 0, 0],
        [0, 0.15258789062, 0, 0, 0, 0],
        [0, 0.09536743164, 0, 0, 0, 0]
      ],
      [
        [0, 0.15258789062, 0, 0, 0, 0],
        [0, 0.09536743164, 0, 0, 0, 0],
        [0, 0.05960464477, 0, 0, 0, 0]
      ],
      [
        [0, 0.09536743164, 0, 0, 0, 0],
        [0, 0.05960464477, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ]);
  });

  it('updates heatmap less than 5ms', async () => {
    // Given
    const {
      ITEM_HOLE,
      ENTITY_ALLIED_ROBOT,
      ENTITY_ENEMY_ROBOT,
      ENTITY_RADAR,
      ENTITY_MINE
    } = require('../../../src/constants');
    const configs = require('../../../src/configs');
    const Map = require('../../../src/map/Map');
    const instance = new Map(configs.map);

    // When

    for (let x = 0, xMax = instance.cells.width; x < xMax; x++) {
      for (let y = 0, yMax = instance.cells.height; y < yMax; y++) {
        instance.processOreInput({ x, y, amount: 10 });
        instance.processHoleInput({ x, y, hole: ITEM_HOLE });
        instance.processEntityInput({
          x,
          y,
          type: ENTITY_ALLIED_ROBOT
        });
        instance.processEntityInput({
          x,
          y,
          type: ENTITY_ENEMY_ROBOT
        });
        instance.processEntityInput({ x, y, type: ENTITY_RADAR });
        instance.processEntityInput({ x, y, type: ENTITY_MINE });
      }
    }

    instance.resetEntities();

    for (let x = 0, xMax = instance.cells.width; x < xMax; x++) {
      for (let y = 0, yMax = instance.cells.height; y < yMax; y++) {
        instance.processOreInput({ x, y, amount: 10 });
        instance.processHoleInput({ x, y, hole: ITEM_HOLE });
        instance.processEntityInput({
          x,
          y,
          type: ENTITY_ALLIED_ROBOT
        });
        instance.processEntityInput({
          x,
          y,
          type: ENTITY_ENEMY_ROBOT
        });
        instance.processEntityInput({ x, y, type: ENTITY_RADAR });
        instance.processEntityInput({ x, y, type: ENTITY_MINE });
      }
    }

    const start = new Date().getTime();

    instance.getDataHeatMap().reCalculateHeatMap();

    const end = new Date().getTime();

    // Then
    expect(end - start).to.be.below(5);
  });
});
