$(document).ready(function () {
    getAccountsInfo();
});

// First populate all the accounts in the drop down associated to the customer id,
// as soon as the page loads. So that customer can select the account that he/she want to delete.
function getAccountsInfo() {

    // get access token from browser and send it in the request.
    // Both headers and data are considered as input. 
    $.ajaxSetup({
        headers:{
            "access-token": window.localStorage.getItem("access-token")
        }
     });     
    $.post("/viewAccount/")
    .done(function (data) {
        console.log(data)
        // load accounts in html
        
    })
    .fail(function (data) {
        console.log("unknown server error!")
        console.log(data);
        window.location.href = '/';
    });
  }

  function deleteAccount(){
    $.ajaxSetup({
        headers:{
            "access-token": window.localStorage.getItem("access-token")
        }
     });     
    $.post("/deleteAccount/")
    .done(function (data) {
        console.log(data)
        // delete successful
        
    })
    .fail(function (data) {
        console.log("unknown server error!")
        console.log(data);
        window.location.href = '/';
    });
  }