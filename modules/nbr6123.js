const Geometry = require('./geometry');

// const categorias = [
//   [1, 'Mar calmo, lagos, rios, pântanos'],
//   [2, 'Zonas costeiras planas, campos de aviação, pântanos com vegetação rala, pradarias e charnecas, fazendas sem sebes ou muro.'],
//   [3, 'Granjas e casas de campo, fazendas com sebes e/ou muros, subúrbios com casas baixas e esparsas com obstáculos de até 3,0m'],
//   [4, 'Parques e bosques com muitas árvores, cidades pequenas, subúrbios densamente construídos, áreas industriais plena ou parcialmente desenvolvidas com obstáculos de cota média de 10,0m'],
//   [5, 'Florestas com árvores altas, centros de grandes cidades, com cotas de topo média igual ou superior a 25,0,']
// ];
//
// const classes = [
//   ['A', 'Toda edificação na qual a maior dimensão horizontal ou vertical não exceda os 20m.'],
//   ['B', 'Toda edificação na qual a maior dimensão horizonal ou vertical da superfície frontal esteja entre 20m e 50m.'],
//   ['C', 'Toda edificação na qual a maior dimensão horizontal ou vertical da superfície frontal não exceda 50m.']
// ];
//
// const grausDeSeguranca = [
//   [1, "Edificações cuja ruína total ou parcial pode afetar a segurança ou possibilidade de socorro a pessoas após uma tempestade destrutiva (hospitais, quartéis de bombeiros, centrais de comunicação, etc.)"],
//   [2, "Edificações para hotéis e residências. Edificações para comércio e indústria com alto fator de ocupação."],
//   [3, "Edificações e instalações industriais com baixo fator de ocupação (depósitos, silos, construções rurais, ect.)"],
//   [4, "Vedações (telhados, vidros, painéis de vedação, etc)"],
//   [5, "Edificações temporárias. Estruturas dos grupos 1 e 3 durante a construção"]
// ];



/**
 *
 * Início dos cálculos referentes à seção 4.2 da NBR 6123, que diz respeito à determinação das forças estáticas
 * devido ao vento
 *
 */
const getVelocidadeBasica = (lng, lat) => {

};

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
const tiposDeRelevo = [
  {
    //  0
    descricao: "Terreno plano ou fracamente acidentado",
    getFator() {
      return 1;
    }
  },
  {
    //  1
    descricao: "Vales protegidos",
    getFator() {
      return 0.9;
    }
  },
  {
    //  2
    descricao: "Edificação no pé do morro ou do talude",
    getFator() {
      return 1;
    }
  },
  {
    //  3
    descricao: "Edificação após o topo do talude com uma distancia maior ou igual a 4 vezes a altura deste",
    getFator() {
      return 1;
    }
  },
  {
    //  4
    descricao: "Edificação sobre o talude",
    getFator(alturaTalude, alturaDoPonto, inclinacaoTalude) {
      if (inclinacaoTalude <= 3) {
        return 1;
      } else if (inclinacaoTalude > 3 && inclinacaoTalude < 6) {
        return s1AnguloEntreTresESeis(alturaTalude, alturaDoPonto, inclinacaoTalude);
      } else if (inclinacaoTalude >= 6 && inclinacaoTalude <= 17) {
        return s1AnguloEntreSeisEDezessete(alturaTalude, alturaDoPonto, inclinacaoTalude);
      } else if (inclinacaoTalude > 17 && inclinacaoTalude < 45) {
        return s1AnguloEntreDezesseteEQuarentaECinco(alturaTalude, alturaDoPonto, inclinacaoTalude);
      } else if (inclinacaoTalude >= 45) {
        return s1AnguloMaiorIgualAQuarentaECinco(alturaTalude, alturaDoPonto);
      }
    }
  }
];

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

const getFatorTopografico = (index, alturaTalude, alturaDoPonto, inclinacaoTalude) => {
  return tiposDeRelevo[index].getFator(alturaTalude, alturaDoPonto, inclinacaoTalude);
};

