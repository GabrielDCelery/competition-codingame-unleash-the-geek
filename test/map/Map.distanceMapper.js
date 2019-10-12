const { expect } = require('chai');

describe('Cells.constructor()', () => {
  it('initialises an instance', async () => {
    // Given
    const configs = require('../../src/configs');
    const { Map } = require('../../src/map');

    // When
    const result = new Map(configs);

    // Then

    expect(result.distanceMapper.width).to.equal(30);
    expect(result.distanceMapper.height).to.equal(15);
    expect(result.distanceMapper.boundaries).to.deep.equal({
      left: 0,
      top: 0,
      right: 29,
      bottom: 14
    });
    expect(result.distanceMapper.data.length).to.equal(30);
  });
});
