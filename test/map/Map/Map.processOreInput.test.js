const { expect } = require('chai');

describe('Map.processOreInput()', () => {
  it('sets the total, cell and zone ore amount', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processOreInput({ x: 0, y: 1, amount: 21 });

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 21, 0, 0, 0, 0]
        }
      ],
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        {
          values: [0, 21, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.totals).to.deep.equal({
      values: [0, 21, 0, 0, 0, 0]
    });
  });

  it('sets the ore amount on a cell if it already has ore on it', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processOreInput({ x: 0, y: 1, amount: 21 });
    instance.processOreInput({ x: 0, y: 1, amount: 30 });

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 30, 0, 0, 0, 0]
        }
      ],
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        {
          values: [0, 30, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.totals).to.deep.equal({
      values: [0, 30, 0, 0, 0, 0]
    });
  });

  it('sets the zones to have the appropriate amount of ore', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processOreInput({ x: 0, y: 1, amount: 21 });
    instance.processOreInput({ x: 0, y: 1, amount: 30 });
    instance.processOreInput({ x: 0, y: 0, amount: 5 });
    instance.processOreInput({ x: 1, y: 1, amount: 15 });

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        {
          values: [0, 5, 0, 0, 0, 0]
        },
        {
          values: [0, 30, 0, 0, 0, 0]
        }
      ],
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 15, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        {
          values: [0, 50, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.totals).to.deep.equal({
      values: [0, 50, 0, 0, 0, 0]
    });
  });

  it('does not set the ore amount on a cell if the amount is unknown', async () => {
    // Given
    const { READLINE_ORE_AMOUNT_UNKNOWN } = require('../../../src/constants');
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processOreInput({
      x: 0,
      y: 1,
      amount: READLINE_ORE_AMOUNT_UNKNOWN
    });

    // Then
    expect(instance.cells.data).to.deep.equal([
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        }
      ],
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(instance.totals).to.deep.equal({
      values: [0, 0, 0, 0, 0, 0]
    });
  });
});
