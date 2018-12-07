const Utils = require("./utils");

// PI - Pressão Interna
// PE - Pressão Externa
// AD - Abertura Dominante
// AR - Altura Relativa

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
      //	Θ = 5°
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
      //	Θ = 5°
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
      //	Θ = 10°
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
      //	Θ = 15°
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
      //	Θ = 20°
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
      //	Θ = 30°
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
      //	Θ = 45°
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
      //	Θ = 60°
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
      //	Θ = 0°
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
      //	Θ = 5°
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
      //	Θ = 10°
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
      //	Θ = 15°
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
      //	Θ = 20°
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
      //	Θ = 30°
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
      //	Θ = 45°
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
      //	Θ = 60°
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
      //	Θ = 0°
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
      //	Θ = 5°
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
      //	Θ = 10°
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
      //	Θ = 15°
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
      //	Θ = 20°
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
      //	Θ = 30°
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
      //	Θ = 40°
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
      //	Θ = 50°
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
      //	Θ = 60°
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

const PI_AD_BARLAVENTO = new Map(
  [
    [1, 0.1],
    [1.5, 0.3],
    [2, 0.5],
    [3, 0.6],
    [6, 0.8]
  ]
);

const PI_AD_ALTA_SUCCAO = new Map([
  [0.25, -0.4],
  [0.5, -0.5],
  [0.75, -0.6],
  [1, -0.7],
  [1.5, -0.8],
  [3, -0.9]
]);

const MAPA_ANG_AR_FAIXAS_UM_DOIS = new Map(
  [
    [0, 0],
    [5, 1],
    [10, 2],
    [15, 3],
    [20, 4],
    [30, 5],
    [45, 6],
    [60, 7]
  ]
);

const MAPA_ANG_AR_FAIXA_TRES = new Map(
  [
    [0, 0],
    [5, 1],
    [10, 2],
    [15, 3],
    [20, 4],
    [30, 5],
    [40, 6],
    [50, 7],
    [60, 8]
  ]
);

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

  coeficientes.ventoAZero = Utils.interpolarObjetos(
    1.5,
    valoresParaProporcaoTresMeios.ventoAZero,
    2,
    valoresParaProporcaoDois.ventoAZero,
    proporcao
  );

  coeficientes.ventoANoventa = Utils.interpolarObjetos(
    1.5,
    valoresParaProporcaoTresMeios.ventoANoventa,
    2,
    valoresParaProporcaoDois.ventoANoventa,
    proporcao
  );

  return coeficientes;
};

const interna = (
  { tipo, faces, aberturas },
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
      aberturas,
      coefsPressaoExterna
    )
  } else {
    throw new Error("O valor de entrada para tipo de permeabilidade não é válido :" + tipo);
  }
};

const calcularIndicePressaoInternaAberturaDominante = (
  aberturas,
  coefsPressaoExterna
) => {
  let coeficientes = { ventoAZero: 0, ventoANoventa: 0 },
      secaoDominante,
      total = 0;

  for (let secao in aberturas) {
    aberturas[secao] = parseFloat(aberturas[secao]);
  }

  // calcula área total de aberturas
  for (let secao in aberturas) {
    total += aberturas[secao];
  }

  //  Determina em qual zona a abertura dominante está situada
  for (let secao in aberturas) {
    if (aberturas[secao] > (total - aberturas[secao])) secaoDominante = secao;
  }

  //  Determina se a abertura dominante está espalhada em uma face inteira
  if (!secaoDominante) {
    for (let face of ["a", "b", "c", "d"]) {
      let totalFace = 0;

      for (let secao in aberturas) {
        if (secao.charAt(0) === face) totalFace += aberturas[secao];
      }

      if (totalFace > (total - totalFace)) secaoDominante = face;
    }
  }

  coeficientes.ventoAZero = IndicePressaoInternaAberturaDominanteVentoAZero(
    secaoDominante, aberturas, coefsPressaoExterna.ventoAZero);
  coeficientes.ventoANoventa = IndicePressaoInternaAberturaDominanteVentoANoventa(
    secaoDominante, aberturas, coefsPressaoExterna.ventoANoventa);

  return coeficientes;
};

