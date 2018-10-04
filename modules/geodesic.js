const Geometry = require('./geometry');
const earthRadiusInKm = 6371;

const getDistance = (coord1, coord2) => {
  const arc = Geometry.arcInRadsBeetwenSphericalCoordinates(coord1, coord2);

  return Geometry.calcSizeOfArc(arc, earthRadiusInKm);
};

const nearestPoint = (arrayOfCoords, point) => {
  arrayOfCoords.sort((coord1, coord2) => {
    if (getDistance(coord1, point) >  getDistance(coord2, point)) return 1;
    if (getDistance(coord1, point) <  getDistance(coord2, point)) return -1;
    return 0;
  });

  return {
    point: arrayOfCoords[0],
    dist: getDistance(arrayOfCoords[0], point)
  };
};

module.exports = {
  distanceBetweenTwoCoordinates: getDistance,
  nearestPoint: nearestPoint
};