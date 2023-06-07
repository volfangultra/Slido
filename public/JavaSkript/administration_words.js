function reset_modal(){
    document.getElementById('word').value = '';
}

let id_orginala;
function start(word, id){
    document.getElementById ("edit_word").value = word;
    id_orginala = id;
}


$(document).ready(function(){

    $("#change_word").on("submit", function(event){
        event.preventDefault();
        sve_dobro = true;
        let word = $("#edit_word").val();
        if(jQuery.isEmptyObject(word)){
            sve_dobro = false;
            $("#edit_nije_prazno").show();
        }
        else
            $("#edit_nije_prazno").hide();


        let code = document.getElementById('uzmi_kod').getAttribute('code');
        if(sve_dobro)
            $.ajax({
                method: "POST",
                action: "/upload",
                url:"/admin/forbiden_words/mjenjaj/" + id_orginala + "/" + code,
                contentType:"application/json",
                data: JSON.stringify({word:word}),
                success: function(res){
                        if(res.mogu === false)
                            document.getElementById('edit_postoji').style.display = "block";
                        else
                            window.location.href = "/admin/forbiden_words/" + code;
                }
            })

    });

    $("#create_word").on("submit", function(event){
        event.preventDefault();
        sve_dobro = true;
        let word = $("#word").val();
        if(jQuery.isEmptyObject(word)){
            sve_dobro = false;
            $("#nije_prazno").show();
        }
        else
            $("#nije_prazno").hide();


        let code = document.getElementById('uzmi_kod').getAttribute('code');

        if(sve_dobro)
            $.ajax({
                method: "POST",
                action: "/upload",
                url:"/admin/forbiden_words/dodaj/" + code,
                contentType:"application/json",
                data: JSON.stringify({word:word}),
                success: function(res){
                    if(res.mogu === false)
                        document.getElementById('postoji').style.display = "block";
                    else
                        window.location.href = "/admin/forbiden_words/" + code;
                }
            })
    });
});