const somarAreasSubmetidasASuccaoExterna = (areas, anguloDoVento) => {
  switch (anguloDoVento) {
    case 0:
      return areas['a1'] + areas['a2'] + areas['a3'] + areas['b1'] + areas['b2'] + areas['b3'] + areas['d1'] + areas['d2'];
    case 90:
      return areas['c1'] + areas['c2'] + areas['b1'] + areas['b2'] + areas['b3'] + areas['d1'] + areas['d2'];
    case 180:
      return areas['a1'] + areas['a2'] + areas['a3'] + areas['b1'] + areas['b2'] + areas['b3'] + areas['c1'] + areas['c2'];
    case 270:
      return areas['c1'] + areas['c2'] + areas['a1'] + areas['a2'] + areas['a3'] + areas['d1'] + areas['d2'];
  }
};

const IndicePressaoInternaAberturaDominanteVentoAZero = (
  secao,
  aberturas,
  coefsPressaoExterna
) => {

  switch(secao) {
    case 'c1':
      return coefPressaoInternaBarlavento(secao, aberturas, 0);
    case 'c2':
      return coefPressaoInternaBarlavento(secao,aberturas, 0);
    case 'c':
      return coefPressaoInternaBarlavento(secao,aberturas, 0);
    case 'a1':
      return coefPressaoInternaAltaSuccao(secao, aberturas, 0);
    case 'b1':
      return coefPressaoInternaAltaSuccao(secao, aberturas, 0);
    case 'a':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'b':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'a2':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'b2':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'a3':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'b3':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'd':
      return coefPressaoInternaSotavento(secao, coefsPressaoExterna);
    case 'd1':
      return coefPressaoInternaSotavento('d', coefsPressaoExterna);
    case 'd2':
      return coefPressaoInternaSotavento('d', coefsPressaoExterna);
    default:
      throw new Error('Seção de pressão externa inválida: ' + secao);
  }
};

const IndicePressaoInternaAberturaDominanteVentoANoventa = (
  secao,
  aberturas,
  coefsPressaoExterna
) => {

  switch(secao) {
    case 'a1':
      return coefPressaoInternaBarlavento(secao, aberturas, 90);
    case 'a2':
      return coefPressaoInternaBarlavento(secao, aberturas, 90);
    case 'a3':
      return coefPressaoInternaBarlavento(secao, aberturas, 90);
    case 'a':
      return coefPressaoInternaBarlavento(secao, aberturas, 90);
    case 'c1':
      return coefPressaoInternaAltaSuccao(secao, aberturas, 90);
    case 'd1':
      return coefPressaoInternaAltaSuccao(secao, aberturas, 90);
    case 'c':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'd':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'c2':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'd2':
      return coefPressaoInternaBaixaSuccao(secao, coefsPressaoExterna);
    case 'b':
      return coefPressaoInternaSotavento(secao, coefsPressaoExterna);
    case 'b1':
      return coefPressaoInternaSotavento('b', coefsPressaoExterna);
    case 'b2':
      return coefPressaoInternaSotavento('b', coefsPressaoExterna);
    case 'b3':
      return coefPressaoInternaSotavento('b', coefsPressaoExterna);
    default:
      throw new Error('Seção de pressão externa inválida: ' + secao);
  }
};

const coefPressaoInternaBarlavento = (secao, aberturas, angulo) => {
  let coeficientePressaoInterna,
      total,
      proporcao,
      aberturaDominante = 0,
      face;

  face = secao.charAt(0);

  for (let s in aberturas) {
    if (s.charAt(0) === face) {
      aberturaDominante += aberturas[s]
    }
  }

  total = somarAreasSubmetidasASuccaoExterna(aberturas, angulo);
  proporcao = aberturaDominante / total;

  if (proporcao >= 6) return 0.8;

  coeficientePressaoInterna = PI_AD_BARLAVENTO.get(proporcao);

  if (!coeficientePressaoInterna) {
    let limites = Utils.pegarLimitesDeIntervalo(PI_AD_BARLAVENTO.keys(), proporcao);

    return Utils.interpolar(
      limites[0],
      PI_AD_BARLAVENTO.get(limites[0]),
      limites[1],
      PI_AD_BARLAVENTO.get(limites[1]),
      proporcao
    );
  }

  return coeficientePressaoInterna;
};

const coefPressaoInternaSotavento = (
  secao,
  coeficientes
) => {
  if (secao.length === 1) {
    let totalCoefs = 0,
      cont = 0;

    for (let c in coeficientes) {
      if (c.charAt(0) === secao) {
        totalCoefs += secao;
        cont ++;
      }
    }

    return totalCoefs / cont;
  }

  return coeficientes[secao];
};

