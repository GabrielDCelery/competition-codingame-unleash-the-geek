const helpers = require('../helpers');

class PlayerMemory {
  constructor({ map }) {
    this.analyzeTurn = this.analyzeTurn.bind(this);
    this.memorizeTurn = this.memorizeTurn.bind(this);
    this.isRiskyCoordinate = this.isRiskyCoordinate.bind(this);
    this.map = map;

    this.memory = {
      previousTurn: {
        enemyCoordinates: {},
        holes: {},
        ore: {}
      },
      riskyCoordinates: {}
    };
  }

  _addRiskyCoordinate({ x, y }) {
    this.memory.riskyCoordinates[
      helpers.convertCoordinatesToKey({ x, y })
    ] = true;
  }

  isRiskyCoordinate({ x, y }) {
    return (
      this.memory.riskyCoordinates[
        helpers.convertCoordinatesToKey({ x, y })
      ] === true
    );
  }

  analyzeTurn() {
    const { getAmounts, getData } = this.map.getDataTracker();
    const { ORE, HOLE } = getAmounts();
    const enemyKeys = Object.keys(this.memory.previousTurn.enemyCoordinates);
    const holesPreviousTurn = this.memory.previousTurn.holes;
    const orePreviousTurn = this.memory.previousTurn.ore;
    const holesThisTurn = getData({ what: HOLE });
    const oreThisTurn = getData({ what: ORE });

    for (let j = 0, jMax = enemyKeys.length; j < jMax; j++) {
      const enemyCoordinate = helpers.destructureKeyToCoordinates(enemyKeys[j]);

      for (
        let distance = 0, distanceMax = 1;
        distance <= distanceMax;
        distance++
      ) {
        const coordinatesToCheck = this.map
          .getDistanceMapper()
          .getCoordinatesAtDistance({
            x: enemyCoordinate.x,
            y: enemyCoordinate.y,
            distance
          });

        for (let i = 0, iMax = coordinatesToCheck.length; i < iMax; i++) {
          const [cellX, cellY] = coordinatesToCheck[i];

          if (!this.isRiskyCoordinate({ x: cellX, y: cellY })) {
            const cellKey = helpers.convertCoordinatesToKey({
              x: cellX,
              y: cellY
            });

            const bHadHole = 0 < holesPreviousTurn[cellKey];
            const bHasHole = 0 < holesThisTurn[cellKey];
            const orePreviousAmount = orePreviousTurn[cellKey] || 0;
            const oreCurrentAmount = oreThisTurn[cellKey] || 0;

            const enemyProbablyDugOnCell = !bHadHole && bHasHole;
            const enemyProbablyHarvestedOnCell =
              oreCurrentAmount < orePreviousAmount;

            if (enemyProbablyDugOnCell || enemyProbablyHarvestedOnCell) {
              this._addRiskyCoordinate({ x: cellX, y: cellY });
            }
          }
        }
      }
    }
  }

  memorizeTurn() {
    const { ORE, HOLE, ENEMY_ROBOT } = this.map.getDataTracker().getAmounts();
    const { getData } = this.map.getDataTracker();
    this.memory.previousTurn.enemyCoordinates = helpers.cloneData(
      getData({ what: ENEMY_ROBOT })
    );
    this.memory.previousTurn.holes = helpers.cloneData(getData({ what: HOLE }));
    this.memory.previousTurn.ore = helpers.cloneData(getData({ what: ORE }));
  }
}

module.exports = PlayerMemory;
