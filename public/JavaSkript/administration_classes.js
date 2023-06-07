
function reset_modal(){
    document.getElementById('teacher_name').value = "";
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


let ime_prije, about_prije, pocetak_prije, nacin_prije, do_kad_prije, id_orginala, prije_i, prije_first_name;

function start(ime, about, pocetak, nacin, do_kad, id, first_name, i){
    $("#postoji_teacher" + i).hide();
    $("#postoji_ime2" + i).hide();
    id_orginala = id;
    ime_prije = ime;
    about_prije = about;
    pocetak_prije = pocetak;
    nacin_prije = nacin;
    do_kad_prije = do_kad;
    prije_i = i;
    prije_first_name = first_name;
    pocetak = pretvori(pocetak);
    do_kad = pretvori(do_kad);

    document.getElementById('edit_name' + i).value = ime;
    document.getElementById('edit_about' + i).value = about;
    if(about === '')
        document.getElementById('edit_about' + i).value = "This is where you say a few words about the class (Not manditory)";
    document.getElementById('edit_pocetak' + i).value = pocetak;
    if(nacin === 'nikad')
        document.getElementById('edit_repeat_rule' + i).value = 1;
    if(nacin === 'sedmicno')
        document.getElementById('edit_repeat_rule' + i).value = 2;
    if(nacin === 'mjesecno')
        document.getElementById('edit_repeat_rule' + i).value = 3;

    document.getElementById('edit_do_kad' + i).value = do_kad;

}

$(document).ready(function() {

    let code = document.getElementById('uzmi_kod').getAttribute('code');

    $(".edit_class").on("submit", function (event) {
        let i = prije_i;
        event.preventDefault();
        sve_dobro = true;
        let name = $("#edit_name" + i).val();
        let about = $("#edit_about" + i).val();
        let pocetak = $("#edit_pocetak" + i).val();
        let repeat_rule = $("#edit_repeat_rule" + i).val();
        let do_kad = $("#edit_do_kad" + i).val();
        let slika = $("#edit_slika" + i);
        let teacher_name = $("#edit_teacher_name" + i).val();

        const reader = new FileReader();

        if (jQuery.isEmptyObject(name)) {
            sve_dobro = false;
            $("#no_name" + i).show();
        } else
            $("#no_name" + i).hide();

        if (jQuery.isEmptyObject(pocetak)) {
            sve_dobro = false;
            $("#no_pocetak" + i).show();
        } else
            $("#no_pocetak" + i).hide();

        if (jQuery.isEmptyObject(repeat_rule)) {
            sve_dobro = false;
            $("#no_repeat_rule").show();
        } else
            $("#no_repeat_rule").hide();

        if(jQuery.isEmptyObject(do_kad))
            do_kad = pretvori(new Date());

        if(do_kad < pocetak){
            sve_dobro = false;
            $("#no_do_kad" + i).show();
        } else
            $("#no_do_kad" + i).hide();


        if (about === 'This is where you say a few words about the class (Not manditory)')
            about = '';

        if (slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                if (sve_dobro) {
                    $.ajax({
                        method: "POST",
                        action: "/upload",
                        url: "/admin/classes/promijeni_predavanje/" + id_orginala + "/" + code,
                        contentType: "application/json",
                        data: JSON.stringify({
                            name: name,
                            about: about,
                            pocetak: pocetak,
                            repeat_rule: repeat_rule,
                            do_kad: do_kad,
                            slika: reader.result,
                            teacher_name: teacher_name
                        }),
                        success: function (res) {
                            if (res.mogu && res.predavanje)
                                window.location.href = "/admin/classes/" + code;
                            else if (res.predavanje)
                                $("#postoji_ime2" + i).show();
                            else
                                $("#postoji_teacher" + i).show();
                        }
                    })
                }

            })
        } else {
            if (sve_dobro) {
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/admin/classes/promijeni_predavanje/" + id_orginala + "/" + code,
                    contentType: "application/json",
                    data: JSON.stringify({
                        name: name,
                        about: about,
                        pocetak: pocetak,
                        repeat_rule: repeat_rule,
                        do_kad: do_kad,
                        slika: reader.result,
                        teacher_name: teacher_name
                    }),
                    success: function (res) {
                        if (res.mogu && res.predavanje)
                            window.location.href = "/admin/classes/" + code;
                        else if (res.predavanje)
                            $("#postoji_ime2" + i).show();
                        else
                            $("#postoji_teacher" + i).show();
                    }
                })
            }
        }
        if (slika[0].files[0] != null)
            reader.readAsDataURL(slika[0].files[0]);
    });

    $("#create_class").on("submit", function (event) {
        let i = prije_i;
        event.preventDefault();
        sve_dobro = true;
        let name = $("#name").val();
        let about = $("#about").val();
        let pocetak = $("#pocetak").val();
        let repeat_rule = $("#repeat_rule").val();
        let do_kad = $("#do_kad").val();
        let slika = $("#slika");
        let teacher_name = $("#teacher_name").val();
        console.log(name, about, pocetak, repeat_rule, do_kad, slika, teacher_name);

        const reader = new FileReader();

        if (jQuery.isEmptyObject(name)) {
            sve_dobro = false;
            $("#no_name").show();
        } else
            $("#no_name").hide();

        if (jQuery.isEmptyObject(pocetak)) {
            sve_dobro = false;
            $("#no_pocetak").show();
        } else
            $("#no_pocetak").hide();

        if (jQuery.isEmptyObject(repeat_rule)) {
            sve_dobro = false;
            $("#no_repeat_rule").show();
        } else
            $("#no_repeat_rule").hide();

        if(jQuery.isEmptyObject(do_kad))
            do_kad = pretvori(new Date());

        if(do_kad < pocetak){
            sve_dobro = false;
            $("#no_do_kad").show();
        } else
            $("#no_do_kad").hide();

        if (about === 'This is where you say a few words about the class (Not manditory)')
            about = '';

        if (slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                if (sve_dobro) {
                    $.ajax({
                        method: "POST",
                        action: "/upload",
                        url: "/admin/classes/dodaj" + "/" + code,
                        contentType: "application/json",
                        data: JSON.stringify({
                            name: name,
                            about: about,
                            pocetak: pocetak,
                            repeat_rule: repeat_rule,
                            do_kad: do_kad,
                            slika: reader.result,
                            teacher_name: teacher_name
                        }),
                        success: function (res) {
                            if (res.mogu && res.predavanje)
                                window.location.href = "/admin/classes/" + code;
                            else if (res.predavanje)
                                $("#postoji_ime" + i).show();
                            else
                                $("#postoji_teacher2" + i).show();
                        }
                    })
                }

            })
        } else {
            if (sve_dobro) {
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/admin/classes/dodaj" + "/" + code,
                    contentType: "application/json",
                    data: JSON.stringify({
                        name: name,
                        about: about,
                        pocetak: pocetak,
                        repeat_rule: repeat_rule,
                        do_kad: do_kad,
                        slika: reader.result,
                        teacher_name: teacher_name
                    }),
                    success: function (res) {
                        if (res.mogu && res.predavanje)
                            window.location.href = "/admin/classes/" + code;
                        else if (res.predavanje)
                            $("#postoji_ime").show();
                        else
                            $("#postoji_teacher").show();
                    }
                })
            }
        }
        if (slika[0].files[0] != null)
            reader.readAsDataURL(slika[0].files[0]);
    });


});