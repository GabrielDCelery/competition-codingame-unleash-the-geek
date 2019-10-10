const { expect } = require('chai');

describe('GridDistanceMapper.getCoordinatesAtDistance()', () => {
  it('returns the coordinates of a grid at a distance', async () => {
    // Given
    const config = { width: 3, height: 3 };
    const GridDistanceMapper = require('../../../src_old/map/GridDistanceMapper');
    const instance = new GridDistanceMapper(config);

    // When
    instance.mapDistances();
    const result = instance.getCoordinatesAtDistance({
      x: 0,
      y: 0,
      distance: 2
    });

    // Then
    expect(result).to.deep.equal([[0, 2], [1, 1], [2, 0]]);
  });
});
