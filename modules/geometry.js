const degreesToRadians = degrees => {
  return (degrees * Math.PI) / 180;
};

const sphericalLawOfCosines = (side1, side2, angle3) => {
  side1 = degreesToRadians(side1);
  side2 = degreesToRadians(side2);
  angle3 = degreesToRadians(angle3);

  const a = Math.cos(side1) * Math.cos(side2);
  const b = Math.sin(side1) * Math.sin(side2) * Math.cos(angle3);

  return a + b;
};

const arcInRadsBeetwenSphericalCoordinates = ([lat1, lng1], [lat2, lng2]) => {
  const deltaLngInDegrees = lng2 - lng1;
  const arcFromNorthPoleToPoint1 = 90 - lat1;
  const arcFromNorthPoleToPoint2 = 90 - lat2;

  const cosOfArcBeetwenCoordinates = sphericalLawOfCosines(
    arcFromNorthPoleToPoint1,
    arcFromNorthPoleToPoint2,
    deltaLngInDegrees
  );

  return Math.acos(cosOfArcBeetwenCoordinates);
};

const calcSizeOfArc = (angle, radius) => {
  return angle * radius;
};

module.exports = {
  calcSizeOfArc: calcSizeOfArc,
  arcInRadsBeetwenSphericalCoordinates: arcInRadsBeetwenSphericalCoordinates,
  sphericalLawOfCosines: sphericalLawOfCosines,
  degreesToRadians: degreesToRadians
};