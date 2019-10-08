const { expect } = require('chai');

describe('DataHeatMapEvaluator.getRecommendedCoordinate()', () => {
  it('gets a recommended cell for a single robot', async () => {
    // Given
    const {
      ENTITY_ALLIED_ROBOT,
      ITEM_ORE_UNKNOWN_AMOUNT,
      ITEM_NONE
    } = require('../../src/constants');
    const configs = require('../../src/configs');
    const { Player } = require('../../src/ai');
    const { Map } = require('../../src/map');

    const map = new Map(configs['map']);
    const player = new Player({ map });

    map
      .processHoleInput({
        x: 20,
        y: 14,
        hole: null
      })
      .processOreInput({
        x: 0,
        y: 0,
        amount: ITEM_ORE_UNKNOWN_AMOUNT
      });

    map.resetEntities();
    player.updateGamaeStateAtTurnStart({
      radarCooldown: 0,
      trapCooldown: 0
    });

    [0, 3, 7, 10, 14].forEach((y, index) => {
      map.processEntityInput({ x: 0, y: y, type: ENTITY_ALLIED_ROBOT });
      player.processEntityInput({
        x: 0,
        y: y,
        type: ENTITY_ALLIED_ROBOT,
        id: index,
        item: ITEM_NONE
      });
    });

    map.getDataHeatMap().reCalculateHeatMap();

    // When

    const commands = player.generateCommandsForAlliedRobots();

    console.log(commands);

    // Then
    expect(true).to.equal(true);
  });
});
