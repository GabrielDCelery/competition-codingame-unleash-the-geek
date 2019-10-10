const { expect } = require('chai');

describe('Zones.getHoleAmount()', () => {
  it('returns number of holes in a zone', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src_old/map/Zones');
    const instance = new Zones(config);
    instance.data[0][1][Zones.DATA.HOLE_AMOUNT] = 3

    // When

    const numOfHoles = instance.getHoleAmount({ x: 0, y: 1 });

    // Then
    expect(numOfHoles).to.equal(3);
  });
});