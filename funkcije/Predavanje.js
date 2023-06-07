const pg = require("pg");
const teacher = require("../funkcije/Teacher")
const nodemailer = require('nodemailer');
const domena = '172.22.2.100:3000';



let config = {
    user: 'postgres', //env var: PGUSER
    database: 'slidobaza', //env var: PGDATABASE
    password: 'Lord3sc@nor1601', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};



const pool = new pg.Pool(config);

function uzmi_poruke(req, res, next){
    pool.query(`SELECT * FROM PITANJA AS P JOIN KORISNIK AS K ON P.ID_KORISNIKA = K.ID WHERE K.ID_PREDAVANJA = $1`, [req.body.class.id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.poruke = results.rows;
        next();
    });
}

function uzmi_korsinike(req, res, next){
    pool.query(`SELECT * FROM KORISNIK WHERE ID_PREDAVANJA = $1`, [req.body.class.id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.korisnici = results.rows;
        next();
    });
}

function ubaci_poruku(id_korisnika, pitanje){
    pool.query(`INSERT INTO PITANJA(id_korisnika, pitanje) values($1, $2)`, [id_korisnika, pitanje], (err, results) => {
        if (err) {
            throw err;
        }
    });
}

function ubaci_korisnika(id, ime, id_predavanja){
    pool.query(`INSERT INTO KORISNIK(id, ime, id_predavanja) values($1, $2, $3)`, [id, ime, id_predavanja], (err, results) => {
        if (err) {
            throw err;
        }
    });
}

function promijeni_kod(id){
    let kod = teacher.generate_kod(6);
    pool.query(`UPDATE PREDAVANJA SET KOD = $1 WHERE KOD = $2`, [kod, id], (err, results) => {
        if (err) {
            throw err;
        }
    });

}
function pomjeri_pocetak(id,tip){
    let danas = new Date();
    danas.setHours(0,0,0,0);
    danas.setHours(0,0,0,0);
    if(tip === 'sedmicno'){
        danas.setDate(danas.getDate() + 7);
    }
    if(tip === 'mjesecno'){
        danas.setMonth(danas.getMonth()+1);
    }
    if(tip === 'nikad'){
        danas.setFullYear(danas.getFullYear() + 2000);
    }
    pool.query(`UPDATE PREDAVANJA SET POCETAK = $1 WHERE KOD = $2`, [danas, id], (err, results) => {
        if (err) {
            throw err;
        }
    });
}

function oznaci_pitanje(req, res, next){
    pool.query(`UPDATE PITANJA SET JE_OZNACENO = 1, VRIJEME = NOW() WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function ne_oznaci_pitanje(req, res, next){
    pool.query(`UPDATE PITANJA SET JE_OZNACENO = 0 WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function obrisi_pitanje(req, res, next){
    pool.query(`DELETE FROM PITANJA WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function sakriji_pitanje(req, res, next){
    pool.query(`UPDATE PITANJA SET JE_SAKRIVENO = 1 WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function otkriji_pitanje(req, res, next){
    pool.query(`UPDATE PITANJA SET JE_SAKRIVENO = 0 WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function odgovori_pitanje(req, res, next){
    console.log(req.params.id);
    pool.query(`UPDATE PITANJA SET JE_ODGOVORENO = 1 WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function dodaj_like(req, res, next){
    pool.query(`UPDATE PITANJA SET LAJKOVI = LAJKOVI + 1 WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        return res.send();
    });
}

function smanji_like(req, res, next){
    pool.query(`UPDATE PITANJA SET LAJKOVI = LAJKOVI - 1 WHERE ID = $1`, [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        return res.send();
    });
}

function daj_protekle_casove(req, res ,next){
    let id = req.user.id;
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE WHERE ID_PREDAVACA = $1 ORDER BY DATUM ASC`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.casovi = results.rows;
        next();
    });
}

function daj_casove_abecedno(req, res ,next){
    let id = req.user.id;
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE WHERE ID_PREDAVACA = $1 ORDER BY IME_PREDAVANJA ASC`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.casovi = results.rows;
        next();
    });
}

function daj_casove_kvalitetno(req, res ,next){
    let id = req.user.id;
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE WHERE ID_PREDAVACA = $1 AND BROJ_PITANJA <> 0 ORDER BY CAST(BROJ_ODGOVORENIH_PITANJA AS DECIMAL)/BROJ_PITANJA DESC`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.casovi = results.rows;
        next();
    });
}

function daj_casove_kvantitetno(req, res ,next){
    let id = req.user.id;
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE WHERE ID_PREDAVACA = $1 ORDER BY BROJ_ODGOVORENIH_PITANJA DESC`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.casovi = results.rows;
        next();
    });
}

function daj_casove_rating(req, res ,next){
    let id = req.user.id;
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE WHERE ID_PREDAVACA = $1 ORDER BY PROSJECNA_OCJENA DESC`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.casovi = results.rows;
        next();
    });
}

function daj_pitanja(req, res, next){
    let id = req.params.id;
    pool.query(`select * from pitanja join korisnik k on pitanja.id_korisnika = k.id where k.id_predavanja = $1`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.pitanja = results.rows;
        next();
    });
}

