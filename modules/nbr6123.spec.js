const NBR6123 = require('./nbr6123');

describe(`Bateria de testes para validar a obtenção das pressões efetivas`,  () => {
  let coeficientesDePressao = NBR6123.getCoeficientesDePressao({
    classeDimensoes: 2,
    dimensoes: {
      altura: 6,
      inclinacaoTelhado: 15,
      largura: 20,
      comprimento: 10
    },
    fatorEstatistico: 1,
    permeabilidade: { tipo: "quatro faces" },
    rugosidade: 0,
    topografia: 1,
    velocidadeBasica: 45
  });

  console.log(coeficientesDePressao);
});