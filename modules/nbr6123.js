const Geometry = require('./geometry');

/**
 *
 * Início dos cálculos referentes à seção 4.2 da NBR 6123, que diz respeito à determinação das forças estáticas
 * devido ao vento
 *
 */
const getVelocidadeCaracteristica = ({velocidadeBasica, fatorTopografico, fatorRugosidade, fatorEstatistico}) => {
	return velocidadeBasica * fatorTopografico * fatorRugosidade * fatorEstatistico;
};

const getPressaoDinamica = (velocidadeCaracteristica) => {
	return 0.613*(velocidadeCaracteristica ** 2);
};
 /**
 *
 * Fim dos cálculos referentes à seção 4.2 da NBR 6123, que diz respeito à determinação das forças estáticas
 * devido ao vento
 *
 */


/**
 *
 * Início dos cálculos referentes à seção 5.2 da NBR 6123, que diz respeito à obtenção do fator topográfico
 *
 */
const getFatorTopografico = ( topografia, dimensoes ) => {
	if (topografia["tipo"]) return calcularFatorTopografico(topografia, dimensoes.altura);

	switch(topografia) {
    // Terreno plano ou fracamente acidentado
    case 0:
      return 1;
    // Vales protegidos
    case 1:
      return 0.9;
  }
};

const calcularFatorTopografico = ({tipo, altura, inclinacao, posicaoLocacao}, alturaPonto) => {
  let distHorizontalTopo = altura / Math.tan(Geometry.degreesToRadians(inclinacao));
  let fatorDoTopo = calcularFatorTopograficoTopo(altura, alturaPonto, inclinacao);

  switch(tipo) {
    case "morro":
      if (posicaoLocacao <= 0 || posicaoLocacao >= distHorizontalTopo*2) return 1;
      else if (posicaoLocacao === distHorizontalTopo) return fatorDoTopo;
      else return interpolar(0, 1, distHorizontalTopo, fatorDoTopo, posicaoLocacao);
    case "talude":
      if (posicaoLocacao <= 0 || posicaoLocacao >= (distHorizontalTopo + altura * 4)) return 1;
      else if (posicaoLocacao === distHorizontalTopo) return fatorDoTopo;
      else if (posicaoLocacao > 0 && posicaoLocacao < distHorizontalTopo )
          return interpolar(0, 1, distHorizontalTopo, fatorDoTopo, posicaoLocacao);
      else if (posicaoLocacao > distHorizontalTopo && posicaoLocacao < (distHorizontalTopo + altura * 4))
          return interpolar(distHorizontalTopo, fatorDoTopo, (distHorizontalTopo + altura * 4), 1, posicaoLocacao);
  }
};

const calcularFatorTopograficoTopo = (altura, alturaPonto, inclinacao) => {
  if (inclinacao <= 3) {
    return 1;
  } else if (inclinacao > 3 && inclinacao < 6) {
    return s1AnguloEntreTresESeis(altura, alturaPonto, inclinacao);
  } else if (inclinacao >= 6 && inclinacao <= 17) {
    return s1AnguloEntreSeisEDezessete(altura, alturaPonto, inclinacao);
  } else if (inclinacao > 17 && inclinacao < 45) {
    return s1AnguloEntreDezesseteEQuarentaECinco(altura, alturaPonto, inclinacao);
  } else if (inclinacao >= 45) {
    return s1AnguloMaiorIgualAQuarentaECinco(altura, alturaPonto);
  }
};

const s1AnguloEntreTresESeis = (alturaTalude, alturaDoPonto, inclinacaoTalude) => {
  let delta = s1AnguloEntreSeisEDezessete(alturaTalude, alturaDoPonto, 6) - 1;

  return 1 + (inclinacaoTalude - 3) * (delta/3);
};

const s1AnguloEntreSeisEDezessete = (alturaTalude, alturaDoPonto, inclinacaoTalude) => {
  inclinacaoTalude = Geometry.degreesToRadians(inclinacaoTalude - 3);

  let s1 = 1 + (2.5 - (alturaDoPonto / alturaTalude)) * Math.tan(inclinacaoTalude);

  return s1 >= 1 ? s1 : 1;
};

