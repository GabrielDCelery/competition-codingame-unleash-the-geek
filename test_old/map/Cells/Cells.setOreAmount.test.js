const { expect } = require('chai');

describe('Cells.setOreAmount()', () => {
  it('sets the ore amount on a cell', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src_old/map/Cells');
    const instance = new Cells(config);

    // When
    instance.setOreAmount({ x: 0, y: 1, amount: 21 })

    // Then
    expect(instance.data).to.deep.equal([
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 21, 0, 0, false, false, [0, 0]]
      ],
      [
        [false, 0, 0, 0, false, false, [0, 0]],
        [false, 0, 0, 0, false, false, [0, 0]]
      ]
    ]);
  });
});