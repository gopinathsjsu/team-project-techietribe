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

function billPaymentRecurring() {
    clearFields();

    var accIdSelected = $("#accIds").val();
    var dest_id = $("#DestinationID").val();
    var amount = $("#Amount").val();
    var description = $("#description").val();
    var payee_name = $("#payee_name").val();
    var RoutingNo = $("#RoutingNo").val();
    console.log("account selected is " + accIdSelected + "destination_id is " + dest_id);
    console.log("amount is " + amount + "description is " + description);
    console.log("payee name is " + payee_name);
    console.log("RoutingNo" + RoutingNo)

    console.log("********************* Bill payment rrcurring set up********************");
    console.log(accIdSelected);
    $.post("/billPaymentRecurring/", {
        account_id_1: accIdSelected,
        destination_id:dest_id,
        amount:amount,
        description:description,
        payee_name:payee_name,
        RoutingNo:RoutingNo
    })
        .done(function (data) {
            console.log(data);

            $("#accNum").text("Account Number: " + accIdSelected);
            console.log("Transferred Money");
            $("#billPaymentRecurringSuccessMsg").text("Recurring Bill Payment Set up done successfully!!");
            $("#billPaymentRecurringSuccessMsg").show();

        })
        .fail(function (data) {
            console.log("Money Transfer Failed");
            $("#billPaymentRecurringFailMsg").text("Recurring Bill Payment set-up  Failed");
            $("#billPaymentRecurringFailMsg").show();
        });
}
function clearFields() {
    $("#billPaymentRecurringSuccessMsg").text("");
    $("#billPaymentRecurringFailMsg").text("");
}
