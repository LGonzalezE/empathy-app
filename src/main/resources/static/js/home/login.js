var GLOBALS = {

    data: {
        users: {
            "Arturo": { userID: "21c461b9-f657-45aa-9e43-aee3e73c6656", name: "Arturo", pwd: "Arturo" },
            "Pedro": { userID: "7f3f7595-c442-43c0-8f83-6c714fc72fe3", name: "Pedro", pwd: "Pedro" },
            "Maria": { userID: "9998306c-6bf6-46f4-b4f4-d2bfd1052418", name: "Maria", pwd: "Maria" },
            "Juana": { userID: "9b9f79fc-05cd-4f50-8c46-715fb99dff35", name: "Juana", pwd: "Juana" },

        }
    }
}

$(document).ready(
    function () {


    });

function login() {

    var userName = $("#user-name").val();
    var userPwd = $("user-pwd").val();

    var user = GLOBALS.data.users[userName];

    if (typeof user == 'undefined') {
        $("#login-message").html("Usuario o contraseña no válidos");
        localStorage.setItem("user", null);
    }
    else {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/dashboard";
    }



}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}