const s1AnguloEntreDezesseteEQuarentaECinco = (alturaTalude, alturaDoPonto, inclinacaoTalude) => {
  let s1AnguloDesezzete = s1AnguloEntreSeisEDezessete(alturaTalude, alturaDoPonto, 17);

  let delta = s1AnguloMaiorIgualAQuarentaECinco(alturaTalude, alturaDoPonto) - s1AnguloDesezzete;

  return s1AnguloEntreSeisEDezessete(alturaTalude, alturaDoPonto, 17) + (inclinacaoTalude - 17) * (delta/28);
};

const s1AnguloMaiorIgualAQuarentaECinco = (alturaTalude, alturaDoPonto) => {
  let s1 = 1 + (2.5 - (alturaDoPonto/alturaTalude))*0.31;

  return s1 >= 1 ? s1 : 1;
};

/**
 *
 * Fim dos cálculos referentes à seção 5.2 da NBR 6123
 *
 */



/**
 *
 * Início dos cálculos referentes à seção 5.3 da NBR 6123, que diz respeito à determinação
 * do fator de rugosidade do terreno.
 *
 */

const getFatorRugosidade = ({ rugosidade, classeDimensoes, topografia, dimensoes, velocidadeBasica }) => {
  if (classeDimensoes > 2) return determinarFatorRugosidadePorIteracao({
    rugosidade: rugosidade,
    intervaloTempoEstimado: 15,
    topografia: topografia,
    dimensoes: dimensoes,
    velocidadeBasica: velocidadeBasica
  });

  else return calcularFatorRugosidade(rugosidade, classeDimensoes, dimensoes.altura);
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
  "B": 1.00,
  "C": 0.98,
  3: 1.00,
  5: 0.98,
  10: 0.95,
  15: 0.93,
  20: 0.90,
  30: 0.87,
  45: 0.84,
  60: 0.82,
  120: 0.77,
  300: 0.72,
  600: 0.69,
  3600: 0.65
};

const determinarFatorRugosidadePorIteracao = ({
  rugosidade,
  intervaloTempoEstimado,
  dimensoes,
  topografia,
  velocidadeBasica
}) => {
  let fatorTopografico,
    fatorRugosidade,
    velocidadeMedia,
    intervaloDeTempoCalculado,
    maiorDimensao,
    iteracoes = [];

  fatorTopografico =  getFatorTopografico(topografia, dimensoes);

  maiorDimensao = determinaMaiorDimensao(dimensoes);

  while (!compararIteracoes(iteracoes)) {
    fatorRugosidade = calcularFatorRugosidade(rugosidade, intervaloTempoEstimado, dimensoes.altura);
    velocidadeMedia = getVelocidadeMediaVento(fatorTopografico, fatorRugosidade, velocidadeBasica);
    intervaloDeTempoCalculado = getIntervaloTempo(maiorDimensao, velocidadeMedia);

    intervaloTempoEstimado = pegarProximoIntervaloDeTempo(intervaloTempoEstimado, intervaloDeTempoCalculado);

    iteracoes.push([intervaloTempoEstimado, intervaloDeTempoCalculado]);
  }

  return fatorRugosidade;
};

