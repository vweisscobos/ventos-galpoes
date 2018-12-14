let express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  mongoose = require('mongoose'),
  isopletas = require('./routes/isopletas'),
  nbr6123 = require('./routes/nbr6123');

const PORT = process.env.PORT || 5000;
const MONGO_LOGIN = process.env.LOGIN_SENHA;
const MONGO_SENHA = process.env.MONGO_SENHA;

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

let uri = `mongodb://${MONGO_LOGIN}:${MONGO_SENHA}isopletas4galpoes@ds121332.mlab.com:21332/vento-galpoes`;

//  connect to mongoose
mongoose.connect(uri).then(
  () => {
    console.log("connected")
  },
  err => {
    console.log(err);
  }
);


let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

isopletas.initialize(app);
nbr6123.initialize(app);

app.get('/', function(req, res) {
  res.send("API rodando");
});

app.listen(PORT, function() {
  console.log("running on port 80...");
});
