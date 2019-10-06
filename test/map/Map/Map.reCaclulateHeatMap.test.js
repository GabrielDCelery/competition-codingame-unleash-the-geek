const { expect } = require('chai');

describe('Map.reCaclulateHeatMap()', () => {
  it('generates a new heatmap', async () => {
    // Given
    // const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const configs = require('../../../src/configs')
    const Map = require('../../../src/map/Map');
    const instance = new Map(configs.map);

    // When

    //instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE });
    instance.processOreInput({ x: 0, y: 0, amount: 100 });
    instance.reCaclulateHeatMap();
    // Then
    expect(instance.dataHeatMap.data).to.deep.equal([
      [
        [0, 1, 0, 0, 0, 0],
        [0, 0.625, 0, 0, 0, 0],
        [0, 0.390625, 0, 0, 0, 0],
        [0, 0.244140625, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0.625, 0, 0, 0, 0],
        [0, 0.390625, 0, 0, 0, 0],
        [0, 0.244140625, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0.390625, 0, 0, 0, 0],
        [0, 0.244140625, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0.244140625, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ]);
  });

  it('updates heatmap less than 10ms', async () =>{
    // Given
    const {
      READLINE_CELL_HAS_HOLE,
      READLINE_ENTITY_ALLIED_ROBOT,
      READLINE_ENTITY_ENEMY_ROBOT,
      READLINE_ENTITY_RADAR,
      READLINE_ENTITY_MINE
    } = require('../../../src/constants')
    const configs = require('../../../src/configs')
    const Map = require('../../../src/map/Map');
    const instance = new Map(configs.map);

    // When

    for (let x = 0, xMax = instance.cells.width; x < xMax; x++) {
      for (let y = 0, yMax = instance.cells.height; y < yMax; y++) {
        instance.processOreInput({ x, y, amount: 10 });
        instance.processHoleInput({ x, y, hole: READLINE_CELL_HAS_HOLE });
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_ALLIED_ROBOT })
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_ENEMY_ROBOT })
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_RADAR })
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_MINE })
      }
    }

    instance.resetEntities()

    for (let x = 0, xMax = instance.cells.width; x < xMax; x++) {
      for (let y = 0, yMax = instance.cells.height; y < yMax; y++) {
        instance.processOreInput({ x, y, amount: 10 });
        instance.processHoleInput({ x, y, hole: READLINE_CELL_HAS_HOLE });
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_ALLIED_ROBOT })
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_ENEMY_ROBOT })
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_RADAR })
        instance.processEntityInput({ x, y, type: READLINE_ENTITY_MINE })
      }
    }
    
    const start = new Date().getTime();

    instance.reCaclulateHeatMap();

    const end = new Date().getTime();

    // Then
    expect(end - start).to.be.below(10);
  });
});