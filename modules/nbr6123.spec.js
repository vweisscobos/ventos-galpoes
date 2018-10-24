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

describe(`Testa os getters de fator topografico`, () => {
  it (`Deve retornar o fator topografico de um edificio alocado em terreno plano`, () => {
    expect(nbr6123.getFatorTopografico(0, 3, 5, 0)).toEqual(1);
  });

  it (`Deve retornar o fator topografico de um edificio alocado vale protegido`, () => {
    expect(nbr6123.getFatorTopografico(1, 3, 5, 0)).toEqual(0.9);
  });

  it (`Deve retornar o fator topografico de um edificio alocado no pé de um talude`, () => {
    expect(nbr6123.getFatorTopografico(2, 3, 5, 0)).toEqual(1);
  });

  it (`Deve retornar o fator topografico de um edificio alocado a uma distancia de 4H do topo de um talude, onde H é a altura deste`, () => {
    expect(nbr6123.getFatorTopografico(3, 3, 5, 6)).toEqual(1);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo
      de um talude de altura com inclinação de 2º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 2)).toEqual(1);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo
      de um talude de 3 metros altura com inclinação de 4º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 4)).toBeCloseTo(1.01455);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo 
      de um talude de 3 metros altura altura com inclinação de 6º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 6)).toBeCloseTo(1.04367);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo 
      de um talude de altura 3 metros com inclinação de 15º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 15)).toBeCloseTo(1.17713);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo
      de um talude de altura 3 metros com inclinação de 17º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 17)).toBeCloseTo(1.20777);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo
      de um talude de altura 3 metros com inclinação de 30º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 30)).toBeCloseTo(1.231244);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo
      de um talude de altura 3 metros com inclinação de 45º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 45)).toBeCloseTo(1.25833);
  });

  it (`Deve retornar o fator topografico para edifício de 5 metros alocado no topo
      de um talude de altura 3 metros com inclinação de 50º`, () => {
    expect(nbr6123.getFatorTopografico(4, 3, 5, 50)).toBeCloseTo(1.25833);
  });

});