const determinaMaiorDimensao = ({ altura, largura, profundidade}) => {
  let maiorDimensao;

  maiorDimensao = altura >= largura ? altura : largura;
  maiorDimensao = maiorDimensao >= profundidade ? maiorDimensao : profundidade;

  return maiorDimensao;
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

/**
 *
 * Fim dos cálculos referentes a seção 5.3 da NBR6123.
 *
 */


/**
 *
 * Início dos cálculos referentes a seção 5.4 da NBR6123.
 *
 */

const FATORES_ESTATISTICOS = [
  1.1,
  1.0,
  0.95,
  0.88,
  0.83
];

const determinarFatorEstatistico = (probabilidade, anos) => {
	return 0.54*(-Math.log(1 - probabilidade) / anos) ** -0.157
};

/**
 *
 * Fim dos cálculos referentes a seção 5.4 da NBR6123.
 *
 */

/**
 *
 * Início dos cálculos referentes a seção 6. da NBR6123.
 *
 */
const getCoeficienteDeFormaParedesPlantaRetangular = ({comprimento, largura, altura}) => {
  let alturaRelativa,
      proporcaoEntreDimensoesHorizontais,
      indiceAlturaRelativa,
      coeficientesPressaoExterna;

  if (comprimento < largura) {
    let helper = largura;
    largura = comprimento;
    comprimento = helper;
  }

	alturaRelativa = altura/largura;
	proporcaoEntreDimensoesHorizontais = comprimento/largura;

	if (alturaRelativa <= 1/2) {
		indiceAlturaRelativa = 0;
	} else if (alturaRelativa <= 3/2) {
		indiceAlturaRelativa = 1;
	} else if (alturaRelativa <= 6) {
		indiceAlturaRelativa = 2;
	}

	if (proporcaoEntreDimensoesHorizontais >= 1 && proporcaoEntreDimensoesHorizontais <= 3/2) {
		coeficientesPressaoExterna = TABELA_4[indiceAlturaRelativa][0];
	}  else if (proporcaoEntreDimensoesHorizontais >= 2 && proporcaoEntreDimensoesHorizontais <= 4) {
		coeficientesPressaoExterna = TABELA_4[indiceAlturaRelativa][1];
	} else if (proporcaoEntreDimensoesHorizontais > 3/2 && proporcaoEntreDimensoesHorizontais < 2) {
		coeficientesPressaoExterna = interpolarCoeficientesDePressaoExterna(indiceAlturaRelativa, proporcaoEntreDimensoesHorizontais);
	} else {
		throw new Error('Valor inválido: faixa de valores inválidos')
	}

	coeficientesPressaoExterna.ventoAZero['a3'] = calcularA3eB3(
		proporcaoEntreDimensoesHorizontais, coeficientesPressaoExterna.ventoAZero['a2']);
	coeficientesPressaoExterna.ventoAZero['b3'] = calcularA3eB3(
		proporcaoEntreDimensoesHorizontais, coeficientesPressaoExterna.ventoAZero['b2']);

	return coeficientesPressaoExterna;
};

const calcularA3eB3 = (proporcaoDimensoeshorizontais, coefDeReferencia) => {
	if (proporcaoDimensoeshorizontais === 1) return coefDeReferencia;
	else if (proporcaoDimensoeshorizontais >= 2) return -0.2;
	else {
		return interpolar(1, coefDeReferencia, 2, -0.2, proporcaoDimensoeshorizontais);
	}
};

const interpolarCoeficientesDePressaoExterna = (indiceAlturaRelativa, proporcao) => {
	let coeficientes = { ventoAZero: {}, ventoANoventa: {} };
	let valoresParaProporcaoTresMeios = TABELA_4[indiceAlturaRelativa][0];
	let valoresParaProporcaoDois = TABELA_4[indiceAlturaRelativa][1];

	coeficientes.ventoAZero = interpolarCoeficientes(
		1.5,
		valoresParaProporcaoTresMeios.ventoAZero,
		2,
		valoresParaProporcaoDois.ventoAZero,
		proporcao
	);

	coeficientes.ventoANoventa = interpolarCoeficientes(
		1.5,
		valoresParaProporcaoTresMeios.ventoANoventa,
		2,
		valoresParaProporcaoDois.ventoANoventa,
		proporcao
	);

	return coeficientes;
};

const interpolarCoeficientes = (abs1, obj1, abs2, obj2, aCalcular) => {
	let coeficientesInterpolados = {};

	for (let val in obj1) {
		coeficientesInterpolados[val] = interpolar(abs1, obj1[val], abs2, obj2[val], aCalcular);
	};

	return coeficientesInterpolados;
};

const interpolar = (abs1, ord1, abs2, ord2, aCalcular) => {
	if (aCalcular < abs1 || aCalcular > abs2) throw new Error('Valor inválido: ' + aCalcular);

	let deltaUnitario = (ord2 - ord1) / (abs2 - abs1);

	return ord1 + (aCalcular - abs1) * deltaUnitario;
};

const TABELA_4 = [
	[
		{
			ventoAZero: {
				a1: -0.8,
				b1: -0.8,
				a2: -0.5,
				b2: -0.5,
				c: 0.7,
				d: -0.4
			},
			ventoANoventa: {
				a: 0.7,
				b: -0.4,
				c1: -0.8,
				d1: -0.8,
				c2: -0.4,
				d2: -0.4
			}
		},
		{
			ventoAZero: {
				a1: -0.8,
				b1: -0.8,
				a2: -0.4,
				b2: -0.4,
				c: 0.7,
				d: -0.3
			},
			ventoANoventa: {
				a: 0.7,
				b: -0.5,
				c1: -0.9,
				d1: -0.9,
				c2: -0.5,
				d2: -0.5
			}
		}
	],
	[
		{
			ventoAZero: {
				a1: -0.9,
				b1: -0.9,
				a2: -0.5,
				b2: -0.5,
				c: 0.7,
				d: -0.5
			},
			ventoANoventa: {
				a: 0.7,
				b: -0.5,
				c1: -0.9,
				d1: -0.9,
				c2: -0.5,
				d2: -0.5
			}
		},
		{
			ventoAZero: {
				a1: -0.9,
				b1: -0.9,
				a2: -0.4,
				b2: -0.4,
				c: 0.7,
				d: -0.3
			},
			ventoANoventa: {
				a: 0.7,
				b: -0.6,
				c1: -0.9,
				d1: -0.9,
				c2: -0.5,
				d2: -0.5
			}
		}
	],
	[
		{
			ventoAZero: {
				a1: -1.0,
				b1: -1.0,
				a2: -0.6,
				b2: -0.6,
				c: 0.8,
				d: -0.6
			},
			ventoANoventa: {
				a: 0.8,
				b: -0.6,
				c1: -1.0,
				d1: -1.0,
				c2: -0.6,
				d2: -0.6
			}
		},
		{
			ventoAZero: {
				a1: -1.0,
				b1: -1.0,
				a2: -0.5,
				b2: -0.5,
				c: 0.8,
				d: -0.3
			},
			ventoANoventa: {
				a: 0.8,
				b: -0.6,
				c1: -1.0,
				d1: -1.0,
				c2: -0.6,
				d2: -0.6
			}
		}
	]
];

const getCoeficienteDePressaoInterna = (
  { tipo, faces, secao, areaAberturaDominante, somaAreaOutrasAberturas },
	coefsPressaoExterna
) => {
  if (tipo === "faces opostas") {
    switch (faces) {
      case "frente-tras":
        return {
          ventoAZero: 0.2,
          ventoANoventa: -0.3
        };
      case "laterais":
        return {
          ventoANoventa: 0.2,
          ventoAZero: -0.3
        };
      default:
        throw new Error("O valor de entrada para faces permeáveis não é válido: " + faces);
    }
  } else if (tipo === "quatro faces") {
    return [0, -0.3]
  } else if (tipo === "abertura dominante") {
    return calcularIndicePressaoInternaAberturaDominante(
      areaAberturaDominante,
      somaAreaOutrasAberturas,
      secao,
      coefsPressaoExterna
    )
  } else {
    throw new Error("O valor de entrada para tipo de permeabilidade não é válido :" + tipo);
  }
};

const calcularIndicePressaoInternaAberturaDominante = (
	 areaAberturaDominante,
	 areaOutrasAberturas,
	 secao,
	 coefsPressaoExterna
) => {
	const coeficientes = {
		ventoAZero: 0,
		ventoANoventa: 0
	};
	const proporcaoAberturas = areaAberturaDominante / areaOutrasAberturas;

	coeficientes.ventoAZero = IndicePressaoInternaAberturaDominanteVentoAZero(
		  secao, proporcaoAberturas, coefsPressaoExterna.ventoAZero);
	coeficientes.ventoANoventa = IndicePressaoInternaAberturaDominanteVentoANoventa(
		  secao, proporcaoAberturas, coefsPressaoExterna.ventoANoventa);

	return coeficientes;
};

const IndicePressaoInternaAberturaDominanteVentoAZero = (
	secao,
	proporcaoAberturas,
	coefsPressaoExterna
) => {

	secao = new RegExp(/c/).test(secao) ? 'c' : secao;
	secao = new RegExp(/d/).test(secao) ? 'd' : secao;

	switch(secao) {
		case 'c':
			return coefPressaoInternaBarlavento(proporcaoAberturas);
		case 'a1':
			return coefPressaoInternaAltaSuccao(proporcaoAberturas);
		case 'b1':
			return coefPressaoInternaAltaSuccao(proporcaoAberturas);
		case 'a2':
			return coefPressaoInternaBaixaSuccao('a2', coefsPressaoExterna);
		case 'b2':
			return coefPressaoInternaBaixaSuccao('b2', coefsPressaoExterna);
		case 'a3':
			return coefPressaoInternaBaixaSuccao('a3', coefsPressaoExterna);
		case 'b3':
			return coefPressaoInternaBaixaSuccao('b3', coefsPressaoExterna);
		case 'd':
			return coefPressaoInternaSotavento('d', coefsPressaoExterna);
		default:
			throw new Error('Seção de pressão externa inválida: ' + secao);
	}
};

const IndicePressaoInternaAberturaDominanteVentoANoventa = (
	secao,
	proporcaoAberturas,
	coefsPressaoExterna
) => {

	secao = new RegExp(/a/).test(secao) ? 'a' : secao;
	secao = new RegExp(/b/).test(secao) ? 'b' : secao;

	switch(secao) {
		case 'a':
			return coefPressaoInternaBarlavento(proporcaoAberturas);
		case 'c1':
			return coefPressaoInternaAltaSuccao(proporcaoAberturas);
		case 'd1':
			return coefPressaoInternaAltaSuccao(proporcaoAberturas);
		case 'c2':
			return coefPressaoInternaBaixaSuccao('c2', coefsPressaoExterna);
		case 'd2':
			return coefPressaoInternaBaixaSuccao('d2', coefsPressaoExterna);
		case 'b':
			return coefPressaoInternaSotavento('b', coefsPressaoExterna);
		default:
			throw new Error('Seção de pressão externa inválida: ' + secao);
	}
};

const coefPressaoInternaBarlavento = (proporcaoAbertura) => {
	if (proporcaoAbertura === 1) {
		return 0.1;
	} else if (proporcaoAbertura === 1.5) {
		return 0.3;
	} else if (proporcaoAbertura === 2) {
		return 0.5;
	} else if (proporcaoAbertura === 3) {
		return 0.6;
	} else if (proporcaoAbertura >= 6) {
		return 0.8;
	}
};

const coefPressaoInternaSotavento = (
	secao,
  coeficientes
) => {
	return coeficientes[secao];
};

const coefPressaoInternaAltaSuccao = (
	proporcaoAbertura
) => {
	if (proporcaoAbertura === 0.25) {
		return -0.4;
	} else if (proporcaoAbertura === 0.50) {
		return -0.5;
	} else if (proporcaoAbertura === 0.75) {
		return -0.6;
	} else if (proporcaoAbertura === 1) {
		return -0.7;
	} else if (proporcaoAbertura === 1.5) {
		return -0.8;
	} else if (proporcaoAbertura >= 3) {
		return -0.9;
	}
};

const coefPressaoInternaBaixaSuccao = (
	secao,
	coeficientes
) => {
	return coeficientes[secao];
};


//	Tabela 5 - coeficientes de pressão e de forma, externos, para telhados com duas águas, simétricos,
//	em edificações de planta retangular
const TABELA_5 = [
	[
		{
			ventoAZero: {
				frente: -0.8,
				tras: -0.4
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.4
			}
		},
		{
			//	teta = 5°
			ventoAZero: {
				frente: -0.8,
				tras: -0.4
			},
			ventoANoventa: {
				esquerda: -0.9,
				direita: -0.4
			}
		},
		{
			//	teta = 10°
			ventoAZero: {
				frente: -0.8,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -1.2,
				direita: -0.4
			}
		},
		{
			//	teta = 15°
			ventoAZero: {
				frente: -0.8,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -1.0,
				direita: -0.4
			}
		},
		{
			//	teta = 20°
			ventoAZero: {
				frente: -0.7,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -0.4,
				direita: -0.4
			}
		},
		{
			//	teta = 30°
			ventoAZero: {
				frente: -0.7,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: 0,
				direita: -0.4
			}
		},
		{
			//	teta = 45°
			ventoAZero: {
				frente: -0.7,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: 0.3,
				direita: -0.5
			}
		},
		{
			//	teta = 60°
			ventoAZero: {
				frente: -0.7,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: 0.7,
				direita: -0.6
			}
		}
	],
	[
		{
			//	teta = 0°
			ventoAZero: {
				frente: -1.0,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.6
			}
		},
		{
			//	teta = 5°
			ventoAZero: {
				frente: -0.9,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -0.9,
				direita: -0.6
			}
		},
		{
			//	teta = 10°
			ventoAZero: {
				frente: -0.8,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -1.1,
				direita: -0.6
			}
		},
		{
			//	teta = 15°
			ventoAZero: {
				frente: -0.8,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -1.0,
				direita: -0.6
			}
		},
		{
			//	teta = 20°
			ventoAZero: {
				frente: -0.8,
				tras: -0.6
			},
			ventoANoventa: {
				esquerda: -0.7,
				direita: -0.5
			}
		},
		{
			//	teta = 30°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: -0.2,
				direita: -0.5
			}
		},
		{
			//	teta = 45°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: 0.2,
				direita: -0.5
			}
		},
		{
			//	teta = 60°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: 0.6,
				direita: -0.5
			}
		}
	],
	[
		{
			//	teta = 0°
			ventoAZero: {
				frente: -0.9,
				tras: -0.7
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.6
			}
		},
		{
			//	teta = 5°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.6
			}
		},
		{
			//	teta = 10°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.6
			}
		},
		{
			//	teta = 15°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.6
			}
		},
		{
			//	teta = 20°
			ventoAZero: {
				frente: -0.8,
				tras: -0.8
			},
			ventoANoventa: {
				esquerda: -0.8,
				direita: -0.6
			}
		},
		{
			//	teta = 30°
			ventoAZero: {
				frente: -0.8,
				tras: -0.7
			},
			ventoANoventa: {
				esquerda: -1.0,
				direita: -0.5
			}
		},
		{
			//	teta = 40°
			ventoAZero: {
				frente: -0.8,
				tras: -0.7
			},
			ventoANoventa: {
				esquerda: -0.2,
				direita: -0.5
			}
		},
		{
			//	teta = 50°
			ventoAZero: {
				frente: -0.8,
				tras: -0.7
			},
			ventoANoventa: {
				esquerda: 0.2,
				direita: -0.5
			}
		},
		{
			//	teta = 60°
			ventoAZero: {
				frente: -0.8,
				tras: -0.7
			},
			ventoANoventa: {
				esquerda: 0.2,
				direita: -0.5
			}
		}
	]
];

