const express = require('express');
const router = express.Router();
const register = require('../funkcije/Register');
const login = require("../funkcije/Login");

/* GET home page. */

router.get('/', login.provjeri_logovanje, (req, res) => {
    res.render('Main/register.ejs')
})

router.post('/', register.provjeri_usera_reg, register.ubaci_u_bazu, async (req, res) => {
    try {
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})



module.exports = router;
