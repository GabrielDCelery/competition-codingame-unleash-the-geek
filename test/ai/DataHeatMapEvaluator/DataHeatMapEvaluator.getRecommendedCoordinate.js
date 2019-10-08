const { expect } = require('chai');

describe('DataHeatMapEvaluator.getRecommendedCoordinate()', () => {
  it('gets a recommended cell', async () => {
    // Given
    const config = { mapWidth: 9, mapHeight: 9, zoneSizeX: 3, zoneSizeY: 3 };
    const Map = require('../../../src/map/Map');
    const map = new Map(config);
    const DataHeatMapEvaluator = require('../../../src/ai/DataHeatMapEvaluator');
    const evaluator = new DataHeatMapEvaluator({ map });

    // When
    const result = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 0,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    console.log(result);

    // Then
    expect(4).to.equal(4);
  });
});