const getCoefsPressaoExternaTelhado = ({
	inclinacaoTelhado,
	altura,
	largura
}) => {
	let indiceAlturaRelativa;

	if (altura/largura <= 0.5) indiceAlturaRelativa = 0;
	else if (altura/largura > 0.5 && altura/largura <= 3/2) indiceAlturaRelativa = 1;
	else if (altura/largura > 3/2 && altura/largura <= 6) indiceAlturaRelativa = 2;
	else {
		throw new Error('Altura fora da faixa aceitável: ' + altura);
	}

	return TABELA_5[indiceAlturaRelativa][getIndiceAngulo(indiceAlturaRelativa, inclinacaoTelhado)];
};

const getIndiceAngulo = (
	indiceAlturaRelativa,
	angulo
) => {
	if (indiceAlturaRelativa === 0 || indiceAlturaRelativa === 1) {
		switch(angulo) {
			case 0:
				return 0;
			case 5:
				return 1;
			case 10:
				return 2;
			case 15:
				return 3;
			case 20:
				return 4;
			case 30:
				return 5;
			case 45:
				return 6;
			case 60:
				return 7;
			default:
				throw new Error('angulo inválido: ' + angulo);
		}
	} else if (indiceAlturaRelativa === 2) {
		switch(angulo) {
			case 0:
				return 0;
			case 5:
				return 1;
			case 10:
				return 2;
			case 15:
				return 3;
			case 20:
				return 4;
			case 30:
				return 5;
			case 40:
				return 6;
			case 50:
				return 7;
			case 60:
				return 8;
			default:
				throw new Error('angulo inválido: ' + angulo);
		}
	}
};

