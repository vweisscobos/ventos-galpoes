const Geometry = require('./geometry');
const Utils = require('./utils');

const FATORES_FIXOS = [ 1, 0.9 ];

const calcularFatorTopografico = ({tipo, altura, inclinacao, posicaoLocacao}, alturaPonto) => {
  let distHorizontalTopo = altura / Math.tan(Geometry.degreesToRadians(inclinacao));
  let fatorDoTopo = calcularFatorTopograficoTopo(altura, alturaPonto, inclinacao);

  switch(tipo) {
    case "morro":
      if (posicaoLocacao <= 0 || posicaoLocacao >= distHorizontalTopo*2) return 1;
      else if (posicaoLocacao === distHorizontalTopo) return fatorDoTopo;
      else return Utils.interpolar(0, 1, distHorizontalTopo, fatorDoTopo, posicaoLocacao);
    case "talude":
      if (posicaoLocacao <= 0 || posicaoLocacao >= (distHorizontalTopo + altura * 4)) return 1;
      else if (posicaoLocacao === distHorizontalTopo) return fatorDoTopo;
      else if (posicaoLocacao > 0 && posicaoLocacao < distHorizontalTopo )
        return Utils.interpolar(0, 1, distHorizontalTopo, fatorDoTopo, posicaoLocacao);
      else if (posicaoLocacao > distHorizontalTopo && posicaoLocacao < (distHorizontalTopo + altura * 4))
        return Utils.interpolar(distHorizontalTopo, fatorDoTopo, (distHorizontalTopo + altura * 4), 1, posicaoLocacao);
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

module.exports = {
  FATORES_FIXOS,
  calcularFatorTopografico
}