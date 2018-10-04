const mongoose = require('mongoose');

const lineString = new mongoose.Schema({
  "type": {
    type: String,
    default: "LineString"
  },
  "coordinates": {
    type: [[Number]],
    required: true
  }
});

const polygon = new mongoose.Schema({
  "type": {
    type: String,
    default: "Polygon"
  },
  "coordinates": {
    type: [[[Number]]],
    required: true
  }
});

const isopleta = new mongoose.Schema({
  "descricao": {
    type: String,
    required: true
  },
  "velocidade": {
    type: Number,
    required: true
  },
  "line": {
    type: lineString,
    required: true
  }
});

const regiao = new mongoose.Schema({
  "limites": {
    type: [isopleta],
    required: true
  },
  "area": {
    type: polygon,
    required: true
  }
});

const RegiaoDeVelocidade = mongoose.model('regioe', regiao);

// module.exports.pegarIsopletasMaisProximas = (lat, lng, callback) => {
//   Isopleta.find({
//     'line': {
//       $near: {
//         $geometry: {
//           type: "Point" ,
//           coordinates: [ lat , lng ]
//         }
//       }
//     }
//   }, callback)
// };

module.exports.pegarRegiaoDeVelocidade = (ponto, callback) => {
  RegiaoDeVelocidade.findOne({
    'area': {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: ponto
        }
      }
    }
  }, callback);
};

module.exports.inserirRegiaoDeVelocidade = (regiao, callback) => {
  RegiaoDeVelocidade.create(regiao, callback);
};




