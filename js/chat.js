/*
//Timer*/
var contextarray = [];
$(document).ready(function () {
    
    $("#kw-target").on('keydown', function (event) {
        if (event.keyCode == 13) {
            send_post();
            return false;
        }
    });
    $("#ai-btn").click(function () {
        send_post();
        return false;
    });
    function send_post() {

        var prompt = $("#kw-target").val();
        if (prompt == "") {
            layer.msg("Please ask your question", { icon: 5 });
            return;
        }

        var loading = layer.msg('Please wait a moment', {
            icon: 16,
            shade: 0.4,
            time:false
        });
        $.ajax({
            cache: true,
            type: "POST",
            url: "message.php",
            data: {
                message: prompt,
                context:$("#keep").prop("checked")?JSON.stringify(contextarray):'[]',
            },
            dataType: "json",
            success: function (results) {
                layer.close(loading);
                $("#kw-target").val("");
                layer.msg("Success!");
                contextarray.push([prompt, results.raw_message]);
                articlewrapper("You： "+prompt,randomString(16),"AI: "+results.raw_message);
            }
        });
    }

    function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
});
