const interpolar = (abs1, ord1, abs2, ord2, aCalcular) => {
  if (aCalcular < abs1 || aCalcular > abs2) throw new Error('Valor inválido: ' + aCalcular);

  let deltaUnitario = (ord2 - ord1) / (abs2 - abs1);

  return ord1 + (aCalcular - abs1) * deltaUnitario;
};

module.exports = {
  interpolar
};

