var express = require('express');
var router = express.Router();
const login = require('../funkcije/Login');
const passport = require("passport");
const kript = require("bcrypt");

/* GET home page. */
router.get('/', login.provjeri_logovanje, (req, res) => {
    res.render('Main/login.ejs', {layout:'Layouts/login_layout'})
})

router.post('/', login.provjeri_logovanje, passport.authenticate('local', {
    successRedirect: '/teacher',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/admin', function(req, res, next) {
    kript.hash('admin' + '$2b$10$G2aYVBDrcbtJCpByFqdeT.XsIRH6S0DfqW8k8BcXb2KL0BdNxlTu2', 10, function(err, hash) {
        console.log(hash);
    });
    res.render('Main/login_admin', {layout:'Layouts/login_layout'});
});

router.post('/admin',login.provjeri_admina, function(req, res, next) {
    res.redirect('../admin/' + req.body.username);
});

module.exports = router;