const getIndiceTipoDeRelevo = (tipoDeRelevo) => {
	switch(tipoDeRelevo) {
		case "Terreno plano ou fracamente acidentado":
			return 0;
		case "Vales protegidos":
			return 1;
		case "Edificação no pé do morro ou do talude":
			return 2;
		case "Edificação após o topo do talude com uma distancia maior ou igual a 4 vezes a altura deste":
			return 3;
		case "Edificação sobre o talude":
			return 4;
		default:
			throw new Error("Tipo de terreno inválido: " + tipoDeRelevo);
	}
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

const parametrosMeteorologicos = [
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

const getParametrosMeteorologicos = (categoria, intervaloTempo) => {
  let indiceCategoria = getIndiceCategoria(categoria);
  let indiceClasse = getIndiceParametrosMeteorologicos(intervaloTempo);

  return {
		p: parametrosMeteorologicos[indiceCategoria]['parametros']['p'][indiceClasse],
		b: parametrosMeteorologicos[indiceCategoria]['parametros']['b'][indiceClasse]
	};
};

const getIndiceParametrosMeteorologicos = (intervalo) => {
	switch(intervalo) {
		case "A":
			return 0;
		case 3:
			return 0;
		case "B":
			return 1;
		case 5:
			return 1;
		case "C":
			return 2;
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
		case 120:
			return 8;
		case 300:
			return 9;
		case 600:
			return 10;
		case 3600:
			return 11;
		default:
			throw new Error('Classe inválida: ' + classe);
	}
};

const getIndiceCategoria = (categoria) => {
  switch(categoria) {
    case "I":
      return 0;
    case "II":
      return 1;
    case "III":
      return 2;
		case "IV":
      return 3;
    case "V":
      return 4;
    default:
      throw new Error('Categoria inválida: ' + categoria);
  }
};

const getFatorDeRajada = (classe) => {
  switch(classe) {
    case "A":
			return 1.00;
    case 3:
      return 1.00;
    case "B":
			return 0.98;
    case 5:
      return 0.98;
    case "C":
			return 0.95;
    case 10:
      return 0.95;
		case 15:
			return 0.93;
		case 20:
			return 0.90;
		case 30:
			return 0.87;
		case 45:
			return 0.84;
		case 60:
			return 0.82;
		case 120:
			return 0.77;
		case 300:
			return 0.72;
		case 600:
			return 0.69;
		case 3600:
			return 0.65;
    default:
      throw new Error('Classe inválida: ' + classe);
  }
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

const getFatorRugosidade = (categoria, intervaloTempo, alturaDoPonto) => {
  let parametrosMeteorologicos = getParametrosMeteorologicos(categoria, intervaloTempo);
  let fatorDeRajada = getFatorDeRajada(intervaloTempo);

  return parametrosMeteorologicos.b * fatorDeRajada * ((alturaDoPonto/10) ** parametrosMeteorologicos.p);
};

const getVelocidadeMediaVento = (fatorTopografico, fatorRugosidade, velBasica) => {
	return fatorTopografico * fatorRugosidade * velBasica;
};

const getIntervaloTempo = (maiorDimensao, velocidadeMediaVento) => {
	return 7.5 * ( maiorDimensao / velocidadeMediaVento );
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

const determinarFatorRugosidadePorIteracao = ({
	categoria,
	intervaloTempoEstimado,
	maiorDimensao,
	alturaDoPonto,
	indiceTipoDeRelevo,
	inclinacaoDoTalude,
	alturaDoTalude,
	velocidadeBasica
}) => {
	let fatorTopografico = getFatorTopografico(1, alturaDoTalude, alturaDoPonto, inclinacaoDoTalude),
			fatorRugosidade,
			velocidadeMedia,
			intervaloDeTempoCalculado,
			iteracoes = [];

	while (!compararIteracoes(iteracoes)) {
		fatorRugosidade = fatorRugosidade = getFatorRugosidade(categoria, intervaloTempoEstimado, alturaDoPonto);
		velocidadeMedia = getVelocidadeMediaVento(fatorTopografico, fatorRugosidade, velocidadeBasica);
		intervaloDeTempoCalculado = getIntervaloTempo(maiorDimensao, velocidadeMedia);

		intervaloTempoEstimado = pegarProximoIntervaloDeTempo(intervaloTempoEstimado, intervaloDeTempoCalculado);

		iteracoes.push([intervaloTempoEstimado, intervaloDeTempoCalculado]);
	}

	return fatorRugosidade;
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

const getFatorEstatistico = (grupo) => {
  switch (grupo) {
    case 1:
      return 1.1;
    case 2:
      return 1.0;
    case 3:
      return 0.95;
    case 4:
      return 0.88;
    case 5:
      return 0.83;
    default:
      throw new Error("Grau de segurança inválido");
  }
};

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
const getCoeficientesDePressaoEForma = ({ a, b, h, nAguas, angVento, angTelhado }) => {

};

const getCoeficienteDeFormaParedesPlantaRetangular = ({comprimento, largura, altura}) => {
	let alturaRelativa = altura/largura,
			proporcaoEntreDimensoesHorizontais = comprimento/largura,
			indiceAlturaRelativa,
			coeficientesPressaoExterna;

	if (alturaRelativa <= 1/2) {
		indiceAlturaRelativa = 0;
	} else if (alturaRelativa <= 3/2) {
		indiceAlturaRelativa = 1;
	} else if (alturaRelativa <= 6) {
		indiceAlturaRelativa = 2;
	}

	if (proporcaoEntreDimensoesHorizontais >= 1 && proporcaoEntreDimensoesHorizontais <= 3/2) {
		coeficientesPressaoExterna = tabela4[indiceAlturaRelativa][0];
	}  else if (proporcaoEntreDimensoesHorizontais >= 2 && proporcaoEntreDimensoesHorizontais <= 4) {
		coeficientesPressaoExterna = tabela4[indiceAlturaRelativa][1];
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
	let valoresParaProporcaoTresMeios = tabela4[indiceAlturaRelativa][0];
	let valoresParaProporcaoDois = tabela4[indiceAlturaRelativa][1];

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

const tabela4 = [
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

const getCoeficienteDePressaoInterna = ({
	tipoPermeabilidade,
	areaAberturaDominante,
	areaOutrasAberturas,
	secaoDaAbertura,
	coefsPressaoExterna
}) => {
	switch(tipoPermeabilidade) {
		case "faces opostas frente permeável":
			return {
				ventoAZero: 0.2,
				ventoANoventa: -0.3
			};
    case "faces opostas lateral permeável":
      return {
      	ventoANoventa: 0.2,
				ventoAZero: -0.3
      };
		case "quatro faces":
			return [0, -0.3];
		case "abertura dominante":
			return calcularIndicePressaoInternaAberturaDominante(
				areaAberturaDominante,
				areaOutrasAberturas,
				secaoDaAbertura,
				coefsPressaoExterna
			);
		default:
			throw new Error("Tipo inválido de permeabilidade: " + tipoPermeabilidade);
	}
};

const calcularIndicePressaoInternaAberturaDominante = (
	 areaAberturaDominante,
	 areaOutrasAberturas,
	 secaoDaAbertura,
	 coefsPressaoExterna
) => {
	const coeficientes = {
		ventoAZero: 0,
		ventoANoventa: 0
	};
	const proporcaoAberturas = areaAberturaDominante / areaOutrasAberturas;

	coeficientes.ventoAZero = IndicePressaoInternaAberturaDominanteVentoAZero(
		secaoDaAbertura, proporcaoAberturas, coefsPressaoExterna.ventoAZero);
	coeficientes.ventoANoventa = IndicePressaoInternaAberturaDominanteVentoANoventa(
		secaoDaAbertura, proporcaoAberturas, coefsPressaoExterna.ventoANoventa);

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
const tabela5 = [
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
	angulo,
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

	return tabela5[indiceAlturaRelativa][getIndiceAngulo(indiceAlturaRelativa, angulo)];
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
	tipoDeRelevo,
	alturaTalude,
	alturaDoPonto,
	inclinacaoTalude,
	categoria,
	intervaloTempo,
	grupo,
	comprimento,
	largura,
	altura,
	anguloTelhado,
	tipoPermeabilidade,
	areaAberturaDominante,
	areaOutrasAberturas,
	secaoDaAbertura
}) => {
	let s1 = getFatorTopografico(
		tipoDeRelevo,
		alturaTalude,
		alturaDoPonto,
		inclinacaoTalude
	);
	let s2 = getFatorRugosidade(
		categoria,
		intervaloTempo,
		alturaDoPonto
	);
	let s3 = getFatorEstatistico(grupo);

	let velocidadeCatacteristica = getVelocidadeCaracteristica({
		velocidadeBasica: velocidadeBasica,
		fatorTopografico: s1,
		fatorRugosidade: s2,
		fatorEstatistico: s3
	});

	let pressaoDinamica = getPressaoDinamica(velocidadeCatacteristica);

	let coeficientesPressaoExternaParede = getCoeficienteDeFormaParedesPlantaRetangular({
		comprimento: comprimento,
		largura: largura,
		altura: altura
	});

	let coeficientesPressaoExternaTelhado = getCoefsPressaoExternaTelhado({
		angulo: anguloTelhado,
		altura: altura,
		largura: largura
	});

	let coeficientesDePressaoInterna = getCoeficienteDePressaoInterna({
		tipoPermeabilidade: tipoPermeabilidade,
		areaAberturaDominante: areaAberturaDominante,
		areaOutrasAberturas: areaOutrasAberturas,
		secaoDaAbertura: secaoDaAbertura,
		coefsPressaoExterna: coeficientesPressaoExternaParede
	});

	return {
		pressaoDinamica: pressaoDinamica/1000,
		coefPressaoExternaParedes: coeficientesPressaoExternaParede,
		coefPressaoExternaTelhado: coeficientesPressaoExternaTelhado,
		coefPressaoInterna: coeficientesDePressaoInterna
	}
};

const getCoeficientesEfetivosDePressao = ({
	tipoPermeabilidade,
	coefPressaoExternaParede,
	coefPressaoExternaTelhado,
	coefPressaoInterna
}) => {
	if (tipoPermeabilidade === 'abertura dominante' || new RegExp(/faces opostas/).test(tipoPermeabilidade)) {
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
  getFatorTopografico: getFatorTopografico,
  getFatorRugosidade: getFatorRugosidade,
  getFatorEstatistico: getFatorEstatistico,
	determinarFatorRugosidadePorIteracao: determinarFatorRugosidadePorIteracao,
	getCoeficienteDeFormaParedesPlantaRetangular: getCoeficienteDeFormaParedesPlantaRetangular,
	getCoeficienteDePressaoInterna: getCoeficienteDePressaoInterna,
	interpolar: interpolar,
	interpolarCoeficientes: interpolarCoeficientes,
	getCoefsPressaoExternaTelhado: getCoefsPressaoExternaTelhado,
	pegarCoeficientesDePressao: pegarCoeficientesDePressao,
	getCoeficientesEfetivosDePressao: getCoeficientesEfetivosDePressao
};


