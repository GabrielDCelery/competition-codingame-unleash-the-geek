
class RobotAI {
  constructor({ stateGetters }) {
    this.stateGetters = stateGetters;
    this.actionConfigs = [{
      action: 'deliverOreToHome',
      scorers: [{
        stateGetter: 'doesCargoHaveOre',
        stateToPriorityConverter: result => result ? Infinity : -Infinity
      }]
    }, {
      action: 'pickupRadar',
      scorers: [{
        stateGetter: 'isCargoEmpty',
        stateToPriorityConverter: result => result ? 100 : -100
      }, {
        stateGetter: 'isRadarAvailable',
        stateToPriorityConverter: result => result === true ? 100 : -100
      }, {
        stateGetter: 'normalizedDistanceFromHQ',
        stateToPriorityConverter: result => (1 - result) * 100
      }]
    }, {
      action: 'collectOreInZone',
      scorers: [{
        stateGetter: 'isCargoEmpty',
        stateToPriorityConverter: result => result ? 100 : -100
      }, {
        stateGetter: 'hasOreInZone',
        stateToPriorityConverter: result => result ? 100 : -Infinity
      }]
    }, {
      action: 'moveToBetterPosition',
      scorers: []
    }]
  }

  selectHighestWeighedActionConfig(weighedActionConfigs) {
    let highestWeighedActionConfig = {
      action: 'none',
      utility: null
    };

    for (let i = 0, iMax = weighedActionConfigs.length; i < iMax; i++) {
      const weighedActionConfig = weighedActionConfigs[i];
      if (highestWeighedActionConfig['utility'] < weighedActionConfig['utility']) {
        highestWeighedActionConfig = weighedActionConfig;
      }
    }

    return highestWeighedActionConfig;
  }

  normalizeArrayValues(arrayValues) {

  }

  sumArrayValues(arrayValues) {
    return arrayValues.reduce((a, b) => a + b, 0);
  }

  getAction(robotId) {
    const weighedActionConfigs = this.actionConfigs.map(actionConfig => {
      const { action, scorers } = actionConfig;
      const priorities = scorers.map(scorer => {
        const result = this.stateGetters[scorer['stateGetter']](robotId);

        return scorer['stateToPriorityConverter'](result);
      });

      const totalPriority = this.sumArrayValues(priorities);

      return {
        action,
        priority: totalPriority
      }
    });
    /*
    const highestWeighedActionConfig =
      this.selectHighestWeighedActionConfig(weighedActionConfigs);
    const action = highestWeighedActionConfig['action'];
    */
  }
}

module.exports = RobotAI;