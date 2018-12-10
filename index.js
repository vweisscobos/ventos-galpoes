let express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  mongoose = require('mongoose'),
  isopletas = require('./routes/isopletas'),
  nbr6123 = require('./routes/nbr6123'),
  velocidadeBasicaModel = require('./models/velocidade-basica'),
  regioes = require('./assets/isopletas');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Expose-Headers", "Accept-Ranges, Content-Encoding, Content-Length, Content-Range");
  next();
});

//  connect to mongoose
// mongoose.connect('mongodb://localhost/ventos');
// var db = mongoose.connection;

isopletas.initialize(app);
nbr6123.initialize(app);


// velocidadeBasicaModel.inserirRegiaoDeVelocidade(regioes.regiaoV, (err, result) => {
//   if (err) throw new Error("Something gone wrong: " + err);
//   console.log("região inserida")
// });
//
// velocidadeBasicaModel.inserirRegiaoDeVelocidade(regioes.regiaoIV, (err, result) => {
//   if (err) throw new Error("Something gone wrong: " + err);
//   console.log("região inserida")
// });

app.get('/', function(req, res) {
  res.send("API rodando");
});

app.listen(PORT, function() {
  console.log("running on port 80...");
});
