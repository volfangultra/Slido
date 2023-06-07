const pg = require("pg");
const kript = require("bcrypt");

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

function napravi_predavanje(req, res, next){
    pool.query('SELECT * FROM ODSLUSANO_PREDAVANJE WHERE ID = $1',[req.params.kod], (err, results) =>{
        if(err)
            throw err;
        if(results.rows.length === 0){
            pool.query(`INSERT INTO ODSLUSANO_PREDAVANJE(ID, ID_PREDAVANJA)  VALUES($1, $2)`, [req.params.kod, req.body.class.id], (err, results)=>{
                if(err)
                    throw err;
                console.log(req.params.kod, req.body.class.id);
                next();
            });
        }
        else
            next();
    });
}

function promijeni_korisnika(req, res, next){
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let id = req.params.id;
    let profile_image = req.params.slika;
    if(profile_image === undefined)
        profile_image = '';

    if(password === '')
        pool.query(`CALL PROMIJENI_PREDAVACA($1, $2, $3, $4, $5, $6)`, [id, first_name, last_name, email, password, profile_image], (err, results) => {
            if (err) {
                throw err;
            }
            next();
        });
    else
        kript.hash(password, 10, function(err, hash) {
            pool.query(`CALL PROMIJENI_PREDAVACA($1, $2, $3, $4, $5, $6)`, [id, first_name, last_name, email, hash, profile_image], (err, results) => {
                if (err) {

                    throw err;
                }
                next();
            });
        });

}

function provjeri_korisnika(req, res, next){
    let id = req.params.id;
    let email = req.body.email;
    pool.query(`SELECT * FROM PREDAVAC WHERE EMAIL = $1 AND ID != $2`, [email, id], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            next();
        else
            return res.send({mogu:false});
    });
}



