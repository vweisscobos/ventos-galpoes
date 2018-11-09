const Topografia = require("./topografia");
const RugosidadeTerreno = require('./rugosidadeTerreno');
const FatorEstatistico = require('./fatorEstatistico');
const GetCoeficientePressao = require('./coeficientesDePressao');

const getFatorTopografico = ( topografia, dimensoes ) => {
  if (topografia["tipo"])
      return Topografia.calcularFatorTopografico(topografia, dimensoes.altura);

  return Topografia.FATORES_FIXOS[topografia];
};

const getVelocidadeCaracteristica = ({velocidadeBasica, fatorTopografico, fatorRugosidade, fatorEstatistico}) => {
  return velocidadeBasica * fatorTopografico * fatorRugosidade * fatorEstatistico;
};

const getPressaoDinamica = (velocidadeCaracteristica) => {
	return 0.613*(velocidadeCaracteristica ** 2);
};

const getFatorRugosidade = ({ rugosidade, classeDimensoes, topografia, dimensoes, velocidadeBasica }, fatorTopografico) => {
  if (classeDimensoes > 2) return RugosidadeTerreno.determinarFatorRugosidadePorIteracao({
    rugosidade,
    intervaloTempoEstimado: 15,
    topografia,
    dimensoes,
    velocidadeBasica,
    fatorTopografico
  });

  else return RugosidadeTerreno.calcularFatorRugosidade(rugosidade, classeDimensoes, dimensoes.altura);
};

const getCoeficientesDePressao = ({
    velocidadeBasica,
    topografia,
    rugosidade,
    classeDimensoes,
    fatorEstatistico,
    permeabilidade,
    dimensoes
}) => {
	let fatorTopografico = getFatorTopografico(topografia, dimensoes);

	let fatorRugosidade = getFatorRugosidade(
	  {
      rugosidade,
      classeDimensoes,
      topografia,
      dimensoes,
      velocidadeBasica
    },
    fatorTopografico
  );

	fatorEstatistico = FatorEstatistico.VALORES_TABELADOS[fatorEstatistico];

	let velocidadeCatacteristica = getVelocidadeCaracteristica({
		velocidadeBasica,
		fatorTopografico,
		fatorRugosidade,
		fatorEstatistico
	});

	let pressaoDinamica = getPressaoDinamica(velocidadeCatacteristica);

	let coefsPressaoExternaParedes = GetCoeficientePressao.externaParedesPlantaRetangular(dimensoes);

	let coefsPressaoExternaTelhado = GetCoeficientePressao.externaTelhado(dimensoes);

	let coefPressaoInterna = GetCoeficientePressao.interna(
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
  console.log(tipoPermeabilidade, coefPressaoExternaParede, coefPressaoExternaTelhado, coefPressaoInterna);

	if (tipoPermeabilidade === 'abertura dominante' || tipoPermeabilidade === "faces opostas") {
		return [{
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
		}]
	} else if (tipoPermeabilidade === 'quatro faces') {
	  console.log(coefPressaoExternaParede.ventoAZero['a1']);

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
	} else {
	  throw new Error("Tipo inválido de permeabilidade" + tipoPermeabilidade);
  }
};

module.exports = {
  getCoeficientesEfetivosDePressao,
  getCoeficientesDePressao
};