describe("Bateria de testes para avaliar o fator de rugosidade s2", () => {
  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria I e classe A`, () => {
    expect(nbr6123.getFatorRugosidade("I", "A", 10)).toBeCloseTo(1.1);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria I e classe B`, () => {
    expect(nbr6123.getFatorRugosidade("I", "B", 10)).toBeCloseTo(1.09);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria I e classe C`, () => {
    expect(nbr6123.getFatorRugosidade("I", "C", 10)).toBeCloseTo(1.06);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria II e classe A`, () => {
    expect(nbr6123.getFatorRugosidade("II", "A", 10)).toBeCloseTo(1.00);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria II e classe B`, () => {
    expect(nbr6123.getFatorRugosidade("II", "B", 10)).toBeCloseTo(0.98);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria II e classe C`, () => {
    expect(nbr6123.getFatorRugosidade("II", "C", 10)).toBeCloseTo(0.95);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria III e classe A`, () => {
    expect(nbr6123.getFatorRugosidade("III", "A", 10)).toBeCloseTo(0.94);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria III e classe B`, () => {
    expect(nbr6123.getFatorRugosidade("III", "B", 10)).toBeCloseTo(0.92, 0.88);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria III e classe C`, () => {
    expect(nbr6123.getFatorRugosidade("III", "C", 10)).toBeCloseTo(0.88);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria IV e classe A`, () => {
    expect(nbr6123.getFatorRugosidade("IV", "A", 10)).toBeCloseTo(0.86);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria IV e classe B`, () => {
    expect(nbr6123.getFatorRugosidade("IV", "B", 10)).toBeCloseTo(0.83);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria IV e classe C`, () => {
    expect(nbr6123.getFatorRugosidade("IV", "C", 10)).toBeCloseTo(0.8);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria V e classe A`, () => {
    expect(nbr6123.getFatorRugosidade("V", "A", 10)).toBeCloseTo(0.74);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria V e classe B`, () => {
    expect(nbr6123.getFatorRugosidade("V", "B", 10)).toBeCloseTo(0.72);
  });

  it (`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura,
      categoria V e classe C`, () => {
    expect(nbr6123.getFatorRugosidade("V", "C", 10)).toBeCloseTo(0.67);
  });

  it(`Deve retornar o fator de rugosidade para um ponto a 10 metros de altura
      categoria V e tempo de intervalo estimado igual a 15s`, () => {
    expect(nbr6123.determinarFatorRugosidadePorIteracao({
      categoria: "II",
      intervaloTempoEstimado: 15,
      maiorDimensao: 100,
      alturaDoPonto: 30,
      indiceTipoDeRelevo: 0,
      inclinacaoDoTalude: 0,
      alturaDoTalude: 3,
      velocidadeBasica: 45
    })).toBeCloseTo(1.02);
  });

});

describe("Bateria de testes para validar a obtenção do fator estatístico s3 da seção 5.4 da NBR6123", () => {
  it (`Deve retornar o fator estatístico para uma edificação do grupo 1`, () => {
    expect(nbr6123.getFatorEstatistico(1)).toEqual(1.1);
  });

  it (`Deve retornar o fator estatístico para uma edificação do grupo 2`, () => {
    expect(nbr6123.getFatorEstatistico(2)).toEqual(1.0);
  });

  it (`Deve retornar o fator estatístico para uma edificação do grupo 3`, () => {
    expect(nbr6123.getFatorEstatistico(3)).toEqual(0.95);
  });

  it (`Deve retornar o fator estatístico para uma edificação do grupo 4`, () => {
    expect(nbr6123.getFatorEstatistico(4)).toEqual(0.88);
  });

  it (`Deve retornar o fator estatístico para uma edificação do grupo 5`, () => {
    expect(nbr6123.getFatorEstatistico(5)).toEqual(0.83);
  });
});

describe(`Bateria de testes para validar a obtenção dos valores de pressão externa para edificações de planta
  retangular`, () => {

  it("Deve retornar os valores de forma de acordo com o descrito na tabela 4 da seção 6.2 da NBR 6123", () => {
    let joc = jasmine.objectContaining;

    expect(nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
      comprimento: 30,
      largura: 20,
      altura: 10
    })).toEqual(joc({
      ventoAZero: joc({
				a1: -0.8,
				b1: -0.8,
				a2: -0.5,
				b2: -0.5,
				c: 0.7,
				d: -0.4
      }),
      ventoANoventa: joc({
				a: 0.7,
				b: -0.4,
				c1: -0.8,
				d1: -0.8,
				c2: -0.4,
				d2: -0.4
      })
    }));
  });

	it("Deve retornar os valores de forma de acordo com o descrito na tabela 4 da seção 6.2 da NBR 6123", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 60,
			largura: 20,
			altura: 10
		})).toEqual(joc({
			ventoAZero: joc({
				a1: -0.8,
				b1: -0.8,
				a2: -0.4,
				b2: -0.4,
				c: 0.7,
				d: -0.3
			}),
			ventoANoventa: joc({
				a: 0.7,
				b: -0.5,
				c1: -0.9,
				d1: -0.9,
				c2: -0.5,
				d2: -0.5
			})
		}));
	});

	it("Deve retornar os valores de forma de acordo com o descrito na tabela 4 da seção 6.2 da NBR 6123", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 30,
			largura: 20,
			altura: 15
		})).toEqual(joc({
			ventoAZero: joc({
				a1: -0.9,
				b1: -0.9,
				a2: -0.5,
				b2: -0.5,
				c: 0.7,
				d: -0.5
			}),
			ventoANoventa: joc({
				a: 0.7,
				b: -0.5,
				c1: -0.9,
				d1: -0.9,
				c2: -0.5,
				d2: -0.5
			})
		}));
	});

	it("Deve retornar os valores de forma de acordo com o descrito na tabela 4 da seção 6.2 da NBR 6123", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 60,
			largura: 20,
			altura: 15
		})).toEqual(joc({
			ventoAZero: joc({
				a1: -0.9,
				b1: -0.9,
				a2: -0.4,
				b2: -0.4,
				c: 0.7,
				d: -0.3
			}),
			ventoANoventa: joc({
				a: 0.7,
				b: -0.6,
				c1: -0.9,
				d1: -0.9,
				c2: -0.5,
				d2: -0.5
			})
		}));
	});

	it("Deve retornar os valores de forma de acordo com o descrito na tabela 4 da seção 6.2 da NBR 6123", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 30,
			largura: 20,
			altura: 40
		})).toEqual(joc({
			ventoAZero: joc({
				a1: -1.0,
				b1: -1.0,
				a2: -0.6,
				b2: -0.6,
				c: 0.8,
				d: -0.6
			}),
			ventoANoventa: joc({
				a: 0.8,
				b: -0.6,
				c1: -1.0,
				d1: -1.0,
				c2: -0.6,
				d2: -0.6
			})
		}));
	});

	it("Deve retornar os valores de forma de acordo com o descrito na tabela 4 da seção 6.2 da NBR 6123", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 60,
			largura: 20,
			altura: 40
		})).toEqual(joc({
			ventoAZero: joc({
				a1: -1.0,
				b1: -1.0,
				a2: -0.5,
				b2: -0.5,
				c: 0.8,
				d: -0.3
			}),
			ventoANoventa: joc({
				a: 0.8,
				b: -0.6,
				c1: -1.0,
				d1: -1.0,
				c2: -0.6,
				d2: -0.6
			})
		}));
	});

	it("Deve retornar coeficientes de pressão interna com abertura dominante na secao c1 e proporção" +
		"entre abertura dominante e outras aberturas igual a 1.0", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDePressaoInterna({
			tipoPermeabilidade: "abertura dominante",
			areaAberturaDominante: 2,
			areaOutrasAberturas: 2,
			secaoDaAbertura: 'c1',
			coefsPressaoExterna: {
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
		})).toEqual(joc({
			ventoAZero: 0.1,
			ventoANoventa: -0.7
		}));
	});

	it("Deve retornar coeficientes de pressão interna de abertura dominante na secao c1 e proporção" +
		"entre abertura dominante e outras aberturas igual a 1.5", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDePressaoInterna({
			tipoPermeabilidade: "abertura dominante",
			areaAberturaDominante: 3,
			areaOutrasAberturas: 2,
			secaoDaAbertura: 'c1',
			coefsPressaoExterna: {
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
		})).toEqual(joc({
			ventoAZero: 0.3,
			ventoANoventa: -0.8
		}));
	});

	it("Deve retornar coeficientes de pressão interna de abertura dominante na secao a3 e proporção" +
		"entre abertura dominante e outras aberturas igual a 1.5", () => {
		let joc = jasmine.objectContaining;

		let coeficientesPressaoExterna = nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 60, largura: 20, altura: 10
		});

		expect(nbr6123.getCoeficienteDePressaoInterna({
			tipoPermeabilidade: "abertura dominante",
			areaAberturaDominante: 3,
			areaOutrasAberturas: 2,
			secaoDaAbertura: 'a3',
			coefsPressaoExterna: coeficientesPressaoExterna
		})).toEqual(joc({
			ventoAZero: -0.2,
			ventoANoventa: 0.3
		}));
	});

	it("Deve retornar coeficientes de pressão interna de abertura dominante na secao b3 e proporção" +
		"entre abertura dominante e outras aberturas igual a 1.5", () => {
		let joc = jasmine.objectContaining;

		let coeficientesPressaoExterna = nbr6123.getCoeficienteDeFormaParedesPlantaRetangular({
			comprimento: 60,
			largura: 20,
			altura: 10
		});

		expect(nbr6123.getCoeficienteDePressaoInterna({
			tipoPermeabilidade: "abertura dominante",
			areaAberturaDominante: 3,
			areaOutrasAberturas: 2,
			secaoDaAbertura: 'b3',
			coefsPressaoExterna: coeficientesPressaoExterna
		})).toEqual(joc({
			ventoAZero: -0.2,
			ventoANoventa: -0.5
		}));
	});

	it("Deve retornar os indices de pressão interna de uma edificação com as quatro faces igualmente permeáveis", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDePressaoInterna({
			tipoPermeabilidade: "quatro faces",
			secaoDaAbertura: 'c1',
			coefsPressaoExterna: {
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
		})).toEqual([0, -0.3]);
	});

	it("Deve retornar os indices de pressão interna de uma edificação com as quatro faces igualmente permeáveis", () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoeficienteDePressaoInterna({
			tipoPermeabilidade: "faces opostas frente permeável",
			secaoDaAbertura: 'c1',
			coefsPressaoExterna: {
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
		})).toEqual({ 'ventoANoventa': -0.3, "ventoAZero": 0.2 });
	});
});

