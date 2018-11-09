const NBR6123 = require('../modules/nbr6123');

module.exports.initialize = (connection) => {

  connection.post('/v1/api-nbr6123/coeficientes-pressao', function(req, res) {
    res.json( nbr6123.pegarCoeficientesDePressao(req.body) )
  });

  connection.post('/v1/api-nbr6123/acao-ventos', function(req, res) {
    let coeficientesDePressao = NBR6123.getCoeficientesDePressao(req.body)

    let coeficientesDePressaoEfetiva = NBR6123.getCoeficientesEfetivosDePressao({
      tipoPermeabilidade: req.body.permeabilidade.tipo,
      coefPressaoInterna: coeficientesDePressao.coefPressaoInterna,
      coefPressaoExternaTelhado: coeficientesDePressao.coefsPressaoExternaTelhado,
      coefPressaoExternaParede: coeficientesDePressao.coefsPressaoExternaParedes
    });

    console.log(coeficientesDePressaoEfetiva)

    res.json(Object.assign(
      {},
      {
        coefsPressao: coeficientesDePressao,
        coefsPressaoEfetiva: coeficientesDePressaoEfetiva
      }
    ));
  });
};