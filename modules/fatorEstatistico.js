const VALORES_TABELADOS = [
  1.1,
  1.0,
  0.95,
  0.88,
  0.83
];

const determinarFatorEstatistico = (probabilidade, anos) => {
  return 0.54*(-Math.log(1 - probabilidade) / anos) ** -0.157
};

module.exports = {
  VALORES_TABELADOS,
  determinarFatorEstatistico
};