var express = require('express');
var router = express.Router();
const login = require('../funkcije/Login');
const predavanja = require('../funkcije/Predavanje.js');

/* GET home page. */
router.get('/', login.provjeri_logovanje, function(req, res, next) {
  res.render('Main/index', { layout: 'Layouts/main_layout'});
});

router.get('/krupno_kod/:kod',login.daj_pristup, function(req, res,next){
  res.render('Main/kod', { layout: 'Layouts/main_layout', kod:req.params.kod});
})

router.get('/qr_kod/:kod',login.daj_pristup, function(req, res,next){
  res.render('Main/QRkod', { layout: 'Layouts/main_layout', kod:req.params.kod, domena:predavanja.domena});
})

router.post('/', function(req, res, next){
  res.redirect('/poruke/' + req.body.code);
})

router.get('/')

module.exports = router;
