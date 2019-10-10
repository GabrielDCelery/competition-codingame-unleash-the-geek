const { expect } = require('chai');

describe('Zones.reset()', () => {
  it('resets entities in every zone', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src_old/map/Zones');
    const instance = new Zones(config);

    // When
    instance.reset();

    // Then
    expect(instance.data).to.deep.equal([
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
    ]);
  });
});
