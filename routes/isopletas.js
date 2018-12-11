const Geodesic = require('../modules/geodesic');
const Isopletas = require('../models/velocidade-basica');

const pegaPontoMaisInfluente = (isopleta, coordAlvo) => {

  return Object.assign(Geodesic.nearestPoint(isopleta.line.coordinates, coordAlvo), {
    velocidade: isopleta.velocidade
  });
};

const pegarIsopletasMaisInfluentes = (isopletas, coordAlvo) => {

  const pontosMaisProximos = isopletas.map(
      isopleta => pegaPontoMaisInfluente(isopleta, coordAlvo));

  pontosMaisProximos.sort((point1, point2) => point1.dist - point2.dist);

  //  retorna só os dois mais influentes
  return pontosMaisProximos.slice(0, 2);
};

const calcularVelocidadeBasica = (pontoIsopleta1, pontoIsopleta2) => {

  const fator =
    (pontoIsopleta2.velocidade - pontoIsopleta1.velocidade) /
    (pontoIsopleta1.dist + pontoIsopleta2.dist);

  return pontoIsopleta1.velocidade + fator*pontoIsopleta1.dist;
};

module.exports.initialize = (connection) => {

  connection.get('/v1/api-nbr6123/velocidade-basica', function(req, res) {
    const lat = parseInt(req.query.lat);
    const lng = parseInt(req.query.lng);

    Isopletas.pegarRegiaoDeVelocidade([lat, lng], (err, regiao) => {
      if (err) {
        res.json(err);
        return;
      }

      if (!regiao) {
        res.json(
          `Você pesquisou por um ponto não suportado pela nossa API: ${lat}, ${lng}`);
        return;
      }

      const pontosMaisInfluentes = pegarIsopletasMaisInfluentes(regiao.limites, [lat, lng]);
      const velocidadeBasica = calcularVelocidadeBasica(...pontosMaisInfluentes);

      res.json({
        velocidadeBasica: velocidadeBasica,
        pontosMaisInfluentes: pontosMaisInfluentes
      });
    });
  });
};

