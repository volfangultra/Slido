
function reset_modal(){
    document.getElementById('teacher_name').value = "";
    document.getElementById('name').value = "";
    document.getElementById('about').value = "This is where you say a few words about the class (Not manditory)";
    document.getElementById('date').value = "";

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


let ime_prije, about_prije, datum_prije, id_orginala, prije_i, prije_first_name, prije_kod, prije_id;

function start(ime, about, datum, kod, id, first_name, i){
    $("#postoji_teacher" + i).hide();
    $("#postoji_ime2" + i).hide();
    id_orginala = id;
    ime_prije = ime;
    about_prije = about;
    datum_prije = datum;
    prije_kod = kod;
    prije_i = i;
    prije_first_name = first_name;
    prije_id = id;
    datum = pretvori(datum);

    document.getElementById('edit_name' + i).value = ime;
    document.getElementById('edit_about' + i).value = about;
    if(about === '')
        document.getElementById('edit_about' + i).value = "This is where you say a few words about the class (Not manditory)";

    document.getElementById('edit_datum' + i).value = datum;
    document.getElementById('edit_kod' + i).value = kod;

}

$(document).ready(function() {

    let code = document.getElementById('uzmi_kod').getAttribute('code');

    $(".edit_class").on("submit", function (event) {
        let i = prije_i;
        event.preventDefault();
        sve_dobro = true;
        let name = $("#edit_name" + i).val();
        let about = $("#edit_about" + i).val();
        let datum = $("#edit_datum" + i).val();
        let kod = $("#edit_kod" + i).val();
        let slika = $("#edit_slika" + i);
        let teacher_name = $("#edit_teacher_name" + i).val();
        console.log(teacher_name);

        const reader = new FileReader();

        if (jQuery.isEmptyObject(name)) {
            sve_dobro = false;
            $("#no_name" + i).show();
        } else
            $("#no_name" + i).hide();

        if (jQuery.isEmptyObject(datum)) {
            sve_dobro = false;
            $("#no_datum" + i).show();
        } else
            $("#no_datum" + i).hide();

        if(jQuery.isEmptyObject(kod)){
            sve_dobro = false;
            $("#no_kod2" + i).show();
        }else
            $("#no_kod2" + i).hide();

        if (about === 'This is where you say a few words about the class (Not manditory)')
            about = '';

        if (slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                if (sve_dobro) {
                    $.ajax({
                        method: "POST",
                        action: "/upload",
                        url: "/admin/classes/promijeni_odslusano_predavanje/" + prije_kod + "/" + code,
                        contentType: "application/json",
                        data: JSON.stringify({
                            name: name,
                            about: about,
                            datum: datum,
                            slika: reader.result,
                            teacher_name: teacher_name,
                            id_predavanja: prije_id
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
                    url: "/admin/classes/promijeni_odslusano_predavanje/" + prije_kod + "/" + code,
                    contentType: "application/json",
                    data: JSON.stringify({
                        name: name,
                        about: about,
                        datum: datum,
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

});