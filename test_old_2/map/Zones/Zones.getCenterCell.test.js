const { expect } = require('chai');

describe('Zones.getCenterCell()', () => {
  it('increments the number of holes in a zone by one', async () => {
    // Given
    const config = { mapWidth: 30, mapHeight: 15, zoneSizeX: 5, zoneSizeY: 5 };
    const Zones = require('../../../src_old/map/Zones');
    const instance = new Zones(config);

    // When
    const result_1 = instance.getCenterCell({ x: 0, y: 0 });
    const result_2 = instance.getCenterCell({ x: 1, y: 0 });
    const result_3 = instance.getCenterCell({ x: 0, y: 1 });

    // Then
    expect(result_1).to.deep.equal({ x: 2, y: 2 });
    expect(result_2).to.deep.equal({ x: 7, y: 2 });
    expect(result_3).to.deep.equal({ x: 2, y: 7 });
  });
});
