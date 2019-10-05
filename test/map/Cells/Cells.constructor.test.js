const { expect } = require('chai');

describe('Cells.constructor()', () => {
  it('initialises an instance', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src/map/Cells');

    // When
    const result = new Cells(config);

    // Then
    expect(result.coordinates).to.deep.equal([
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
  });
});