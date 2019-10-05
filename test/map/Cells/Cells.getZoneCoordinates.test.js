const { expect } = require('chai');

describe('Cells.getZoneCoordinates()', () => {
  it('returns the zone coordinates for a cell', async () => {
    // Given
    const config = { mapWidth: 4, mapHeight: 4, zoneSizeX: 2, zoneSizeY: 2 };
    const Cells = require('../../../src/map/Cells');
    const instance = new Cells(config)

    // When
    const [
      result_0_0,
      result_1_0,
      result_0_1,
      result_1_1
    ] = [
        instance.getZoneCoordinates({ x: 0, y: 0 }),
        instance.getZoneCoordinates({ x: 1, y: 0 }),
        instance.getZoneCoordinates({ x: 0, y: 1 }),
        instance.getZoneCoordinates({ x: 1, y: 1 })
      ];

    const [
      result_2_0,
      result_3_0,
      result_2_1,
      result_3_1
    ] = [
        instance.getZoneCoordinates({ x: 2, y: 0 }),
        instance.getZoneCoordinates({ x: 3, y: 0 }),
        instance.getZoneCoordinates({ x: 2, y: 1 }),
        instance.getZoneCoordinates({ x: 3, y: 1 })
      ];

    const [
      result_0_2,
      result_0_3,
      result_1_2,
      result_1_3
    ] = [
        instance.getZoneCoordinates({ x: 0, y: 2 }),
        instance.getZoneCoordinates({ x: 0, y: 3 }),
        instance.getZoneCoordinates({ x: 1, y: 2 }),
        instance.getZoneCoordinates({ x: 1, y: 3 })
      ];

    const [
      result_2_2,
      result_2_3,
      result_3_2,
      result_3_3
    ] = [
        instance.getZoneCoordinates({ x: 2, y: 2 }),
        instance.getZoneCoordinates({ x: 2, y: 3 }),
        instance.getZoneCoordinates({ x: 3, y: 2 }),
        instance.getZoneCoordinates({ x: 3, y: 3 })
      ];

    // Then
    const zone_0_0_coordinates = { x: 0, y: 0 }

    expect(result_0_0).to.deep.equal(zone_0_0_coordinates);
    expect(result_1_0).to.deep.equal(zone_0_0_coordinates);
    expect(result_0_1).to.deep.equal(zone_0_0_coordinates);
    expect(result_1_1).to.deep.equal(zone_0_0_coordinates);

    const zone_1_0_coordinates = { x: 1, y: 0 }

    expect(result_2_0).to.deep.equal(zone_1_0_coordinates);
    expect(result_3_0).to.deep.equal(zone_1_0_coordinates);
    expect(result_2_1).to.deep.equal(zone_1_0_coordinates);
    expect(result_3_1).to.deep.equal(zone_1_0_coordinates);

    const zone_0_1_coordinates = { x: 0, y: 1 }

    expect(result_0_2).to.deep.equal(zone_0_1_coordinates);
    expect(result_0_3).to.deep.equal(zone_0_1_coordinates);
    expect(result_1_2).to.deep.equal(zone_0_1_coordinates);
    expect(result_1_3).to.deep.equal(zone_0_1_coordinates);

    const zone_1_1_coordinates = { x: 1, y: 1 }

    expect(result_2_2).to.deep.equal(zone_1_1_coordinates);
    expect(result_2_3).to.deep.equal(zone_1_1_coordinates);
    expect(result_3_2).to.deep.equal(zone_1_1_coordinates);
    expect(result_3_3).to.deep.equal(zone_1_1_coordinates);
  });
});