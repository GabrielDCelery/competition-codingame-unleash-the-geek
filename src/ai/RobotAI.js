class RobotAI {
  constructor({ stateGetters }) {
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
            stateToPriorityConverter: result => (result === true ? 100 : -100)
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
            stateToPriorityConverter: result => (result ? 100 : -100)
          },
          {
            stateGetter: 'hasOreNearby',
            stateToPriorityConverter: result => (result ? 100 : -Infinity)
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

  selectHighestWeighedActionConfig(weighedActionConfigs) {
    let highestWeighedActionConfig = {
      action: 'none',
      priority: null
    };

    for (let i = 0, iMax = weighedActionConfigs.length; i < iMax; i++) {
      const weighedActionConfig = weighedActionConfigs[i];
      if (
        highestWeighedActionConfig['priority'] < weighedActionConfig['priority']
      ) {
        highestWeighedActionConfig = weighedActionConfig;
      }
    }

    return highestWeighedActionConfig;
  }

  sumArrayValues(arrayValues) {
    return arrayValues.reduce((a, b) => a + b, 0);
  }

  getAction() {
    const weighedActionConfigs = this.actionConfigs.map(actionConfig => {
      const { action, scorers } = actionConfig;
      const priorities = scorers.map(scorer => {
        const result = this.stateGetters[scorer['stateGetter']]();

        return scorer['stateToPriorityConverter'](result);
      });

      const totalPriority = this.sumArrayValues(priorities);

      return {
        action,
        priority: totalPriority
      };
    });

    const highestWeighedActionConfig = this.selectHighestWeighedActionConfig(
      weighedActionConfigs
    );
    const actionToUse = highestWeighedActionConfig['action'];

    return actionToUse;
  }
}

module.exports = RobotAI;
