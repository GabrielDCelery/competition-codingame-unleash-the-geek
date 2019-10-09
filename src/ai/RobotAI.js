class RobotAI {
  constructor({ stateGetters }) {
    this.getAction = this.getAction.bind(this);

    this.stateGetters = stateGetters;
    this.actionConfigs = [
      {
        action: 'deliverOreToHome',
        scorers: [
          {
            stateGetter: 'doesCargoHaveOre',
            stateToPriorityConverter: result => (result ? Infinity : -Infinity)
          }
        ]
      },
      {
        action: 'deployRadar',
        scorers: [
          {
            stateGetter: 'doesCargoHaveRadar',
            stateToPriorityConverter: result => (result ? Infinity : -Infinity)
          }
        ]
      },
      {
        action: 'pickupRadar',
        scorers: [
          {
            stateGetter: 'isCargoEmpty',
            stateToPriorityConverter: result => (result ? 100 : -100)
          },
          {
            stateGetter: 'isRadarAvailable',
            stateToPriorityConverter: result =>
              result === true ? 100 : -Infinity
          },
          {
            stateGetter: 'normalizedDistanceFromHQ',
            stateToPriorityConverter: result => (1 - result) * 100
          }
        ]
      },
      {
        action: 'collectNearbyOre',
        scorers: [
          {
            stateGetter: 'isCargoEmpty',
            stateToPriorityConverter: result => (result ? 100 : -Infinity)
          },
          {
            stateGetter: 'hasOreNearby',
            stateToPriorityConverter: result => (result ? 100 : -Infinity)
          }
        ]
      },
      {
        action: 'digHoleNextToMe',
        scorers: [
          {
            stateGetter: 'hasOreOnMap',
            stateToPriorityConverter: result => (result ? -Infinity : 0)
          },
          {
            stateGetter: 'safeToDigHoleNextToMe',
            stateToPriorityConverter: result => (result ? 70 : -Infinity)
          }
        ]
      },
      {
        action: 'moveToBetterPosition',
        scorers: [
          {
            stateGetter: 'doIExist',
            stateToPriorityConverter: result => (result ? 50 : 50)
          }
        ]
      }
    ];
  }

  getAction() {
    const weighedActionConfigs = this.actionConfigs.map(actionConfig => {
      const { action, scorers } = actionConfig;
      const priorities = scorers.map(scorer => {
        const result = this.stateGetters[scorer.stateGetter]();

        return scorer.stateToPriorityConverter(result);
      });

      const totalPriority = RobotAI.sumArrayValues(priorities);

      return {
        action,
        priority: totalPriority
      };
    });

    const highestWeighedActionConfig = RobotAI.selectHighestWeighedActionConfig(
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

  static sumArrayValues(arrayValues) {
    return arrayValues.reduce((a, b) => a + b, 0);
  }
}

module.exports = RobotAI;
