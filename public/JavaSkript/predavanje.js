var socket = io.connect('ws://localhost:3000');

socket.on('poruka_sa_servera', function (d) {
    document.getElementById('poruke').innerHTML += d;
});

socket.on('sve_poruke', function (d) {
    let rez = "";
    d.forEach(item => {rez += item.pitanje;})
    document.getElementById('poruke').innerHTML = rez;
});

socket.emit('dosao_klijent', 'MACA', kod);

function posaljiPoruku() {
    let tekst = document.getElementById('tekst_poruke').value;
    socket.emit('klijent_salje_poruku', tekst);
}

socket.on('end', function(){
    window.location.href="/";
})