function obrisi(req, res, next){
    let id = req.params.id;
    pool.query(`DELETE FROM PREDAVAC WHERE ID = $1`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function blokiraj(req, res, next){
    let id = req.params.id;

    pool.query(`call blokiraj_predavaca($1)`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function deblokiraj(req, res, next){
    let id = req.params.id;

    pool.query(`call deblokiraj_predavaca($1)`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function daj_casove(req, res, next){
    let id = req.user.id;
    pool.query(`SELECT * FROM PREDAVANJA WHERE ID_PREDAVACA = $1 AND KRAJ >= NOW() - INTERVAL '1 days' ORDER BY POCETAK`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.casovi = results.rows;
        next();
    });

}

function provjeri_predavanje(req, res, next){
    pool.query(`SELECT * FROM PREDAVANJA WHERE IME = $1 AND ID_PREDAVACA = $2`, [req.body.name, req.user.id], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            next();
        else
            return res.send({mogu:false});
    });
}

function provjeri_edit_predavanje(req, res, next){
    pool.query(`SELECT * FROM PREDAVANJA WHERE IME = $1 AND ID_PREDAVACA = $2 AND NOT ID = $3`, [req.body.name, req.user.id, req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            next();
        else
            return res.send({mogu:false});
    });
}

function generate_kod(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function dodaj_predavanje(req, res, next){
    if(req.body.repeat_rule === '1')
        req.body.repeat_rule = 'nikad';
    if(req.body.repeat_rule === '2')
        req.body.repeat_rule = 'sedmicno';
    if(req.body.repeat_rule === '3')
        req.body.repeat_rule = 'mjesecno';
    req.body.repeat_rule = req.body.repeat_rule.toString();
    let kod = generate_kod(6);
    pool.query(`insert into predavanja(id_predavaca, ime, pocetak, nacin, slika, about, kraj, kod) values($1, $2, $3, $4, $5, $6, $7,$8)`, [req.user.id, req.body.name, req.body.pocetak, req.body.repeat_rule, req.body.slika, req.body.about, req.body.do_kad, kod], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function promijeni_predavanje(req, res, next){
    if(req.body.repeat_rule === '1')
        req.body.repeat_rule = 'nikad';
    if(req.body.repeat_rule === '2')
        req.body.repeat_rule = 'sedmicno';
    if(req.body.repeat_rule === '3')
        req.body.repeat_rule = 'mjesecno';
    req.body.repeat_rule = req.body.repeat_rule.toString();
    if(req.body.slika != null)
        pool.query(`update predavanja set ime = $1, pocetak = $2, nacin = $3, slika = $4, about = $5, kraj = $6 where id = $7`, [req.body.name, req.body.pocetak, req.body.repeat_rule, req.body.slika, req.body.about, req.body.do_kad, req.params.id], (err, results) => {
            if (err) {
                throw err;
            }
            next();
        });
    else
        pool.query(`update predavanja set ime = $1, pocetak = $2, nacin = $3, about = $4, kraj = $5 where id = $6`, [req.body.name, req.body.pocetak, req.body.repeat_rule, req.body.about, req.body.do_kad, req.params.id], (err, results) => {
            if (err) {
                throw err;
            }
            next();
        });
}


function provjeri_predavaca_za_class(req, res, next){

    pool.query(`SELECT * FROM PREDAVAC WHERE FIRST_NAME = $1`, [req.body.teacher_name], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0){
            return res.send({predavanje:false});

        }
        else {
            req.body.id_predavaca = results.rows[0].id;
            next();
        }
    });

}

function provjeri_admin_predavanje(req, res, next){
    pool.query(`SELECT * FROM PREDAVANJA WHERE IME = $1 AND ID_PREDAVACA = $2 AND NOT ID = $3`, [req.body.name, req.body.id_predavaca, req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            next();
        else
            return res.send({mogu:false});
    });
}

function promijeni_predavanje_admin(req, res, next){
    if(req.body.repeat_rule === '1')
        req.body.repeat_rule = 'nikad';
    if(req.body.repeat_rule === '2')
        req.body.repeat_rule = 'sedmicno';
    if(req.body.repeat_rule === '3')
        req.body.repeat_rule = 'mjesecno';
    req.body.repeat_rule = req.body.repeat_rule.toString();
    if(req.body.slika != null)
        pool.query(`update predavanja set ime = $1, pocetak = $2, nacin = $3, slika = $4, about = $5, kraj = $6, id_predavaca = $8 where id = $7`, [req.body.name, req.body.pocetak, req.body.repeat_rule, req.body.slika, req.body.about, req.body.do_kad, req.params.id, req.body.id_predavaca], (err, results) => {
            if (err) {
                throw err;
            }
            next();
        });
    else
        pool.query(`update predavanja set ime = $1, pocetak = $2, nacin = $3, about = $4, kraj = $5, id_predavaca = $7 where id = $6`, [req.body.name, req.body.pocetak, req.body.repeat_rule, req.body.about, req.body.do_kad, req.params.id, req.body.id_predavaca], (err, results) => {
            if (err) {
                throw err;
            }
            next();
        });
}

function obrisi_predavanje(req, res, next){
    let id = req.params.id;
    pool.query(`DELETE FROM PREDAVANJA WHERE ID = $1`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function dodaj_predavanje_admin(req, res, next){
    if(req.body.repeat_rule === '1')
        req.body.repeat_rule = 'nikad';
    if(req.body.repeat_rule === '2')
        req.body.repeat_rule = 'sedmicno';
    if(req.body.repeat_rule === '3')
        req.body.repeat_rule = 'mjesecno';
    req.body.repeat_rule = req.body.repeat_rule.toString();
    let kod = generate_kod(6);
    pool.query(`insert into predavanja(id_predavaca, ime, pocetak, nacin, slika, about, kraj, kod) values($1, $2, $3, $4, $5, $6, $7, $8)`, [req.body.id_predavaca, req.body.name, req.body.pocetak, req.body.repeat_rule, req.body.slika, req.body.about, req.body.do_kad, kod], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function postavi_active(req, res ,next){
    pool.query(`UPDATE PREDAVANJA SET ACTIVE = 1 WHERE KOD = $1`, [req.params.kod], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function vrati_active(req, res, next){
    pool.query(`UPDATE PREDAVANJA SET ACTIVE = 0 WHERE KOD = $1`, [req.params.kod], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function vrati_active_ez(kod){
    pool.query(`UPDATE PREDAVANJA SET ACTIVE = 0 WHERE KOD = $1`, [kod], (err, results) => {
        if (err) {
            throw err;
        }
    });
}

function provjeri_kod(req, res, next){
    pool.query(`SELECT * FROM PREDAVANJA WHERE KOD = $1 AND ACTIVE = 1`, [req.params.kod], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            return res.redirect('/');
        req.body.class = results.rows[0];
        next();
    });
}


function obrisi_odslusano_predavanje(req, res, next){
    let id = req.params.id;
    pool.query(`DELETE FROM ODSLUSANO_PREDAVANJE WHERE ID = $1`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

module.exports = {  promijeni_korisnika, provjeri_korisnika, obrisi, blokiraj,
                    deblokiraj, daj_casove, dodaj_predavanje, provjeri_predavanje,
                    provjeri_edit_predavanje, promijeni_predavanje, provjeri_predavaca_za_class,
                    promijeni_predavanje_admin, provjeri_admin_predavanje, obrisi_predavanje,
                    dodaj_predavanje_admin, provjeri_kod, postavi_active, vrati_active,
                    vrati_active_ez, napravi_predavanje, generate_kod, obrisi_odslusano_predavanje};
