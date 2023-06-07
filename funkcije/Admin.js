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

function izlistaj_admins(req, res, next){
    pool.query(`SELECT * FROM admin ORDER BY ID ASC`, [], (err, results) => {
        if (err) {
            throw err;
        }
        res.locals.admini = results.rows;
        next();

    });

}

function izlistaj_teachers(req, res, next){
    pool.query(`SELECT * FROM predavac order by id asc`, [], (err, results) => {
        if (err) {
            throw err;
        }
        res.locals.teachers = results.rows;
        next();

    });

}

function izlistaj_classes(req, res, next){
    pool.query(`SELECT p.id, p.ime, p.about, p.pocetak, p.kraj, p.nacin, p.slika, t.first_name FROM predavanja as p join predavac as t on p.id_predavaca = t.id where p.kraj >= NOW() - INTERVAL '1 days' and p.pocetak <= p.kraj;`, [], (err, results) => {
        if (err) {
            throw err;
        }
        res.locals.classes = results.rows;
        next();

    });

}

function izlistaj_forbbiden_words(req, res, next){
    pool.query(`SELECT * FROM zabranjene_rijeci`, [], (err, results) => {
        if (err) {
            throw err;
        }
        res.locals.words = results.rows;
        next();

    });

}

function provjeri_korisnika(req, res, next){
    let username = req.body.username;
    let predhodno_ime = req.body.predhodno_ime;
    if(username === predhodno_ime)
        next();
    else
        pool.query(`SELECT * FROM ADMIN WHERE USERNAME = $1`, [username], (err, results) => {
            if (err) {
                throw err;
            }
            if(results.rows.length === 0){
                next();
            }
            else{
                return res.send({mogu:false});
            }
        });
}

function napravi_cookie(req,res,next){
    let username = req.body.username;
    let predhodno_ime = req.body.predhodno_ime;
    let password = req.body.password;
    if(password.length === 0){
        pool.connect(function (err, client, done) {
            pool.query(`SELECT * FROM ADMIN WHERE USERNAME = $1`, [predhodno_ime], function (err, results) {
                done();
                if (err) {
                    return res.send(err);
                } else
                    kript.hash(username + results.rows[0].password, 10, function(err, hash) {
                        res.locals.cookie = hash;
                        next();
                    });
            });
        });
    }else
        kript.hash(username + password, 10, function(err, hash) {
            res.locals.cookie = hash;
            next();
        });
}

function dodaj_novog(req, res, next){
    let username = req.body.username;
    let password = req.body.password;

    kript.hash(password, 10, function(err, hash1) {
        kript.hash(username + hash1, 10, function(err, hash2){
            pool.query(`INSERT INTO ADMIN (USERNAME, SIFRA, KOLACIC) VALUES($1, $2, $3)`, [username, hash1, hash2], (err, results) => {
                if (err) {
                    throw err;
                }
                next();
            });
        });
    });
}

function promijeni_korisnika(req, res, next){
    let username = req.body.username;
    let password = req.body.password;
    let predhodno_ime = req.body.predhodno_ime;

    kript.hash(password, 10, function(err, hash) {
        pool.query(`CALL PROMIJENI_ADMINA($1, $2, $3, $4)`, [username, hash, predhodno_ime, res.locals.cookie], (err, results) => {
            if (err) {
                throw err;
            }
            next();
        });
    });

}

function obrisi(req, res, next){
    let username = req.params.id;
    pool.query(`DELETE FROM ADMIN WHERE ID = $1`, [username], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function provjeri_rijec(req,res,next){
    pool.query(`SELECT * FROM ZABRANJENE_RIJECI WHERE RIJEC = $1`, [req.body.word], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            next();
        else
            return res.send({mogu:false});
    });

}

function mjenjaj_rijec(req, res, next){
    pool.query(`UPDATE ZABRANJENE_RIJECI SET RIJEC = $1 WHERE ID = $2`, [req.body.word, req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        if(results.rows.length === 0)
            next();
        else
            return res.send({mogu:false});
    });

}

function ubaci_rijec(req, res, next){
    pool.query(`INSERT INTO ZABRANJENE_RIJECI (RIJEC) values($1)`, [req.body.word], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function brisi_rijec(req, res, next){
    pool.query('DELETE FROM ZABRANJENE_RIJECI WHERE ID = $1', [req.params.id], (err, results) => {
        if (err) {
            throw err;
        }
        next();
    });
}

function uzmi_predhodne_casove(req, res ,next){
    pool.query(`SELECT * FROM SPOJENO_PREDAVANJE ORDER BY IME_PREDAVANJA ASC`, [], (err, results) => {
        if (err) {
            throw err;
        }
        req.body.classes = results.rows;
        next();
    });
}

module.exports = {uzmi_predhodne_casove, izlistaj_admins, izlistaj_teachers, izlistaj_forbbiden_words, izlistaj_classes, promijeni_korisnika, provjeri_korisnika, napravi_cookie, dodaj_novog, obrisi, provjeri_rijec, mjenjaj_rijec, brisi_rijec, ubaci_rijec};
