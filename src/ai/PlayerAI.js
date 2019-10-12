const helpers = require('../helpers');

class PlayerAI {
  constructor() {
    this.getActionForRobot = this.getActionForRobot.bind(this);

    this.actionConfigs = [
      {
        action: 'makeRobotDeliverOreToHQ',
        scorers: [
          {
            who: 'robot',
            stateGetter: 'doesCargoHaveOre',
            stateToUrgeConverter: result => (result ? Infinity : -Infinity)
          }
        ]
      },
      {
        action: 'makeRobotDeployRadar',
        scorers: [
          {
            who: 'robot',
            stateGetter: 'doesCargoHaveRadar',
            stateToUrgeConverter: result => (result ? Infinity : -Infinity)
          }
        ]
      },
      {
        action: 'makeRobotPickupRadar',
        scorers: [
          {
            who: 'robot',
            stateGetter: 'isCargoEmpty',
            stateToUrgeConverter: result => (result ? 0 : -Infinity)
          },
          {
            who: 'gameState',
            stateGetter: 'isRadarAvailable',
            stateToUrgeConverter: result => (result ? 0 : -Infinity)
          },
          {
            who: 'gameState',
            stateGetter: 'hasEnoughRadars',
            stateToUrgeConverter: result => (result ? -Infinity : 0)
          },
          {
            who: 'robot',
            stateGetter: 'normalizedDistanceFromHQ',
            stateToUrgeConverter: result => (1 - result) * 100
          }
        ]
      },
      {
        action: 'makeRobotHarvestOre',
        scorers: [
          {
            who: 'gameState',
            stateGetter: 'hasOreOnMap',
            stateToUrgeConverter: result => (result ? 0 : -Infinity)
          },
          {
            who: 'robot',
            stateGetter: 'isCargoEmpty',
            stateToUrgeConverter: result => (result ? 0 : -Infinity)
          },
          {
            who: 'robot',
            stateGetter: 'normalizedDistanceFromNearestOre',
            stateToUrgeConverter: result => (1 - result) * 100
          }
        ]
      },
      {
        action: 'makeRobotDigHole',
        scorers: [
          {
            who: 'robot',
            stateGetter: 'safeToDigHoleNextToMe',
            stateToUrgeConverter: result => (result ? 50 : -Infinity)
          }
        ]
      },
      {
        action: 'makeRobotWander',
        scorers: [
          {
            who: 'robot',
            stateGetter: 'doIExist',
            stateToUrgeConverter: result => (result ? 25 : 25)
          }
        ]
      }
    ];
  }

  getActionForRobot({ robot, gameState }) {
    const whos = {
      robot: robot,
      gameState: gameState
    };

    const weighedActionConfigs = this.actionConfigs.map(actionConfig => {
      const { action, scorers } = actionConfig;
      const priorities = scorers.map(scorer => {
        const { who, stateGetter, stateToUrgeConverter } = scorer;

        return stateToUrgeConverter(whos[who][stateGetter]());
      });

      const totalPriority = helpers.sumArrayValues(priorities);

      return {
        action,
        priority: totalPriority
      };
    });

    const highestWeighedActionConfig = PlayerAI.selectHighestWeighedActionConfig(
      weighedActionConfigs
    );
    const actionToUse = highestWeighedActionConfig.action;

    return actionToUse;
  }

  static selectHighestWeighedActionConfig(weighedActionConfigs) {
    let highestWeighedActionConfig = {
      action: 'none',
      priority: null
    };

    for (let i = 0, iMax = weighedActionConfigs.length; i < iMax; i += 1) {
      const weighedActionConfig = weighedActionConfigs[i];
      if (highestWeighedActionConfig.priority < weighedActionConfig.priority) {
        highestWeighedActionConfig = weighedActionConfig;
      }
    }

    return highestWeighedActionConfig;
  }
}

module.exports = PlayerAI;
