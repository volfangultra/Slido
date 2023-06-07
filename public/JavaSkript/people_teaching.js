
function reset_modal(){
    document.getElementById('name').value = "";
    document.getElementById('about').value = "This is where you say a few words about the class (Not manditory)";
    document.getElementById('pocetak').value = "";
    document.getElementById('repeat_rule').value = 1;
    document.getElementById('do_kad').value = "";

}

function pretvori(date){
    date = new Date(date);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    date = year + "-" + month + "-" + day;
    return date;

}


let ime_prije, about_prije, pocetak_prije, nacin_prije, do_kad_prije, id_orginala;

function start(ime, about, pocetak, nacin, do_kad, id, vrijeme, kod){
    id_orginala = id;
    ime_prije = ime;
    about_prije = about;
    pocetak_prije = pocetak;
    nacin_prije = nacin;
    do_kad_prije = do_kad;
    if(pretvori(vrijeme) === pretvori(new Date())){
        window.location.href = "/poruke/teacher/" + kod;
    }

    pocetak = pretvori(pocetak);
    do_kad = pretvori(do_kad);

    document.getElementById('edit_name').value = ime;
    document.getElementById('edit_about').value = about;
    if(about === '')
        document.getElementById('edit_about').value = "This is where you say a few words about the class (Not manditory)";
    document.getElementById('edit_pocetak').value = pocetak;
    if(nacin === 'nikad')
        document.getElementById('edit_repeat_rule').value = 1;
    if(nacin === 'sedmicno')
        document.getElementById('edit_repeat_rule').value = 2;
    if(nacin === 'mjesecno')
        document.getElementById('edit_repeat_rule').value = 3;

    document.getElementById('edit_do_kad').value = do_kad;

}

function brisi(){
    console.log("Hello");
    window.location.href = "/teacher/obrisi_predavanje/" + id_orginala;
}

$(document).ready(function() {

    $("#create_class").on("submit", function (event) {
        event.preventDefault();
        sve_dobro = true;
        let name = $("#name").val();
        let about = $("#about").val();
        let pocetak = $("#pocetak").val();
        let repeat_rule = $("#repeat_rule").val();
        let do_kad = $("#do_kad").val();
        let slika = $("#slika");
        const reader = new FileReader();

        if (jQuery.isEmptyObject(name)){
            $("#no_name").show();
        }
        else
            $("#no_name").hide();

        if (jQuery.isEmptyObject(pocetak)){
            $("#no_pocetak").show();
        }
        else
            $("#no_pocetak").hide();

        if (jQuery.isEmptyObject(repeat_rule)){
            $("#no_repeat_rule").show();
        }
        else
            $("#no_repeat_rule").hide();

        if(jQuery.isEmptyObject(do_kad))
            do_kad = pretvori(new Date());

        if(do_kad < pocetak){
            sve_dobro = false;
            $("#no_do_kad").show();
        } else
            $("#no_do_kad").hide();

        if(about === 'This is where you say a few words about the class (Not manditory)')
            about = '';

        if(slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                if (sve_dobro) {
                    $.ajax({
                        method: "POST",
                        action: "/upload",
                        url: "/teacher/dodaj_predavanje",
                        contentType: "application/json",
                        data: JSON.stringify({
                            name : name,
                            about : about,
                            pocetak : pocetak,
                            repeat_rule : repeat_rule,
                            do_kad : do_kad,
                            slika : reader.result,
                        }),
                        success: function (res) {
                            if (res.mogu)
                                window.location.href = "/teacher";
                            else
                                $("#postoji_ime").show();

                        }
                    })
                }

            })
        }else{
            if (sve_dobro) {
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/teacher/dodaj_predavanje/",
                    contentType: "application/json",
                    data: JSON.stringify({
                        name : name,
                        about : about,
                        pocetak : pocetak,
                        repeat_rule : repeat_rule,
                        do_kad : do_kad,
                        slika : reader.result,
                    }),
                    success: function (res) {
                        if(res.mogu)
                            window.location.href = "/teacher";
                        else
                            $("#postoji_ime").show();
                    }
                })
            }
        }
        if(slika[0].files[0] != null)
            reader.readAsDataURL(slika[0].files[0]);
    });


    $("#edit_class").on("submit", function (event) {
        event.preventDefault();
        sve_dobro = true;
        let name = $("#edit_name").val();
        let about = $("#edit_about").val();
        let pocetak = $("#edit_pocetak").val();
        let repeat_rule = $("#edit_repeat_rule").val();
        let do_kad = $("#edit_do_kad").val();
        let slika = $("#edit_slika");
        const reader = new FileReader();


        if (jQuery.isEmptyObject(name)){
            name = ime_prije;
        }

        if (jQuery.isEmptyObject(pocetak)){
            pocetak = pretvori(pocetak_prije);
        }

        if (jQuery.isEmptyObject(repeat_rule)){
            repeat_rule = nacin_prije;
        }

        if (jQuery.isEmptyObject(do_kad)){
            do_kad = pretvori(do_kad_prije);
        }

        if(jQuery.isEmptyObject(do_kad))
            do_kad = pretvori(new Date());

        if(do_kad < pocetak){
            sve_dobro = false;
            $("#edit_no_do_kad").show();
        } else
            $("#edit_no_do_kad").hide();

        if(about === 'This is where you say a few words about the class (Not manditory)')
            about = '';
        if(slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                if (sve_dobro) {
                    $.ajax({
                        method: "POST",
                        action: "/upload",
                        url: "/teacher/promijeni_predavanje/" + id_orginala,
                        contentType: "application/json",
                        data: JSON.stringify({
                            name : name,
                            about : about,
                            pocetak : pocetak,
                            repeat_rule : repeat_rule,
                            do_kad : do_kad,
                            slika : reader.result,
                        }),
                        success: function (res) {
                            if (res.mogu)
                                window.location.href = "/teacher";
                            else
                                $("#postoji_ime").show();

                        }
                    })
                }

            })
        }else{
            if (sve_dobro) {
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/teacher/promijeni_predavanje/" + id_orginala,
                    contentType: "application/json",
                    data: JSON.stringify({
                        name : name,
                        about : about,
                        pocetak : pocetak,
                        repeat_rule : repeat_rule,
                        do_kad : do_kad,
                        slika : reader.result,
                    }),
                    success: function (res) {
                        if(res.mogu)
                            window.location.href = "/teacher";
                        else
                            $("#postoji_ime").show();
                    }
                })
            }
        }
        if(slika[0].files[0] != null)
            reader.readAsDataURL(slika[0].files[0]);
    });

});