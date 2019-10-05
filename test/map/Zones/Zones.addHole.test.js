const { expect } = require('chai');

describe('Zones.addHole()', () => {
  it('increments the number of holes in a zone by one', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src/map/Zones');
    const instance = new Zones(config);

    // When
    instance.addHole({ x: 0, y: 1 })
    
    // Then
    expect(instance.coordinates).to.deep.equal([
      [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ]);
  });

  it('increments the number of holes in a zone if called multiple times', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Zones = require('../../../src/map/Zones');
    const instance = new Zones(config);

    // When
    instance.addHole({ x: 0, y: 1 })
    instance.addHole({ x: 0, y: 1 })
    instance.addHole({ x: 0, y: 1 })

    // Then
    expect(instance.coordinates).to.deep.equal([
      [
        [0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    ]);
  });
});