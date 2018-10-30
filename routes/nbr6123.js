const nbr6123 = require('../modules/nbr6123');

module.exports.initialize = (connection) => {

  connection.post('/v1/api-nbr6123/coeficientes-pressao', function(req, res) {
    res.json( nbr6123.pegarCoeficientesDePressao(req.body) )
  });
};