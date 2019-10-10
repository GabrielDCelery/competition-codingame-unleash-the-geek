const { expect } = require('chai');

describe('Cells.constructor()', () => {
  it('initialises an instance', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src_old/map/Cells');

    // When
    const result = new Cells(config);

    // Then
    expect(result.width).to.equal(4);
    expect(result.height).to.equal(4);
    expect(result.data).to.deep.equal([
      [
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        },
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
        },
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
        },
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
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        },
        {
          values: [0, 0, 0, 0, 0, 0]
        }
      ]
    ]);
    expect(result.zones).to.deep.equal([
      [[0, 0], [0, 0], [0, 1], [0, 1]],
      [[0, 0], [0, 0], [0, 1], [0, 1]],
      [[1, 0], [1, 0], [1, 1], [1, 1]],
      [[1, 0], [1, 0], [1, 1], [1, 1]]
    ]);
  });
});
