var express = require('express');
var geoDB = require('../services/nonPersistanceStorage')
var router = express.Router();

/* GET home page. */
router.get('/geojson/', function(req, res, next) {
  res.status(200).json(geoDB.getGeoJSONs());
});

router.post('/geojson/', function(req, res, next) {
  //FIXME:perlu di check ada req.body.getJSON apa ngga
  geoDB.addGeoJSON(req.body.geoJSON)
  res.status(200).json({message:"Successfully saved"});
});
//FIXME: Misal engga ad aindex dengan id -->404
router.get('/geojson/delete/:id', function(req, res, next) {
  geoDB.deleteGeoJSONs(req.params.id)
  res.status(200).json({message:"Successfully deleted"});
});

module.exports = router;