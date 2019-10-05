const { expect } = require('chai');

describe('Zones.constructor()', () => {
  it('initialises an instance', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src/map/Zones');

    // When
    const result = new Zones(config);

    // Then
    expect(result.width).to.equal(2)
    expect(result.height).to.equal(2)
    expect(result.coordinates).to.deep.equal([
      [
        [0, 0, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 0]
      ]
    ]);
  });
});