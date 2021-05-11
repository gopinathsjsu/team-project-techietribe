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

function recurringTransfer() {
    clearFields();

    var accIdSelected = $("#accIds").val();
    var destination_id = $("#DestinationID").val();
    var amount = $("#Amount").val();
    var description = $("#description").val();
    var payee_name = $("#payee_name").val();
    var recur_after = $("#recur_after").val();
    var next_transfer_date = $("#next_transfer_date").val();
    console.log("account selected is " + accIdSelected + "destination_id is " + destination_id);
    console.log("amount is " + amount + "frequency " + recur_after);
    console.log(""+"description"+description)

    console.log("********************* In recurring Transfer ********************");
   // console.log(accIdSelected);
    $.post("/recurringTransfer/", {
        account_id_1: accIdSelected,
        destination_id:destination_id,
        amount:amount,
        recur_after:recur_after,
        description:description
        //next_transfer_date:next_transfer_date
        // description:description,
        // payee_name:payee_name
    })
        .done(function (data) {
            console.log(data);

            $("#accNum").text("Account Number: " + accIdSelected);
            console.log("Recurring payment set successfully");
            $("#recurringTransferSuccessMsg").text("Recurring payment set successfully!!!");
            $("#recurringTransferSuccessMsg").show();

        })
        .fail(function (data) {
            console.log("Cannot set the recurring transfer");
            $("#recurringTransferFailMsg").text("Cannot set the recurring transfer");
            $("#recurringTransferFailMsg").show();
        });
}
function clearFields() {
    $("#recurringTransferSuccessMsg").text("");
    $("#recurringTransferFailMsg").text("");
}
