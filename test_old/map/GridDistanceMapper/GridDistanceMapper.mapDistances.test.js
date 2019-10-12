const { expect } = require('chai');

describe('GridDistanceMapper.mapDistances()', () => {
  it('returns a map of cell coordinates at specific distances from cells', async () => {
    // Given
    const config = { width: 2, height: 2 };
    const GridDistanceMapper = require('../../../src_old/map/GridDistanceMapper');
    const instance = new GridDistanceMapper(config);

    // When
    const result = instance.mapDistances()

    // Then
    expect(result).to.deep.equal([
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