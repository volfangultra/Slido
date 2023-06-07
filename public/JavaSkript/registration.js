$(document).ready(function(){
    $("#register").on("submit", function(event){
        event.preventDefault();
        sve_dobro = true;
        var formData = new FormData(this);

        let first_name = $("#first_name").val();
        let last_name = $("#last_name").val();
        let password = $("#password").val();
        let email = $("#email").val();
        let repeat_password = $("#repeat_password").val();
        let slika = $("#slika");
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


        if (password === repeat_password)
            $("#nisu_jednake_sifre").hide();

        else{
            sve_dobro = false;
            $("#nisu_jednake_sifre").show();
        }

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
                        success: function (res) {;
                            if (res.mogu)
                                window.location.href = "/login";
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
                            window.location.href = "/login";
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