function daj_cas(req, res, next){
    let id = req.params.id
    pool.query(`select * from odslusano_predavanje join predavanja p on odslusano_predavanje.id_predavanja = p.id where odslusano_predavanje.id = $1`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.cas = results.rows[0];
        next();
    });
}

function ocijeni(req, res, next){
    console.log("Here");
    console.log(req.body.ocjena, req.body.id_korisnika);
    pool.query(`UPDATE KORISNIK SET OCJENA = $1 WHERE ID = $2`, [req.body.ocjena, req.body.id_korisnika], (err, results) => {
        if (err) {
            throw err;
        }
        return res.send();
    });
}

function pokupi_izvjestaj(kod, pitanja){
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE WHERE kod = $1`, [kod], (err, results) => {
        if (err) {
            throw err;
        }
        let info = results.rows[0];
        let rez = "<dl>";
        for(let i = 0; i < pitanja.length; i++)
            rez += '<dt>'+ pitanja[i].ime + '</dt>' + '<dd>' + pitanja[i].pitanje + ' (' + pitanja[i].lajkovi + ')' + '</dd>';
        rez += '</dl>';
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: 'slidopmf@outlook.com',
                pass: 'matematika12'
            }
        })
        const options = {
            from:'slidopmf@outlook.com',
            to: info.email,
            subject:"Statistics of " + info.ime_predavanja,
            html:   "<h1>Statistics</h1><ul>" +
                    "<li><strong>Number of Questions: </strong>" + info.broj_pitanja + "</li>" +
                    "<li><strong>Number of Answered Questions: </strong>" + info.broj_odgovorenih_pitanja + "</li>" +
                    "</ul><br><h1>Questions</h1>" + rez
        }
        transporter.sendMail(options, function(err, info){
        });

    });
}

function posalji_mail(kod, gosti){
    pool.query(`SELECT * FROM PREDAVANJA WHERE KOD = $1`, [kod], (err, results) => {
        if (err) {
            throw err;
        }
        let info = results.rows[0];
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: 'slidopmf@outlook.com',
                pass: 'matematika12'
            }
        })
        const options = {
            from:'slidopmf@outlook.com',
            to: gosti,
            subject:"Join class " + info.ime,
            html: "<h1 style='text-align: center'>You can join class with http://"  + domena + "/poruke/" + kod + '</h1>' + "<p>This class is about: " + info.about + "</p>"
        }
        transporter.sendMail(options, function(err, info){
        });

    });

}

module.exports = {  ocijeni, dodaj_like, smanji_like, daj_cas, daj_pitanja, daj_casove_kvantitetno, daj_casove_kvalitetno, daj_protekle_casove, daj_casove_abecedno,
                    ne_oznaci_pitanje, ubaci_korisnika, ubaci_poruku, uzmi_korsinike, pomjeri_pocetak, promijeni_kod, oznaci_pitanje, odgovori_pitanje, obrisi_pitanje,
                    sakriji_pitanje, otkriji_pitanje, daj_casove_rating, pokupi_izvjestaj, posalji_mail, domena};
