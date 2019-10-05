const { expect } = require('chai');

describe('Cells.hasHole()', () => {
  it('returns a boolean whether the cell has a hole or not', async () => {
    // Given
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src/map/Cells');
    const instance = new Cells(config);
    instance.coordinates[0][1][Cells.DATA.HAS_HOLE] = true

    // When

    const bHashole = instance.hasHole({ x: 0, y: 1 });

    // Then
    expect(bHashole).to.deep.equal(true);
  });
});