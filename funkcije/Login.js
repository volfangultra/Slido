const pg = require("pg");




function provjeri_logovanje(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/teacher');
    }
    next()
}

function daj_pristup(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
}

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
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function provjeri_admina(req, res, next){
    let username = req.body.username;
    let password = req.body.password;

    pool.query(`SELECT * FROM admin WHERE username = $1`, [username], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.rows.length > 0) {
            const user = results.rows[0];

            bcrypt.compare(password, user.sifra, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    req.body.username = encodeURIComponent(user.kolacic);

                    next();
                } else {
                    return res.redirect("/login/admin");
                }
            });
        } else
            return res.redirect("/login/admin");
    });

}

function provjeri_rutu_admina(req, res, next){
    provjera = req.params.provjera;
    pool.query(`SELECT * FROM admin WHERE kolacic = $1`, [decodeURIComponent(provjera)], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.rows.length > 0) {
            res.locals.username = results.rows[0].username;
            next();
        } else
            return res.redirect("/login/admin");
    });

}


function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        pool.query(`SELECT * FROM predavac WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.rows.length > 0) {
                const user = results.rows[0];

                bcrypt.compare(password, user.sifra, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        if(user.blokiran_do === null || user.blokiran_do < Date.now())
                            return done(null, user);
                        else
                            return done(null, false, {message: "You are blocked"});
                    } else {
                        return done(null, false, { message: "Password is incorrect" });
                    }
                });
            } else
                return done(null, false, { message: "No user with that email address" });

        });
    };
    passport.use(
        new LocalStrategy(
            { usernameField: "email", passwordField: "password" },
            authenticateUser
        )
    );
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM predavac WHERE id = $1`, [id], (err, results) => {
            if (err) {
                return done(err);
            }
            if(results.rows[0].blokiran_do === null || results.rows[0].blokiran_do < Date.now())
                return done(null, results.rows[0]);
            else
                return done(null, false, {message: "You are blocked"});
        });
    });
}

module.exports = {initialize, provjeri_logovanje, daj_pristup, provjeri_admina, provjeri_rutu_admina};