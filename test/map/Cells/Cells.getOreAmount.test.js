const { expect } = require('chai');

describe('Cells.getOreAmount()', () => {
  it('returns the ore amount on a cell', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src/map/Cells');
    const instance = new Cells(config);
    instance.coordinates[0][1][Cells.DATA.ORE_AMOUNT] = 21

    // When
    const amount = instance.getOreAmount({ x: 0, y: 1 })

    // Then
    expect(amount).to.deep.equal(21);
  });
});