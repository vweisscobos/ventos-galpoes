const nbr6123 = require('./nbr6123');

describe('testa funções auxiliares',  () => {
	it ("Deve retornar o resultado de uma interpolação", () => {
		expect(nbr6123.interpolar(1, 0.1, 1.5, 0.3, 1.2)).toEqual(0.18);
	});

	it ("Deve retornar o resultado de uma interpolação de objetos populados com valores", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.interpolarCoeficientes(
			1.5,
			{
				a1: -0.8,
				b1: -0.8,
				a2: -0.5,
				b2: -0.5,
				c: 0.7,
				d: -0.4
			},
			2,
			{
				a1: -0.8,
				b1: -0.8,
				a2: -0.4,
				b2: -0.4,
				c: 0.7,
				d: -0.3
			},
			1.8
		)).toEqual(joc({
			a1: -0.8,
			b1: -0.8,
			a2: -0.44,
			b2: -0.44,
			c: 0.7,
			d: -0.33999999999999997
		}));
	});
});

describe(`Bateria de testes para validar a obtenção das pressões efetivas`,  () => {
  let coeficientesDePressao = nbr6123.pegarCoeficientesDePressao({
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