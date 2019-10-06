const { expect } = require('chai');

describe('Data.constructor()', () => {
  it('creates a new Data object', async () => {
    // Given
    const Data = require('../../../src/map/Data');

    // When
    const result = new Data();

    // Then
    expect(result.values).to.deep.equal([0, 0, 0, 0, 0, 0])
  });
});