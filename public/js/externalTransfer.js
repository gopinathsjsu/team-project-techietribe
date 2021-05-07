$(document).ready(function () {
    getAccountsInfo();
});
function getAccountsInfo() {
    $.ajaxSetup({
        headers:{
            "access-token": window.localStorage.getItem("access-token")
        }
     });     
    $.post("/viewAccount/")
    .done(function (data) {
        console.log(data)
        
    })
    .fail(function (data) {
        console.log("unknown server error!")
        console.log(data);
        window.location.href = '/';
    });
  }

  function externalTransfer(){
    $.ajaxSetup({
        headers:{
            "access-token": window.localStorage.getItem("access-token")
        }
     });     
    $.post("/externalTransfer/")
    .done(function (data) {
        console.log(data)
    })
    .fail(function (data) {
        console.log("unknown server error!")
        console.log(data);
        window.location.href = '/';
    });
  }