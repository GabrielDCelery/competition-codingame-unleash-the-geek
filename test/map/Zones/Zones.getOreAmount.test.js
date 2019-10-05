const { expect } = require('chai');

describe('Zones.getOreAmount()', () => {
  it('returns the ore amount in a zone', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src/map/Cells');
    const instance = new Zones(config);
    instance.coordinates[0][1][Zones.DATA.ORE_AMOUNT] = 21

    // When
    const amount = instance.getOreAmount({ x: 0, y: 1 })

    // Then
    expect(amount).to.deep.equal(21);
  });
});