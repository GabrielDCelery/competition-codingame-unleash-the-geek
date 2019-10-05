class GridDistanceMapper {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.boundaries = {
      left: 0,
      top: 0,
      right: this.width - 1,
      bottom: this.height - 1
    }
  }

  _isOffsetAtDistance({ offsetX, offsetY, distance }) {
    return (Math.abs(offsetX) + Math.abs(offsetY)) === distance
  }

  _areCoordinatesInsideGrid({ x, y }) {
    return this.boundaries.left <= x &&
      x <= this.boundaries.right &&
      this.boundaries.top <= y &&
      y <= this.boundaries.bottom;
  }

  _getCellsAtSpecificDistance({ x, y, distance }) {
    const cellsAtDistance = [];

    for (let offsetX = -Math.abs(distance), offsetXMax = distance; offsetX <= offsetXMax; offsetX++) {
      for (let offsetY = -Math.abs(distance), offsetYMax = distance; offsetY <= offsetYMax; offsetY++) {
        if (
          this._isOffsetAtDistance({ offsetX, offsetY, distance }) &&
          this._areCoordinatesInsideGrid({
            x: x + offsetX,
            y: y + offsetY
          })) {
          cellsAtDistance.push([x + offsetX, y + offsetY])
        }
      }
    }

    return cellsAtDistance;
  }

  mapDistances({ maxDistance } = { maxDistance: Infinity }) {
    const ditanceToUse = Math.min(maxDistance + 1, Math.max(this.width, this.height))
    this.data = new Array(this.width)
      .fill(null)
      .map(() => {
        return new Array(this.height)
          .fill(null).map(() => {
            return new Array(ditanceToUse).fill(null);
          })
      })

    for (let distance = 0, distanceMax = ditanceToUse; distance < distanceMax; distance++) {
      for (let x = 0, xMax = this.width; x < xMax; x++) {
        for (let y = 0, yMax = this.height; y < yMax; y++) {
          const cellsAtDistance = this._getCellsAtSpecificDistance({ x, y, distance });

          this.data[x][y][distance] = cellsAtDistance;
        }
      }
    }

    return this.data;
  }
}

module.exports = GridDistanceMapper;