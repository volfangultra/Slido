var express = require('express');
var router = express.Router();
const login = require('../funkcije/Login');
const teacher = require('../funkcije/Teacher');
const predavanje = require('../funkcije/Predavanje');
const ip_adresa = '172.22.2.100';
const pg = require("pg");
var io = null;
const domena = predavanje.domena;



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


/* GET home page. */
router.get('/teacher/:kod',login.daj_pristup, teacher.postavi_active, teacher.provjeri_kod, teacher.napravi_predavanje, predavanje.uzmi_korsinike, function(req,res,next){
  if(!io) {
    io = require('socket.io')(req.connection.server);
    io.sockets.on('connection', function (client) {
      client.on('sortiraj_po_vremenu', function(kod,id){
        pool.query('SELECT * from povezana_pitanja WHERE ID_PREDAVANJA = $1 ORDER BY VRIJEME DESC', [kod], (err, results) => {
          if (err) {
            throw err;
          }
          io.sockets.to(id).emit('sve_poruke', results.rows);
        })
      })
      client.on('sortiraj_po_lajkovima', function(kod,id){
        pool.query('SELECT * from povezana_pitanja WHERE ID_PREDAVANJA = $1 ORDER BY LAJKOVI DESC, VRIJEME DESC', [kod], (err, results) => {
          if (err) {
            throw err;
          }
          io.sockets.to(id).emit('sve_poruke', results.rows);
        })
      })
      client.on('dosao_klijent', function (d, kod) {
        client.join(kod);
        predavanje.ubaci_korisnika(client.id, d, kod);
        pool.query(`SELECT * from povezana_pitanja WHERE ID_PREDAVANJA = $1 AND JE_ODGOVORENO = 0 AND JE_SAKRIVENO = 0 ORDER BY VRIJEME DESC`, [kod], (err, results) => {
          if (err) {
            throw err;
          }
          io.sockets.in(kod).emit('sve_poruke', results.rows);
        });
      })
      client.on('dosao_teacher', function (d) {
        client.join(d);
        req.body.teacher = client.id;
        pool.query('SELECT * from povezana_pitanja WHERE ID_PREDAVANJA = $1 ORDER BY VRIJEME DESC', [d], (err, results) => {
          if (err) {
            throw err;
          }
          io.sockets.in(d).emit('sve_poruke', results.rows);
        });
      })
      client.on('teacher_update', function(d){
        pool.query('SELECT * from povezana_pitanja WHERE ID_PREDAVANJA = $1 ORDER BY VRIJEME DESC', [d], (err, results) => {
          if (err) {
            throw err;
          }
          io.sockets.in(d).emit('sve_poruke', results.rows);
        })
      })
      client.on('klijent_salje_poruku', function (d, kod) {
        pool.query('SELECT * FROM zabranjene_rijeci', [], (err, zabranjene_rijeci)=>{
          let temp = d.toLowerCase();
          let je_sakriveno = 0;
          for(let el of zabranjene_rijeci.rows){
            el = el.rijec.toLowerCase();
            if(temp.includes(el))
              je_sakriveno = 1;
          }
          pool.query(`INSERT INTO PITANJA(id_korisnika, pitanje, je_sakriveno) values($1, $2, $3)`, [client.id, d, je_sakriveno], (err, rezultat) => {
            if (err) {
              throw err;
            }
            pool.query('SELECT * from povezana_pitanja WHERE ID_PREDAVANJA = $1 ORDER BY VRIJEME DESC', [kod], (err, results)=>{
              if(err)
                throw err;
              io.sockets.in(kod).emit('sve_poruke', results.rows);
            })
          });
        });
      });
      client.on('izaso', function (kod, tip, izvjestaj, poruke) {
          predavanje.pomjeri_pocetak(kod, tip);
          io.sockets.in(kod).emit('end');
          teacher.vrati_active_ez(kod);
          predavanje.promijeni_kod(kod);
          if(izvjestaj)
            predavanje.pokupi_izvjestaj(kod, poruke);
      })
      client.on('salji_mail', function(kod, osoba){
        console.log(kod, osoba);
        predavanje.posalji_mail(kod, osoba);
      })
  });
  }
  res.render('Main/predavanje', {layout:'Layouts/teacher_layout', cas:req.body.class, first_name:req.user.first_name, profile_image:req.user.profile_image, Id:req.user.id, domena:predavanje.domena});
});

router.post('/teacher/:kod',login.daj_pristup, teacher.vrati_active, teacher.provjeri_kod);
router.post('/dodaj_like/:kod/:id', teacher.provjeri_kod, predavanje.dodaj_like);
router.post('/oduzmi_like/:kod/:id', teacher.provjeri_kod, predavanje.smanji_like);
router.post('/ocijeni', predavanje.ocijeni);

router.get('/:kod', teacher.provjeri_kod,predavanje.uzmi_korsinike, function(req, res, next) {
  res.render('Main/listener', { layout: 'Layouts/listener_layout', cas : req.body.class, blokiraj:"true", domena:predavanje.domena});
})

router.get('/oznaci_pitanje/:id/:kod', login.daj_pristup, predavanje.oznaci_pitanje, function(req, res, next){
  res.redirect('/poruke/teacher/' + req.params.kod)
})

router.get('/ne_oznaci_pitanje/:id/:kod', login.daj_pristup, predavanje.ne_oznaci_pitanje, function(req, res, next){
  res.redirect('/poruke/teacher/' + req.params.kod)
})

router.get('/odgovori_pitanje/:id/:kod', login.daj_pristup, predavanje.odgovori_pitanje, function(req, res, next){
  res.redirect('/poruke/teacher/' + req.params.kod)
})

router.get('/sakriji_pitanje/:id/:kod', login.daj_pristup, predavanje.sakriji_pitanje, function(req, res, next){
  res.redirect('/poruke/teacher/' + req.params.kod)
})

router.get('/brisi_pitanje/:id/:kod', login.daj_pristup, predavanje.obrisi_pitanje, function(req, res, next){
  res.redirect('/poruke/teacher/' + req.params.kod)
})

router.get('/otkriji_pitanje/:id/:kod', login.daj_pristup, predavanje.otkriji_pitanje, function(req, res, next){
  res.redirect('/poruke/teacher/' + req.params.kod)
})



module.exports = router;