describe(`Bateria de testes para validar a obtenção dos coeficientes de pressão
		externa para telhado a partir da tabela 5`, () => {

	it(`Deve retornar o coeficiente de pressão externa para telhado de um galpão
			de 10m de altura, 20m de largura e 5° de angulo`, () => {
		let joc = jasmine.objectContaining;

		expect(nbr6123.getCoefsPressaoExternaTelhado({
			altura: 10,
			largura: 20,
			angulo: 5
		})).toEqual(joc({
			ventoAZero: {
				frente: -0.8,
				tras: -0.4
			},
			ventoANoventa: {
				esquerda: -0.9,
				direita: -0.4
			}
		}));
	});
});

describe(`Bateria de testes para validar a obtenção das pressões efetivas`,  () => {
  let coeficientesDePressao = nbr6123.pegarCoeficientesDePressao({
    velocidadeBasica: 45,
    tipoDeRelevo: 0,
    alturaTalude: 3,
    alturaDoPonto: 10,
    inclinacaoTalude: 0,
    categoria: "II",
    intervaloTempo: "A",
    grupo: 2,
    comprimento: 40,
    largura: 20,
    altura: 10,
    anguloTelhado: 5,
    tipoPermeabilidade: "faces opostas frente permeável"
  });
  
  console.log(nbr6123.getCoeficientesEfetivosDePressao({
		tipoPermeabilidade: "faces opostas frente permeável",
		coefPressaoExternaParede: coeficientesDePressao.coefPressaoExternaParedes,
		coefPressaoExternaTelhado: coeficientesDePressao.coefPressaoExternaTelhado,
		coefPressaoInterna: coeficientesDePressao.coefPressaoInterna
	}));
});