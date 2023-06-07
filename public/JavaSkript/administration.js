function reset_modal(){
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function start(username){
    document.getElementById ("change_username").value = username;
}


$(document).ready(function(){
    var edit_admin = document.getElementById('edit_admin')
    edit_admin.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var recipient = button.getAttribute('izvor_informacije');
        var modalTitle = edit_admin.querySelector('.modal-title');

        modalTitle.textContent = recipient;
    });

    $("#edit_admin").on("submit", function(event){
        event.preventDefault();
        let predhodno_ime = edit_admin.querySelector('.modal-title').textContent;
        let username = $("#change_username").val();
        let password = $("#change_password").val();
        if(username.length === 0)
            username = predhodno_ime;


        let code = document.getElementById('uzmi_kod').getAttribute('code');

        $.ajax({
            method: "POST",
            action: "/upload",
            url:"/admin/mjenjaj/" + code,
            contentType:"application/json",
            data: JSON.stringify({predhodno_ime:predhodno_ime, username:username, password:password}),
            success: function(res){
                    if(res.mogu === false)
                        document.getElementById('postoji').style.display = "block";
                    else
                        window.location.href = "/admin/" + code;
            }
        })

    });

    $("#create_admin").on("submit", function(event){
        event.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();
        if(username.length === 0){
            document.getElementById('retype_username').style.display = "block";
        }else if(password.length === 0){
            document.getElementById('retype_username').style.display = "none";
            document.getElementById('retype_password').style.display = "block";
        }else{
            document.getElementById('retype_username').style.display = "none";
            document.getElementById('retype_password').style.display = "none";
            let code = document.getElementById('uzmi_kod').getAttribute('code');

            $.ajax({
                method: "POST",
                action: "/upload",
                url:"/admin/dodaj/" + code,
                contentType:"application/json",
                data: JSON.stringify({username:username, password:password}),
                success: function(res){
                    if(res.mogu === false)
                        document.getElementById('postoji_create').style.display = "block";
                    else
                        window.location.href = "/admin/" + code;
                }
            })
        }
    });
});