/**
 *
 * fim dos cálculos referentes a seção 6. da NBR6123.
 *
 */

const pegarCoeficientesDePressao = ({
    velocidadeBasica,
    topografia,
    rugosidade,
    classeDimensoes,
    fatorEstatistico,
    permeabilidade,
    dimensoes
}) => {
	let fatorTopografico = getFatorTopografico(topografia, dimensoes);

	let fatorRugosidade = getFatorRugosidade({
    rugosidade,
    classeDimensoes,
    topografia,
    dimensoes,
    velocidadeBasica
  });

	fatorEstatistico = FATORES_ESTATISTICOS[fatorEstatistico];

	let velocidadeCatacteristica = getVelocidadeCaracteristica({
		velocidadeBasica,
		fatorTopografico,
		fatorRugosidade,
		fatorEstatistico
	});

	let pressaoDinamica = getPressaoDinamica(velocidadeCatacteristica);

	let coefsPressaoExternaParedes = getCoeficienteDeFormaParedesPlantaRetangular(dimensoes);

	let coefsPressaoExternaTelhado = getCoefsPressaoExternaTelhado(dimensoes);

	let coefPressaoInterna = getCoeficienteDePressaoInterna(
	  permeabilidade,
    coefsPressaoExternaParedes
  );

	return {
		pressaoDinamica: pressaoDinamica/1000,
		coefsPressaoExternaParedes,
		coefsPressaoExternaTelhado,
		coefPressaoInterna
	}
};

