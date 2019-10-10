class Helpers {
  static convertCoordinatesToKey({ x, y }) {
    return `${x}_${y}`;
  }

  static destructureKeyToCoordinates(key) {
    const [x, y] = key.split('_');
    return { x, y };
  }
}

module.exports = Helpers;
