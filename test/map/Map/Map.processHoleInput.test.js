const { expect } = require('chai');

describe('Map.processHoleInput()', () => {
  it('increases the total, cell and zone hole amount by one', async () => {
    // Given
    const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processHoleInput({ x: 0, y: 1, hole: READLINE_CELL_HAS_HOLE })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [1, 0, 0, 0, 0, 0]
      }],
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [1, 0, 0, 0, 0, 0]
      }]
    ])
    expect(instance.totals).to.deep.equal({
      "values": [1, 0, 0, 0, 0, 0]
    })
  });

  it('sets the zone to have the appropriate number of holes', async () => {
    // Given
    const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE })
    instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE })
    instance.processHoleInput({ x: 0, y: 1, hole: READLINE_CELL_HAS_HOLE })
    instance.processHoleInput({ x: 1, y: 1, hole: READLINE_CELL_HAS_HOLE })


    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [1, 0, 0, 0, 0, 0]
      }, {
        "values": [1, 0, 0, 0, 0, 0]
      }],
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [1, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [3, 0, 0, 0, 0, 0]
      }]
    ])
  });

  it('only sets a cell once even if it is called multiple times', async () => {
    // Given
    const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE })
    instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE })
    instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE })
    instance.processHoleInput({ x: 0, y: 0, hole: READLINE_CELL_HAS_HOLE })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [1, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }],
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [1, 0, 0, 0, 0, 0]
      }]
    ])
  });


  it('does not set a cell to have a hole if the input is invalid', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processHoleInput({ x: 0, y: 0, hole: 'foo' })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }],
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ])
  });
});