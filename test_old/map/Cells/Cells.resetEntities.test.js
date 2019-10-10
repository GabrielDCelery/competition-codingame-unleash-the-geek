const { expect } = require('chai');

describe('Cells.reset()', () => {
  it('resets entities on every cell', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src_old/map/Cells');
    const instance = new Cells(config);

    // When
    instance.reset();

    // Then
    expect(instance.data).to.deep.equal([
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
