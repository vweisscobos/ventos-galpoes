const interpolar = (abs1, ord1, abs2, ord2, aCalcular) => {
  if (aCalcular < abs1 || aCalcular > abs2) throw new Error('Valor inválido: ' + aCalcular);

  let deltaUnitario = (ord2 - ord1) / (abs2 - abs1);

  return ord1 + (aCalcular - abs1) * deltaUnitario;
};

const interpolarObjetos = (abs1, obj1, abs2, obj2, aCalcular) => {
  let coeficientesInterpolados = {};

  for (let val in obj1) {
    coeficientesInterpolados[val] = interpolar(abs1, obj1[val], abs2, obj2[val], aCalcular);
  }

  return coeficientesInterpolados;
};

const pegarLimitesDeIntervalo = (conjunto, pontoDoIntervalo) => {
  let anterior;

  for (let val of conjunto) {
    if (!anterior) anterior = val;

    if (pontoDoIntervalo > anterior && pontoDoIntervalo < val) {
      return [anterior, val];
    }

    anterior = val;
  }
};

module.exports = {
  interpolar,
  interpolarObjetos,
  pegarLimitesDeIntervalo
};

