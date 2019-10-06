const { expect } = require('chai');

describe('Map.processEntityInput()', () => {
  it('adds allied robots', async () => {
    // Given
    const { READLINE_ENTITY_ALLIED_ROBOT } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processEntityInput({ x: 0, y: 1, type: READLINE_ENTITY_ALLIED_ROBOT })
    instance.processEntityInput({ x: 1, y: 0, type: READLINE_ENTITY_ALLIED_ROBOT })
    instance.processEntityInput({ x: 0, y: 1, type: READLINE_ENTITY_ALLIED_ROBOT })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 2, 0, 0, 0]
      }],
      [{
        "values": [0, 0, 1, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [0, 0, 3, 0, 0, 0]
      }]
    ])
    expect(instance.totals).to.deep.equal({
      "values": [0, 0, 3, 0, 0, 0]
    })
  });

  it('adds enemy robots', async () => {
    // Given
    const { READLINE_ENTITY_ENEMY_ROBOT } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processEntityInput({ x: 0, y: 1, type: READLINE_ENTITY_ENEMY_ROBOT })
    instance.processEntityInput({ x: 1, y: 0, type: READLINE_ENTITY_ENEMY_ROBOT })
    instance.processEntityInput({ x: 0, y: 1, type: READLINE_ENTITY_ENEMY_ROBOT })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 2, 0, 0]
      }],
      [{
        "values": [0, 0, 0, 1, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 3, 0, 0]
      }]
    ])
    expect(instance.totals).to.deep.equal({
      "values": [0, 0, 0, 3, 0, 0]
    })
  });

  it('adds radars', async () => {
    // Given
    const { READLINE_ENTITY_RADAR } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processEntityInput({ x: 0, y: 1, type: READLINE_ENTITY_RADAR })
    instance.processEntityInput({ x: 1, y: 0, type: READLINE_ENTITY_RADAR })

    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 1, 0]
      }],
      [{
        "values": [0, 0, 0, 0, 1, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 2, 0]
      }]
    ])
    expect(instance.totals).to.deep.equal({
      "values": [0, 0, 0, 0, 2, 0]
    })
  });

  it('adds mines', async () => {
    // Given
    const { READLINE_ENTITY_MINE } = require('../../../src/constants')
    const config = { mapWidth: 2, mapHeight: 2, zoneSizeX: 2, zoneSizeY: 2 };
    const Map = require('../../../src/map/Map');
    const instance = new Map(config);

    // When
    instance.processEntityInput({ x: 0, y: 1, type: READLINE_ENTITY_MINE })
    instance.processEntityInput({ x: 1, y: 0, type: READLINE_ENTITY_MINE })
    
    // Then
    expect(instance.cells.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 0]
      }, {
        "values": [0, 0, 0, 0, 0, 1]
      }],
      [{
        "values": [0, 0, 0, 0, 0, 1]
      }, {
        "values": [0, 0, 0, 0, 0, 0]
      }]
    ]);
    expect(instance.zones.data).to.deep.equal([
      [{
        "values": [0, 0, 0, 0, 0, 2]
      }]
    ])
    expect(instance.totals).to.deep.equal({
      "values": [0, 0, 0, 0, 0, 2]
    })
  });
});