const getCoeficientesEfetivosDePressao = ({
	tipoPermeabilidade,
	coefPressaoExternaParede,
	coefPressaoExternaTelhado,
	coefPressaoInterna
}) => {
	if (tipoPermeabilidade === 'abertura dominante' || "faces opostas") {
		return {
			ventoAZero: {
				paredeEsquerda: coefPressaoExternaParede.ventoAZero['a1'] - coefPressaoInterna.ventoAZero,
				paredeDireita: coefPressaoExternaParede.ventoAZero['b1'] - coefPressaoInterna.ventoAZero,
				telhadoEsquerdo: coefPressaoExternaTelhado.ventoAZero.frente - coefPressaoInterna.ventoAZero,
        telhadoDireito: coefPressaoExternaTelhado.ventoAZero.frente - coefPressaoInterna.ventoAZero
      },
			ventoANoventa: {
				paredeEsquerda: coefPressaoExternaParede.ventoANoventa['a'] - coefPressaoInterna.ventoANoventa,
				paredeDireita: coefPressaoExternaParede.ventoANoventa['b'] - coefPressaoInterna.ventoANoventa,
				telhadoEsquerdo: coefPressaoExternaTelhado.ventoANoventa.esquerda - coefPressaoInterna.ventoANoventa,
				telhadoDireito: coefPressaoExternaTelhado.ventoANoventa.direita - coefPressaoInterna.ventoANoventa
			}
		}
	}

	if (tipoPermeabilidade === 'quatro faces') {
		return [
      {
      	coeficientePressaoInterna: 0,
				ventoAZero: {
					paredeEsquerda: coefPressaoExternaParede.ventoAZero['a1'],
					paredeDireita: coefPressaoExternaParede.ventoAZero['b1'],
					telhadoEsquerdo: coefPressaoExternaTelhado.ventoAZero.frente,
					telhadoDireito: coefPressaoExternaTelhado.ventoAZero.frente
      },
				ventoANoventa: {
					paredeEsquerda: coefPressaoExternaParede.ventoANoventa['a'],
					paredeDireita: coefPressaoExternaParede.ventoANoventa['b'],
					telhadoEsquerdo: coefPressaoExternaTelhado.ventoANoventa.esquerda,
					telhadoDireito: coefPressaoExternaTelhado.ventoANoventa.direita
      }
    },
    {
      coeficientePressaoInterna: -0.3,
      ventoAZero: {
        paredeEsquerda: coefPressaoExternaParede.ventoAZero['a1'] - (-0.3),
        paredeDireita: coefPressaoExternaParede.ventoAZero['b1'] - (-0.3),
        telhadoEsquerdo: coefPressaoExternaTelhado.ventoAZero.frente - (-0.3),
        telhadoDireito: coefPressaoExternaTelhado.ventoAZero.frente - (-0.3)
      },
      ventoANoventa: {
        paredeEsquerda: coefPressaoExternaParede.ventoANoventa['a'] - (-0.3),
        paredeDireita: coefPressaoExternaParede.ventoANoventa['b'] - (-0.3),
        telhadoEsquerdo: coefPressaoExternaTelhado.ventoANoventa.esquerda - (-0.3),
        telhadoDireito: coefPressaoExternaTelhado.ventoANoventa.direita - (-0.3)
      }
    }
		];
	}
};

module.exports = {
	interpolar: interpolar,
	interpolarCoeficientes: interpolarCoeficientes,
	pegarCoeficientesDePressao: pegarCoeficientesDePressao,
};


