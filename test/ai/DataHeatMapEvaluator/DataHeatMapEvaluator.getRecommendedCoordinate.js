const { expect } = require('chai');

describe('DataHeatMapEvaluator.getRecommendedCoordinate()', () => {
  it('gets a recommended cell for a single robot', async () => {
    // Given
    const config = { mapWidth: 9, mapHeight: 9, zoneSizeX: 3, zoneSizeY: 3 };
    const Map = require('../../../src/map/Map');
    const map = new Map(config);
    map.getDataHeatMap().reCalculateHeatMap();
    const DataHeatMapEvaluator = require('../../../src/ai/DataHeatMapEvaluator');
    const evaluator = new DataHeatMapEvaluator({ map });

    // When
    const result = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 0,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    // Then
    expect(result).to.deep.equal({ x: 1, y: 1 });
  });

  it('gets a recommended cell for a single robot', async () => {
    // Given
    const config = { mapWidth: 9, mapHeight: 9, zoneSizeX: 3, zoneSizeY: 3 };
    const Map = require('../../../src/map/Map');
    const map = new Map(config);
    map.processOreInput({ x: 8, y: 0, amount: 100 });
    map.getDataHeatMap().reCalculateHeatMap();
    const DataHeatMapEvaluator = require('../../../src/ai/DataHeatMapEvaluator');
    const evaluator = new DataHeatMapEvaluator({ map });

    // When
    const result = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 0,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    // Then
    expect(result).to.deep.equal({ x: 7, y: 1 });
  });

  it('gets a recommended cell for a single robot', async () => {
    // Given
    const heatMapDropRate = [
      1,
      0.625,
      0.390625,
      0.244140625,
      0.15258789062,
      0.09536743164,
      0.05960464477,
      0.03725290298,
      0.02328306436,
      0.01455191522,
      0.00909494701
    ];
    const config = {
      mapWidth: 9,
      mapHeight: 9,
      zoneSizeX: 3,
      zoneSizeY: 3,
      heatMapDropRate
    };
    const Map = require('../../../src/map/Map');
    const map = new Map(config);
    map.processOreInput({ x: 1, y: 7, amount: 100 });
    map.getDataHeatMap().reCalculateHeatMap();
    const DataHeatMapEvaluator = require('../../../src/ai/DataHeatMapEvaluator');
    const evaluator = new DataHeatMapEvaluator({ map });

    // When
    const result = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 0,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    // Then
    expect(result).to.deep.equal({ x: 1, y: 7 });
  });

  it('gets a recommended cell for a single robot', async () => {
    // Given
    const heatMapDropRate = [
      1,
      0.625,
      0.390625,
      0.244140625,
      0.15258789062,
      0.09536743164,
      0.05960464477,
      0.03725290298,
      0.02328306436,
      0.01455191522,
      0.00909494701
    ];
    const config = {
      mapWidth: 9,
      mapHeight: 9,
      zoneSizeX: 3,
      zoneSizeY: 3,
      heatMapDropRate
    };
    const Map = require('../../../src/map/Map');
    const map = new Map(config);
    map.processOreInput({ x: 8, y: 8, amount: 100 });
    map.getDataHeatMap().reCalculateHeatMap();
    const DataHeatMapEvaluator = require('../../../src/ai/DataHeatMapEvaluator');
    const evaluator = new DataHeatMapEvaluator({ map });

    // When
    const result = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 0,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    // Then
    expect(result).to.deep.equal({ x: 7, y: 1 });
  });

  it('gets a recommended cell for multiple robots', async () => {
    // Given
    const heatMapDropRate = [
      1,
      0.625,
      0.390625,
      0.244140625,
      0.15258789062,
      0.09536743164,
      0.05960464477,
      0.03725290298,
      0.02328306436,
      0.01455191522,
      0.00909494701
    ];
    const config = {
      mapWidth: 9,
      mapHeight: 9,
      zoneSizeX: 3,
      zoneSizeY: 3,
      heatMapDropRate
    };
    const Map = require('../../../src/map/Map');
    const map = new Map(config);
    map.processOreInput({ x: 7, y: 4, amount: 100 });
    map.getDataHeatMap().reCalculateHeatMap();
    const DataHeatMapEvaluator = require('../../../src/ai/DataHeatMapEvaluator');
    const evaluator = new DataHeatMapEvaluator({ map });

    // When
    const result_1 = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 0,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });
    const result_2 = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 4,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });
    const result_3 = evaluator.getRecommendedCoordinate({
      robotCellX: 0,
      robotCellY: 7,
      maxZoneDistance: 2,
      scorerMethod: DataHeatMapEvaluator.SCORER_METHODS.MOVE_TO_BETTER_POSITION
    });

    // Then
    expect(result_1).to.deep.equal({ x: 7, y: 1 });
    expect(result_2).to.deep.equal({ x: 7, y: 4 });
    expect(result_3).to.deep.equal({ x: 7, y: 7 });
  });
});
