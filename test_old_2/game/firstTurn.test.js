const { expect } = require('chai');

describe('firstTurn', () => {
  it('succesfully creates commands for the first turn', async () => {
    // Given
    const {
      ENTITY_ALLIED_ROBOT,
      ENTITY_ORE_UNKNOWN_AMOUNT,
      ITEM_NONE
    } = require('../../src_old/constants');
    const configs = require('../../src_old/configs');
    const { Player } = require('../../src_old/ai');
    const { Map } = require('../../src_old/map');

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
        amount: ENTITY_ORE_UNKNOWN_AMOUNT
      });

    map.reset();
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

    // Then
    expect(commands).to.deep.equal([
      'DIG 1 0',
      'DIG 1 3',
      'REQUEST RADAR',
      'DIG 1 10',
      'DIG 1 14'
    ]);
  });
});