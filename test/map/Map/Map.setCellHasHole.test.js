const { expect } = require('chai');

describe('Map.setCellHasHole()', () => {
  it('sets a cell and the cell\'s zone to have a hole', async () => {
    // Given
    const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [true, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ])
  });

  it('sets the zone to have the appropriate number of holes', async () => {
    // Given
    const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })
    instance.setCellHasHole({ x: 1, y: 3, hole: READLINE_CELL_HAS_HOLE })
    instance.setCellHasHole({ x: 0, y: 2, hole: READLINE_CELL_HAS_HOLE })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [true, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [true, 0, 0, 0, false, false, [0, 1]],
        [true, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        [0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ])
  });

  it('only sets a cell once even if it is called multiple times', async () => {
    // Given
    const { READLINE_CELL_HAS_HOLE } = require('../../../src/constants')
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })
    instance.setCellHasHole({ x: 1, y: 2, hole: READLINE_CELL_HAS_HOLE })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [true, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ])
  });

  it('does not set a cell to have a hole if the input is invalid', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellHasHole({ x: 1, y: 2, hole: 'foo' })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 0]],
        [false, 0, 0, 0, false, false, [1, 1]],
        [false, 0, 0, 0, false, false, [1, 1]]
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ])
  });
});