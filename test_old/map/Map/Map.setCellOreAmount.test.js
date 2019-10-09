const { expect } = require('chai');

describe('Map.setCellOreAmount()', () => {
  it('sets the ore amount on a cell', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellOreAmount({ x: 1, y: 2, amount: 21 });

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
        [false, 21, 0, 0, false, false, [0, 1]],
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
      [[0, 0, 0, 0, 0, 0], [0, 21, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
    ]);
  });

  it('sets the ore amount on a cell if it already has ore on it', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellOreAmount({ x: 1, y: 2, amount: 21 });
    instance.setCellOreAmount({ x: 1, y: 2, amount: 30 });

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
        [false, 30, 0, 0, false, false, [0, 1]],
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
      [[0, 0, 0, 0, 0, 0], [0, 30, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
    ]);
  });

  it('sets the zones to have the appropriate amount of ore', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellOreAmount({ x: 1, y: 2, amount: 21 });
    instance.setCellOreAmount({ x: 1, y: 2, amount: 30 });
    instance.setCellOreAmount({ x: 1, y: 3, amount: 5 });
    instance.setCellOreAmount({ x: 0, y: 2, amount: 15 });

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 15, 0, 0, false, false, [0, 1]],
        [false, 0, 0, 0, false, false, [0, 1]]
      ],
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 30, 0, 0, false, false, [0, 1]],
        [false, 5, 0, 0, false, false, [0, 1]]
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
      [[0, 0, 0, 0, 0, 0], [0, 50, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
    ]);
  });

  it('does not set the ore amount on a cell if the amount is unknown', async () => {
    // Given
    const { ENTITY_ORE_UNKNOWN_AMOUNT } = require('../../../src/constants');
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.setCellOreAmount({
      x: 1,
      y: 2,
      amount: ENTITY_ORE_UNKNOWN_AMOUNT
    });

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
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
    ]);
  });
});
