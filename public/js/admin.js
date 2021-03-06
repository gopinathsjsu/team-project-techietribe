$(document).ready(function () {
    getInfo();
});

function getInfo() {
    $.ajaxSetup({
        headers:{
            "access-token": window.localStorage.getItem("access-token")
        }
     });     

    $.post("/getInfo/")
    .done(function (data) {
        console.log(data)
        if (data["isAdmin"]) {
            $("#userFullName").text("Admin");
            localStorage.setItem('first_name', 'Admin');
        }
        else {
            window.location.href = '/';
        }
    })
    .fail(function (data) {
        console.log("unknown server error!")
        console.log(data);
        window.location.href = '/';
    });
  }

  