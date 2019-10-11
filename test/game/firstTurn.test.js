const { expect } = require('chai');

describe('firstTurn', () => {
  it('succesfully creates commands for the first turn', async () => {
    // Given
    const {
      READLINE_ENTITY_ALLIED_ROBOT,
      READLINE_UNKNOWN_ORE_AMOUNT,
      ITEM_NONE
    } = require('../../src/constants');
    const configs = require('../../src/configs');
    const { Player } = require('../../src/ai');
    const { Map } = require('../../src/map');

    const map = new Map(configs);
    const player = new Player({ map, configs });

    map
      .processHoleInput({
        x: 20,
        y: 14,
        hole: null
      })
      .processOreInput({
        x: 3,
        y: 3,
        amount: '20'
      });

    player.updateGameState({
      radarCooldown: 0,
      trapCooldown: 0
    });

    [0, 3, 7, 10, 14].forEach((y, index) => {
      map.processEntityInput({
        x: 1,
        y: y,
        type: READLINE_ENTITY_ALLIED_ROBOT
      });
      player.processEntityInput({
        x: 1,
        y: y,
        type: READLINE_ENTITY_ALLIED_ROBOT,
        id: index,
        item: ITEM_NONE
      });
    });

    map.getHeatMap().reCalculateHeatMap();

    // When

    const commands = player.generateCommandsForAlliedRobots();

    // Then
    /*
    expect(commands).to.deep.equal([
      'MOVE 3 3',
      'MOVE 3 3',
      'MOVE 3 3',
      'MOVE 3 3',
      'MOVE 3 3'
    ]);
    */
  });
});
