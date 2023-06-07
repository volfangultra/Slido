var socket = io.connect('ws://localhost:3000');

socket.on('poruka_sa_servera', function (d) {
    document.getElementById('poruke').innerHTML += d;
});

socket.emit('dosao_teacher', kod);