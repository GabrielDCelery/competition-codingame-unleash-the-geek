
class RobotAI {
  constructor({ stateGetters }) {
    this.stateGetters = stateGetters;
    this.actionConfigs = [{
      action: 'deliverOreToHome',
      scorers: [
        RobotAI.URGES.DOES_CARGO_HAVE_ORE
      ]
    }, {
      action: 'pickupRadar',
      scorers: [
        RobotAI.URGES.IS_CARGO_EMPTY,
        RobotAI.URGES.IS_RADAR_AVAILABLE,
        RobotAI.URGES.DISTANCE_FROM_HQ_FOR_RETRIEVAL
      ]
    }, {
      action: 'collectOreInZone',
      scorers: [
        RobotAI.URGES.IS_CARGO_EMPTY,
        RobotAI.URGES.HAS_ORE_IN_ZONE
      ]
    }]
  }

  static get URGES() {
    return {
      DOES_CARGO_HAVE_ORE: {
        stateGetter: 'doesCargoHaveOre',
        stateToUrgeConverter: result => {
          return result === true ? 100 : -100;
        }
      },
      IS_CARGO_EMPTY: {
        stateGetter: 'isCargoEmpty',
        stateToUrgeConverter: result => {
          return result === true ? 100 : -100;
        }
      },
      IS_RADAR_AVAILABLE: {
        stateGetter: 'isRadarAvailable',
        stateToUrgeConverter: (result) => {
          return result === true ? 100 : -100;
        }
      },
      NORMALIZED_DISTANCE_FROM_HQ_FOR_PICKUP: {
        stateGetter: 'normalizedDistanceFromHQ',
        stateToUrgeConverter: (result) => {
          return (1 - result) * 100;
        }
      },
      HAS_ORE_IN_ZONE: {
        stateGetter: 'hasOreInZone',
        stateToUrgeConverter: (result) => {
          return result === true ? 100 : -10000
        }
      },
      HAS_ORE_IN_ADJACENT_ZONE: {
        stateGetter: 'hasOreInAdjacentZone',
        stateToUrgeConverter: (result) => {
          return result === true ? 50 : -10000
        }
      }
    }
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
      const urges = scorers.map(scorer => {
        const result = this.stateGetters[scorer['stateGetter']](robotId);

        return scorer['stateToUrgeConverter'](result);
      });

      const totalUrge = this.sumArrayValues(urges);

      return {
        action,
        urge: totalUrge
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