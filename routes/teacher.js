var express = require('express');
const login = require("../funkcije/Login");
const teacher = require('../funkcije/Teacher');
const predavanja = require('../funkcije/Predavanje')
var router = express.Router();

/* GET home page. */
router.get('/', login.daj_pristup, teacher.daj_casove, function(req, res, next) {
    res.render('Main/teacher', {layout:'Layouts/teacher_layout', first_name:req.user.first_name, profile_image:req.user.profile_image, classes:req.body.casovi, Id:req.user.id});
});

router.get('/predavanja', login.daj_pristup, predavanja.daj_protekle_casove, function(req, res, next) {
    res.render('Main/teacher_predavanja', {layout:'Layouts/teacher_layout', first_name:req.user.first_name, profile_image:req.user.profile_image, classes:req.body.casovi, Id:req.user.id, sort:"Time"});
});

router.get('/predavanja_abecedno', login.daj_pristup, predavanja.daj_casove_abecedno, function(req, res, next) {
    res.render('Main/teacher_predavanja', {layout:'Layouts/teacher_layout', first_name:req.user.first_name, profile_image:req.user.profile_image, classes:req.body.casovi, Id:req.user.id, sort:"Name"});
});

router.get('/predavanja_kvaliteta', login.daj_pristup, predavanja.daj_casove_kvalitetno, function(req, res, next) {
    res.render('Main/teacher_predavanja', {layout:'Layouts/teacher_layout', first_name:req.user.first_name, profile_image:req.user.profile_image, classes:req.body.casovi, Id:req.user.id, sort:"Quality"});
});

router.get('/predavanja_rating', login.daj_pristup, predavanja.daj_casove_rating, function(req, res, next) {
    res.render('Main/teacher_predavanja', {layout:'Layouts/teacher_layout', first_name:req.user.first_name, profile_image:req.user.profile_image, classes:req.body.casovi, Id:req.user.id, sort:"Quality"});
});

router.get('/predavanja_broj_pitanja', login.daj_pristup, predavanja.daj_casove_kvantitetno, function(req, res, next) {
    res.render('Main/teacher_predavanja', {layout:'Layouts/teacher_layout', first_name:req.user.first_name, profile_image:req.user.profile_image, classes:req.body.casovi, Id:req.user.id, sort:"NOAQ"});
});

router.get('/predavanje/:id', login.daj_pristup, predavanja.daj_cas,predavanja.daj_pitanja, function(req, res, next) {
    res.render('Main/teacher_predavanje', {layout:'Layouts/teacher_layout', cas:req.body.cas, pitanja:req.body.pitanja,first_name:req.user.first_name, profile_image:req.user.profile_image, Id:req.user.id});
});



router.post('/dodaj_predavanje', login.daj_pristup, teacher.provjeri_predavanje, teacher.dodaj_predavanje, function(req, res, next) {
    return res.send({mogu:true});
});

router.post('/promijeni_predavanje/:id', login.daj_pristup, teacher.provjeri_edit_predavanje, teacher.promijeni_predavanje, function(req, res, next) {
    return res.send({mogu:true});
});

router.get('/obrisi_predavanje/:id', login.daj_pristup, teacher.obrisi_predavanje, function(req, res, next) {
    res.redirect('/teacher');
});




module.exports = router;
