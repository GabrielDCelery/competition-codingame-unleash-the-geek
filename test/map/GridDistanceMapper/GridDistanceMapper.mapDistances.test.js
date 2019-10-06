const { expect } = require('chai');

describe('GridDistanceMapper.mapDistances()', () => {
  it('returns a map of cell coordinates at specific distances from cells', async () => {
    // Given
    const config = { width: 2, height: 2 };
    const GridDistanceMapper = require('../../../src/map/GridDistanceMapper');
    const instance = new GridDistanceMapper(config);

    // When
    instance.mapDistances()

    // Then
    expect(instance.data).to.deep.equal([
      [
        [
          [
            [0, 0]
          ],
          [
            [0, 1],
            [1, 0]
          ]
        ],
        [
          [
            [0, 1]
          ],
          [
            [0, 0],
            [1, 1]
          ]
        ]
      ],
      [
        [
          [
            [1, 0]
          ],
          [
            [0, 0],
            [1, 1]
          ]
        ],
        [
          [
            [1, 1]
          ],
          [
            [0, 1],
            [1, 0]
          ]
        ]
      ]
    ]);
  });
});