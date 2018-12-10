const Topografia = require("./topografia");
const RugosidadeDimensoesEAltura = require('./rugosidadeDimensoesEAltura');
const FatorEstatistico = require('./fatorEstatistico');
const GetCoeficientePressao = require('./coeficientesDePressao');

const getFatorTopografico = ( topografia, altura ) => {
  if (topografia["tipo"])
      return Topografia.calcularFatorTopografico(topografia, altura);

  return Topografia.FATORES_FIXOS[topografia];
};

const getVelocidadeCaracteristica = ({velocidadeBasica, fatorTopografico, fatorRugosidade, fatorEstatistico}) => {
  return velocidadeBasica * fatorTopografico * fatorRugosidade * fatorEstatistico;
};

const getPressaoDinamica = (velocidadeCaracteristica) => {
	return 0.613*(velocidadeCaracteristica ** 2);
};

const getClasseDimensoes = (maiorDimensao) => {
  if (maiorDimensao <= 20) return 0;
  if (maiorDimensao >= 20 &&  maiorDimensao <= 50) return 1;
  if (maiorDimensao > 50 &&  maiorDimensao <= 80) return 2;
  if (maiorDimensao > 80) return 3;
};

const getFatorRugosidade = ({
	rugosidade,
	topografia,
	velocidadeBasica,
	alturaPonto,
	fatorTopografico,
	maiorDimensao
}) => {
  let classeDimensoes = getClasseDimensoes(maiorDimensao);

  if (classeDimensoes > 2) return RugosidadeDimensoesEAltura.determinarFatorRugosidadePorIteracao({
    rugosidade,
    intervaloTempoEstimado: 15,
    topografia,
    maiorDimensao,
    alturaPonto,
    velocidadeBasica,
    fatorTopografico
  });

  else return RugosidadeDimensoesEAltura.calcularFatorRugosidade(rugosidade, classeDimensoes, alturaPonto);
};

const maiorValor = (...valores) => {
	let maior = valores[0];

	for (let valor of valores) if (valor > maior) maior = valor;

	return maior;
};

const getInfosVento = ({ topografia, dimensoes, rugosidade, velocidadeBasica, fatorEstatistico }) => {
  let fatorTopografico = getFatorTopografico(topografia, dimensoes.altura);

  let fatorRugosidade = {
    ventoAZero: getFatorRugosidade({
      rugosidade,
      topografia,
      alturaPonto: dimensoes.altura,
      maiorDimensao: maiorValor(dimensoes.altura, dimensoes.largura),
      velocidadeBasica,
      fatorTopografico
    }),
    ventoANoventa: getFatorRugosidade({
      rugosidade,
      topografia,
      alturaPonto: dimensoes.altura,
      maiorDimensao: maiorValor(dimensoes.altura, dimensoes.comprimento),
      velocidadeBasica,
      fatorTopografico
    })
  };

  fatorEstatistico = FatorEstatistico.VALORES_TABELADOS[fatorEstatistico];

  let velocidadeCatacteristica = {
    ventoANoventa: getVelocidadeCaracteristica({
      velocidadeBasica,
      fatorTopografico,
      fatorRugosidade: fatorRugosidade.ventoANoventa,
      fatorEstatistico
    }),
    ventoAZero: getVelocidadeCaracteristica({
      velocidadeBasica,
      fatorTopografico,
      fatorRugosidade: fatorRugosidade.ventoAZero,
      fatorEstatistico
    })
  };

  let pressaoDinamica = {
    ventoANoventa: getPressaoDinamica(velocidadeCatacteristica.ventoANoventa),
    ventoAZero: getPressaoDinamica(velocidadeCatacteristica.ventoAZero)
  };

  return {
  	pressaoDinamica,
		velocidadeCatacteristica,
		fatorTopografico,
		fatorRugosidade,
		fatorEstatistico
	}
};

const getCoeficientesDePressao = ({
    permeabilidade,
    dimensoes
}) => {
	let coefsPressaoExternaParedes = GetCoeficientePressao.externaParedesPlantaRetangular(dimensoes);

	let coefsPressaoExternaTelhado = GetCoeficientePressao.externaTelhado(dimensoes);

	let coefPressaoInterna = GetCoeficientePressao.interna(
	  permeabilidade,
    coefsPressaoExternaParedes
  );

	return {
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
	getInfosVento,
  getCoeficientesEfetivosDePressao,
  getCoeficientesDePressao
};

