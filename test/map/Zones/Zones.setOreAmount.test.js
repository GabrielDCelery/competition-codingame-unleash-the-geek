const { expect } = require('chai');

describe('Zones.setOreAmount()', () => {
  it('sets the ore amount in a zone', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src/map/Zones');
    const instance = new Zones(config);

    // When
    instance.setOreAmount({ x: 0, y: 1, amount: 21 })

    // Then
    expect(instance.coordinates).to.deep.equal([
      [
        [0, 0, 0],
        [0, 21, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 0]
      ]
    ]);
  });
});