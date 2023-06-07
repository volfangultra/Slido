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

function provjeri_usera_reg(req, res, next) {
    pool.connect(function (err, client, done) {
        let email = req.body.email;
        if (err) {
            return res.send(err);
        }
        client.query(`SELECT * FROM PREDAVAC WHERE email = $1;`, [email], function (err, result) {
            done();

            if (err)
                return res.send(err);
            else
                if(result.rows.length === 0)
                    next();
                else
                    return res.send({mogu:false});

        });
    });
}

function ubaci_u_bazu(req,res,next) {
    let email = req.body.email;
    let first_name =req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;
    let slika = req.body.slika;
    kript.hash(password, 10, function(err, hash) {
        pool.connect(function (err, client, done) {
            client.query(`INSERT INTO PREDAVAC(FIRST_NAME, LAST_NAME, EMAIL, SIFRA, PROFILE_IMAGE) VALUES($1,$2,$3,$4,$5)`, [first_name, last_name, email, hash, slika], function (err) {
                done();
                if (err) {
                    return res.send(err);
                } else {
                    res.send({mogu: true});
                }
            });
        });
    });

}

module.exports = {provjeri_usera_reg, ubaci_u_bazu}