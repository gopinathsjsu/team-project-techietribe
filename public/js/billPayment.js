$(document).ready(function () {
    getAccounts();
});

function getAccounts() {
    $.ajaxSetup({
        headers: {
            "access-token": window.localStorage.getItem("access-token"),
        },
    });

    $.get("/viewAccount/")
        .done(function (data) {
            console.log(data);
            if (!data["isAdmin"]) {
                $("#userFullName").text(window.localStorage.getItem("first_name"));
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.text = data[i].id;
                    option.value = data[i].id;
                    document.getElementById("accIds").add(option);
                }
            } else {
                window.location.href = "/";
            }
        })
        .fail(function (data) {
            console.log("cannot retrieve account info!");
            console.log(data);
            window.location.href = "/";
        });
}

function billPayment() {
    clearFields();

    var accIdSelected = $("#accIds").val();
    var dest_id = $("#DestinationID").val();
    var amount = $("#Amount").val();
    var payee_name = $("#payee_name").val();

    console.log("account selected is " + accIdSelected + "destination_id is " + dest_id);
    console.log("payee name is " + payee_name);

    console.log("********************* Bill Payment ********************");
    console.log(accIdSelected);
    $.post("/billPayment/", {
        account_id_1: accIdSelected,
        destination_id:dest_id,
        amount:amount,
        payee_name:payee_name
    })
        .done(function (data) {
            console.log(data);

            $("#accNum").text("Account Number: " + accIdSelected);
            console.log("Bill Payment done successfully");
            $("#billPaymentSuccessMsg").text("Transfer Money Success!! Hurray");
            $("#billPaymentSuccessMsg").show();

        })
        .fail(function (data) {
            console.log("Money Transfer Failed");
            $("#billPaymentFailMsg").text("Error in bill payment");
            $("#billPaymentFailMsg").show();
        });
}
function clearFields() {
    $("#billPaymentSuccessMsg").text("");
    $("#billPaymentFailMsg").text("");
}
