$(document).ready(function () {
    getAccountsInfo();
});

function getAccountsInfo() {
    $.ajaxSetup({
        headers: {
            'access-token': window.localStorage.getItem('access-token'),
        },
    });

    $.get('/viewAccount/')
        .done(function (data) {
            console.log(data);
            if (!data['isAdmin']) {
                $('#userFullName').text(window.localStorage.getItem('first_name'));
                for(var i=0; i < data.length; i++){
                    var option = document.createElement("option");
                    option.text = data[i].id;
                    option.value = data[i].id;
                    document.getElementById("accIds").add(option);
                }

            } else {
                window.location.href = '/';
            }
        })
        .fail(function (data) {
            console.log('cannot retrieve account info!');
            console.log(data);
            window.location.href = '/';
        });
}
  function closeAccount(){
    var accIdSelected = $("#accIds").val();
    console.log("In close Account");
    console.log(accIdSelected);
    $.post("/closeAccount/", {account_id: accIdSelected})
    .done(function (data) {
        console.log("after . post")
        console.log(data)
        $('#accNum').text("Account Number: " + accIdSelected);
        $("#closeAccountSuccessMsg").text("Closed Account!");
        $("#closeAccountSuccessMsg").show();
        // delete successful
    })
    .fail(function (data) {
        console.log("Failed to close account")
        $("#closeAccountErrMsg").text("Failed to close account! Please try again!");
        $("#closeAccountErrMsg").show();
    });
  }