const coefPressaoInternaAltaSuccao = (
  secao,
  aberturas,
  angulo
) => {
  let total,
      proporcao,
      coefPI;

  total = somarAreasSubmetidasASuccaoExterna(aberturas, angulo);
  proporcao = aberturas[secao] / (total - aberturas[secao]);

  if (proporcao >= 3) return -0.9;

  coefPI = PI_AD_ALTA_SUCCAO.get(proporcao);

  if (!coefPI) {
    let limites = Utils.pegarLimitesDeIntervalo(PI_AD_ALTA_SUCCAO.keys(), proporcao);

     coefPI = Utils.interpolar(
      limites[0],
      PI_AD_ALTA_SUCCAO.get(limites[0]),
      limites[1],
      PI_AD_ALTA_SUCCAO.get(limites[1]),
      proporcao
    );

    return coefPI;
  }

  return coefPI;
};

const coefPressaoInternaBaixaSuccao = (
  secao,
  coeficientes
) => {
  if (secao.length === 1) {
    let totalCoefs = 0,
        cont = 0;

    for (let c in coeficientes) {
      if (c.charAt(0) === secao) {
        totalCoefs += coeficientes[c];
        cont ++;
      }
    }

    return totalCoefs / cont;
  }

  return coeficientes[secao];
};

const externaTelhado = ({
 inclinacaoTelhado,
 altura,
 largura
}) => {
  let indiceAlturaRelativa,
      indiceAngulo,
      mapa;

  inclinacaoTelhado = parseFloat(inclinacaoTelhado);

  indiceAlturaRelativa = pegarIndiceAlturaRelativaTelhado(altura, largura);
  mapa = qualMapa(indiceAlturaRelativa);
  indiceAngulo = mapa.get(inclinacaoTelhado);

  if (!indiceAngulo) {
    let angulosMaisProximos = acharAngulosTabeladosMaisProximos(inclinacaoTelhado, mapa);

    return pegarValorTabela5({
      indiceAlturaRelativa,
      indiceAnguloUm: angulosMaisProximos[0][1],
      anguloUm: angulosMaisProximos[0][0],
      indiceAnguloDois: angulosMaisProximos[1][1],
      anguloDois: angulosMaisProximos[1][0],
      angulo: inclinacaoTelhado
    });
  } else {
    return pegarValorTabela5({
      indiceAlturaRelativa,
      indiceAnguloUm: indiceAngulo
    });
  }
};

const pegarIndiceAlturaRelativaTelhado = (altura, largura) => {
  if (altura/largura <= 0.5) return 0;
  else if (altura/largura > 0.5 && altura/largura <= 3/2) return 1;
  else if (altura/largura > 3/2 && altura/largura <= 6) return 2;
  else {
    throw new Error('Altura fora da faixa aceitável: ' + altura);
  }
};

const pegarValorTabela5 = ({
  indiceAlturaRelativa,
  indiceAnguloUm,
  anguloUm,
  indiceAnguloDois,
  anguloDois,
  angulo = false
}) => {
  if (angulo) {
    let coeficienteUm = TABELA_5[indiceAlturaRelativa][indiceAnguloUm],
        coeficienteDois = TABELA_5[indiceAlturaRelativa][indiceAnguloDois];

    return {
      ventoAZero: Utils.interpolarObjetos(anguloUm, coeficienteUm.ventoAZero, anguloDois, coeficienteDois.ventoAZero, angulo),
      ventoANoventa: Utils.interpolarObjetos(anguloUm, coeficienteUm.ventoANoventa, anguloDois, coeficienteDois.ventoANoventa, angulo)
    };
  } else {
    return TABELA_5[indiceAlturaRelativa][indiceAnguloUm];
  }
};

const qualMapa = (indiceAlturaRelativa) => {
  if (indiceAlturaRelativa === 0 || indiceAlturaRelativa === 1) {
    return MAPA_ANG_AR_FAIXAS_UM_DOIS;
  } else if (indiceAlturaRelativa === 2) {
    return MAPA_ANG_AR_FAIXA_TRES;
  }
};



const acharAngulosTabeladosMaisProximos = (angulo, mapa) => {
  let anterior = 0;

  for (var anguloTestado of mapa.keys()) {
    if (angulo < anguloTestado && angulo > anterior) {
      return [[anterior, mapa.get(anterior)], [anguloTestado, mapa.get(anguloTestado)]];
    }

    anterior = anguloTestado;
  }
};

module.exports = {
  externaParedesPlantaRetangular,
  externaTelhado,
  interna
};