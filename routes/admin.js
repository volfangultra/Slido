var express = require('express');
var router = express.Router();
const login = require('../funkcije/Login');
const {provjeri_rutu_admina} = require("../funkcije/Login");
const admin = require("../funkcije/Admin");
const teacher = require("../funkcije/Teacher");
const predavanje = require("../funkcije/Predavanje");

/* GET home page. */
router.get('/', function(req,res,next){
    res.redirect('/admin/15');
})

router.get('/:provjera', provjeri_rutu_admina, admin.izlistaj_admins, function(req, res, next) {
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['active', '', '', '', ''], admini:res.locals.admini, username:res.locals.username} );
});

router.post('/mjenjaj/:provjera', provjeri_rutu_admina, admin.provjeri_korisnika, admin.napravi_cookie, admin.promijeni_korisnika, function(req, res, next){
    return res.send({mogu:true});
})

router.post('/dodaj/:provjera', provjeri_rutu_admina, admin.provjeri_korisnika, admin.dodaj_novog, function(req, res, next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.redirect('/admin/' + req.params.provjera);
})

router.get('/obrisi/:id/:provjera',provjeri_rutu_admina, admin.obrisi, function(req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.redirect('/admin/' + req.params.provjera);
})

router.get('/teachers/:provjera',provjeri_rutu_admina, admin.izlistaj_teachers, function (req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_teachers', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', 'active', '', '', ''], teachers:res.locals.teachers, username:res.locals.username})
});

router.get('/teachers/obrisi/:id/:provjera',provjeri_rutu_admina, teacher.obrisi, admin.izlistaj_teachers, function (req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_teachers', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', 'active', '', '', ''], teachers:res.locals.teachers, username:res.locals.username})
});

router.get('/teachers/blokiraj/:id/:provjera', provjeri_rutu_admina, teacher.blokiraj, admin.izlistaj_teachers, function(req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_teachers', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', 'active', '', '', ''], teachers:res.locals.teachers, username:res.locals.username})
})

router.get('/teachers/deblokiraj/:id/:provjera', provjeri_rutu_admina, teacher.deblokiraj, admin.izlistaj_teachers, function(req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_teachers', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', 'active', '', '', ''], teachers:res.locals.teachers, username:res.locals.username})
})

router.post('/teachers/mjenjaj/:id/:provjera',provjeri_rutu_admina, teacher.provjeri_korisnika, teacher.promijeni_korisnika, function (req,res,next){
    return res.send({mogu:true});
});



router.get('/classes/:provjera',provjeri_rutu_admina, admin.izlistaj_classes, function (req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_classes', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', '', 'active', '', ''], classes:res.locals.classes, username:res.locals.username})
});

router.post('/classes/promijeni_predavanje/:id/:provjera', provjeri_rutu_admina, teacher.provjeri_predavaca_za_class, teacher.provjeri_admin_predavanje, teacher.promijeni_predavanje_admin , function(req,res,next){
    return res.send({mogu:true, predavanje:true});
});

router.get('/classes/obrisi/:id/:provjera', provjeri_rutu_admina, teacher.obrisi_predavanje, function(req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.redirect('/admin/classes/' + req.params.provjera);
});

router.get('/classes/obrisi_odslusano_predavanje/:id/:provjera', provjeri_rutu_admina, teacher.obrisi_odslusano_predavanje, function(req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.redirect('/admin/previus_classes/' + req.params.provjera);
});

router.post('/classes/dodaj/:provjera', provjeri_rutu_admina, teacher.provjeri_predavaca_za_class, teacher.provjeri_admin_predavanje, teacher.dodaj_predavanje_admin , function(req,res,next){
    return res.send({mogu:true, predavanje:true});
});

router.get('/previus_classes/:provjera', provjeri_rutu_admina, admin.uzmi_predhodne_casove, function(req, res, next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_previus', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', '', '', 'active', ''], username:res.locals.username, classes:req.body.classes});
})

router.get('/previus_classes/:id/:provjera', provjeri_rutu_admina, predavanje.daj_cas,predavanje.daj_pitanja, function(req, res, next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/teacher_predavanje', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', '', '', 'active', ''], username:res.locals.username, cas:req.body.cas, pitanja:req.body.pitanja});
})

router.get('/forbiden_words/:provjera',provjeri_rutu_admina, admin.izlistaj_forbbiden_words, function (req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.render('Main/admin_words', {layout:'Layouts/admin_layout', code:req.params.provjera, aktivni:['', '', '', '', 'active'], words:res.locals.words, username:res.locals.username})
});

router.get('/forbiden_words/obrisi/:id/:provjera',provjeri_rutu_admina, admin.brisi_rijec, function (req,res,next){
    req.params.provjera = encodeURIComponent(req.params.provjera);
    res.redirect('/admin/forbiden_words/' + req.params.provjera)
});

router.post('/forbiden_words/dodaj/:provjera', provjeri_rutu_admina, admin.provjeri_rijec, admin.ubaci_rijec , function(req,res,next){
    return res.send({mogu:true});
});

router.post('/forbiden_words/mjenjaj/:id/:provjera', provjeri_rutu_admina, admin.provjeri_rijec, admin.mjenjaj_rijec, function(req,res,next){
    return res.send({mogu:true});
});




module.exports = router;
