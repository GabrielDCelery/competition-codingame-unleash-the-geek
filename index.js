/**
 * Deliver more ore to hq (left side of the map) than your opponent. Use radars to find ore but beware of traps!
 **/

const configs = require('./src/configs');
const { Player } = require('./src/ai');
const { Map } = require('./src/map');
const map = new Map(configs);
const player = new Player({ map, configs });

var inputs = readline().split(' ');
const width = parseInt(inputs[0]);
const height = parseInt(inputs[1]); // size of the map

// game loop
while (true) {
  var inputs = readline().split(' ');
  const myScore = parseInt(inputs[0]); // Amount of ore delivered
  const opponentScore = parseInt(inputs[1]);

  map.reset();

  for (let i = 0; i < height; i++) {
    var inputs = readline().split(' ');
    for (let j = 0; j < width; j++) {
      const ore = inputs[2 * j]; // amount of ore or "?" if unknown
      const hole = parseInt(inputs[2 * j + 1]); // 1 if cell has a hole

      map
        .processHoleInput({
          x: j,
          y: i,
          hole: hole
        })
        .processOreInput({
          x: j,
          y: i,
          amount: ore
        });
    }
  }
  var inputs = readline().split(' ');
  const entityCount = parseInt(inputs[0]); // number of entities visible to you
  const radarCooldown = parseInt(inputs[1]); // turns left until a new radar can be requested
  const trapCooldown = parseInt(inputs[2]); // turns left until a new trap can be requested

  player.updateGameState({ radarCooldown, trapCooldown });
  for (let i = 0; i < entityCount; i++) {
    var inputs = readline().split(' ');
    const id = parseInt(inputs[0]); // unique id of the entity
    const type = parseInt(inputs[1]); // 0 for your robot, 1 for other robot, 2 for radar, 3 for trap
    const x = parseInt(inputs[2]);
    const y = parseInt(inputs[3]); // position of the entity
    const item = parseInt(inputs[4]); // if this entity is a robot, the item it is carrying (-1 for NONE, 2 for RADAR, 3 for TRAP, 4 for ORE)

    map.processEntityInput({ x, y, type });
    player.processEntityInput({ x, y, type, id, item });
  }

  player.getPlayerMemory().analyzeTurn();

  map.getHeatMap().reCalculateHeatMap();

  const commands = player.generateCommandsForAlliedRobots();

  player.getPlayerMemory().memorizeTurn();

  for (let i = 0, iMax = commands.length; i < iMax; i++) {
    console.log(commands[i]);
  }
}
