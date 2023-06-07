let id;
let prije_first_name;
let prije_last_name;
let prije_email;
function start(first_name, last_name, email, ID){
    document.getElementById ("first_name").value = first_name;
    document.getElementById ("last_name").value = last_name;
    document.getElementById ("email").value = email;
    prije_first_name = first_name;
    prije_last_name = last_name;
    prije_email = email;
    id = ID;

}

function reset_modal(){
    document.getElementById ("create_first_name").value = "";
    document.getElementById ("create_last_name").value = "";
    document.getElementById ("create_email").value = "";

}

$(document).ready(function(){

    $("#myModal").on("hidden.bs.modal", function (e) {
        $("#placeholder-div1").html("");
    });

    let code = document.getElementById('uzmi_kod').getAttribute('code');

    $("#edit_teacher").on("submit", function(event){
        event.preventDefault();
        let first_name = $("#first_name").val();
        let last_name = $("#last_name").val();
        let password = $("#password").val();
        let email = $("#email").val();
        let slika = $("#slika");
        const reader = new FileReader();

        if(first_name === '')
            first_name = prije_first_name;
        if(last_name === '')
            last_name = prije_last_name;
        if(email === '')
            email = prije_email;


        if(slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/admin/mjenjaj/" + id + "/" + code,
                    contentType: "application/json",
                    data: JSON.stringify({
                        email: email,
                        first_name: first_name,
                        last_name: last_name,
                        password: password,
                        slika: reader.result
                    }),
                    success: function (res) {
                        if (res.mogu)
                            window.location.href = "/admin/teachers/" + code;
                        else{
                            $("#postoji_email2").show();
                        }
                    }
                })
            })
        }else{
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/admin/teachers/mjenjaj/" + id + "/" + code,
                    contentType: "application/json",
                    data: JSON.stringify({
                        email: email,
                        first_name: first_name,
                        last_name: last_name,
                        password: password,
                        slika: reader.result
                    }),
                    success: function (res) {
                        if (res.mogu)
                            window.location.href = "/admin/teachers/" + code;
                        else{
                            $("#postoji_email2").show();
                        }
                    }
                })
            }
        if(slika[0].files[0] != null)
            reader.readAsDataURL(slika[0].files[0]);
    })

    $("#create_teacher").on("submit", function(event){
        event.preventDefault();
        sve_dobro = true;

        let first_name = $("#create_first_name").val();
        let last_name = $("#create_last_name").val();
        let password = $("#create_password").val();
        let email = $("#create_email").val();
        let slika = $("#create_slika");
        const reader = new FileReader()

        if (jQuery.isEmptyObject(first_name)){
            sve_dobro = false;
            $("#nije_unjeto_ime").show();
        }
        else
            $("#nije_unjeto_ime").hide();

        if (jQuery.isEmptyObject(last_name)){
            sve_dobro = false;
            $("#nije_unjeto_prezime").show();
        }
        else
            $("#nije_unjeto_prezime").hide();

        if (jQuery.isEmptyObject(email) || !email.includes('@')){
            sve_dobro = false;
            $("#nije_unjet_email").show();
        }
        else
            $("#nije_unjet_email").hide();

        if (jQuery.isEmptyObject(password)){
            sve_dobro = false;
            $("#nije_unjeta_sifra").show();
        }
        else
            $("#nije_unjeta_sifra").hide();

        if(slika[0].files[0] != null) {
            reader.addEventListener("load", () => {
                if (sve_dobro) {
                    $.ajax({
                        method: "POST",
                        action: "/upload",
                        url: "/register",
                        contentType: "application/json",
                        data: JSON.stringify({
                            email: email,
                            first_name: first_name,
                            last_name: last_name,
                            password: password,
                            slika: reader.result
                        }),
                        success: function (res) {
                            if (res.mogu)
                                window.location.href = "/admin/teachers/" + code;
                            else
                                $("#postoji_email").show();
                        }
                    })
                }

            })
        }else{
            if (sve_dobro) {
                $.ajax({
                    method: "POST",
                    action: "/upload",
                    url: "/register",
                    contentType: "application/json",
                    data: JSON.stringify({
                        email: email,
                        first_name: first_name,
                        last_name: last_name,
                        password: password,
                        slika: reader.result
                    }),
                    success: function (res) {
                        if (res.mogu)
                            window.location.href = "/admin/teachers/" + code;
                        else
                            $("#postoji_email").show();
                    }
                })
            }
        }
        if(slika[0].files[0] != null)
            reader.readAsDataURL(slika[0].files[0]);
    })

});