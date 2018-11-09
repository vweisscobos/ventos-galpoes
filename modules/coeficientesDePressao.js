const Utils = require("./utils");

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

const externaParedesPlantaRetangular = ({comprimento, largura, altura}) => {
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
    return Utils.interpolar(1, coefDeReferencia, 2, -0.2, proporcaoDimensoeshorizontais);
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
    coeficientesInterpolados[val] = Utils.interpolar(abs1, obj1[val], abs2, obj2[val], aCalcular);
  }

  return coeficientesInterpolados;
};

const interna = (
  { tipo, faces, secaoSelecionada, areaAberturaDominante, areaOutrasAberturas },
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
      areaOutrasAberturas,
      secaoSelecionada,
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
  } else {
    
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

const externaTelhado = ({
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


module.exports = {
  externaParedesPlantaRetangular,
  externaTelhado,
  interna
};