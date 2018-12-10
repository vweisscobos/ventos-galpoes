const PARAMETROS_METEOROLOGICOS = [
  {
    parametros: {
      b: [1.1, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.19, 1.21, 1.23, 1.25],
      p: [0.06, 0.065, 0.07, 0.075, 0.08, 0.085, 0.085, 0.09, 0.095, 0.095, 0.1]
    }
  },
  {
    parametros: {
      b: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
      p: [0.085, 0.09, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.135, 0.145, 0.15, 1.16]
    }
  },
  {
    parametros: {
      b: [0.94, 0.94, 0.93, 0.92, 0.92, 0.91, 0.90, 0.90, 0.89, 0.87, 0.86, 0.85],
      p: [0.10, 0.105, 0.115, 0.125, 0.13, 0.14, 0.145, 0.15, 0.16, 0.175, 0.185, 0.2]
    }
  },
  {
    parametros: {
      b: [0.86, 0.85, 0.84, 0.83, 0.83, 0.82, 0.80, 0.79, 0.76, 0.73, 0.71, 0.68],
      p: [0.12, 0.125, 0.135, 0.145, 0.15, 0.16, 0.17, 0.175, 0.195, 0.215, 0.23, 0.25]
    }
  },
  {
    parametros: {
      b: [0.74, 0.73, 0.71, 0.7, 0.69, 0.67, 0.64, 0.62, 0.58, 0.53, 0.50, 0.44],
      p: [0.15, 0.16, 0.175, 0.185, 0.19, 0.205, 0.22, 0.23, 0.255, 0.285, 0.31, 0.35]
    }
  }
];

const FATORES_DE_RAJADA ={
  "A": 1.00,
  "B": 0.98,
  "C": 0.95,
  0: 1.00,
  1: 0.98,
  2: 0.95,
  '3s': 1.00,
  '5s': 0.98,
  '10s': 0.95,
  '15s': 0.93,
  '20s': 0.90,
  '30s': 0.87,
  '45s': 0.84,
  '60s': 0.82,
  '120s': 0.77,
  '300s': 0.72,
  '600s': 0.69,
  '3600': 0.65
};

const calcularFatorRugosidade = (rugosidade, classeDimensoes, alturaDoPonto) => {
  let parametrosMeteorologicos = getParametrosMeteorologicos(rugosidade, classeDimensoes);
  let fatorDeRajada = FATORES_DE_RAJADA[classeDimensoes];

  return parametrosMeteorologicos.b * fatorDeRajada * ((alturaDoPonto/10) ** parametrosMeteorologicos.p);
};

const getParametrosMeteorologicos = (rugosidade, classeDimensoes) => {
  return {
    p: PARAMETROS_METEOROLOGICOS[rugosidade]['parametros']['p'][classeDimensoes],
    b: PARAMETROS_METEOROLOGICOS[rugosidade]['parametros']['b'][classeDimensoes]
  };
};

const determinarFatorRugosidadePorIteracao = ({
  rugosidade,
  intervaloTempoEstimado,
  alturaPonto,
  maiorDimensao,
  topografia,
  velocidadeBasica,
  fatorTopografico
}) => {
  let fatorRugosidade,
    velocidadeMedia,
    intervaloDeTempoCalculado,
    iteracoes = [];

  fatorTopografico =  getFatorTopografico(topografia, alturaPonto);

  while (!compararIteracoes(iteracoes)) {
    fatorRugosidade = calcularFatorRugosidade(rugosidade, intervaloTempoEstimado, alturaPonto);
    velocidadeMedia = getVelocidadeMediaVento(fatorTopografico, fatorRugosidade, velocidadeBasica);
    intervaloDeTempoCalculado = getIntervaloTempo(maiorDimensao, velocidadeMedia);

    intervaloTempoEstimado = pegarProximoIntervaloDeTempo(intervaloTempoEstimado, intervaloDeTempoCalculado);

    iteracoes.push([intervaloTempoEstimado, intervaloDeTempoCalculado]);
  }

  return fatorRugosidade;
};

const compararIteracoes = (iteracoes) => {
  if (iteracoes.length < 4) return false;

  let ultimasQuatro = iteracoes.slice(-4);

  if (ultimasQuatro[0][0] === ultimasQuatro[2][0] && ultimasQuatro[1][0] === ultimasQuatro[3][0]) {
    return Math.abs(ultimasQuatro[0][0] - ultimasQuatro[0][1]) < Math.abs(ultimasQuatro[1][0] - ultimasQuatro[1][1]) ?
      ultimasQuatro[0][0] :
      ultimasQuatro[1][0];
  } else return false;
};

const getVelocidadeMediaVento = (fatorTopografico, fatorRugosidade, velBasica) => {
  return fatorTopografico * fatorRugosidade * velBasica;
};

const getIntervaloTempo = (maiorDimensao, velocidadeMediaVento) => {
  return 7.5 * ( maiorDimensao / velocidadeMediaVento );
};

const pegarProximoIntervaloDeTempo = (estimado, calculado) => {
  let temposTabelados = [3, 5, 10, 15, 20, 30, 45, 60, 120, 300, 600, 3600];
  let indiceAtual = temposTabelados.indexOf(estimado);

  if (estimado > calculado) {
    if (estimado === 0) return 0;
    else return temposTabelados[indiceAtual - 1];
  }
  if (estimado < calculado) {
    if (estimado === temposTabelados.length - 1) return temposTabelados.length - 1;
    else return temposTabelados[indiceAtual + 1];
  }

  return true;
};

module.exports = {
  determinarFatorRugosidadePorIteracao,
  calcularFatorRugosidade
}