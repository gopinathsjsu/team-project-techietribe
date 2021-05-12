$(document).ready(function () {
    $("#userFullName").text("Admin");
  });
  
  
  function viewTransactions() {
    clearFields();
  
    var accIdSelected = $("#accId").val();
    var startDate = $("#Start").val();
    var endDate = $("#End").val();
    console.log("View transactions. Start date: " + startDate + " End date: " + endDate + " Account id: " + accIdSelected);

    $.get("/viewTransactions/", {
      account_id: accIdSelected,
      startdate: startDate,
      enddate: endDate,
    })
      .done(function (data) {
        console.log("retreived transactions");
        console.log(data);
  
        $("#accNum").text("Account Number: " + accIdSelected);
  
        if (data.length == 0) {
          $("#viewTransactionsErrMsg").text("No records found!");
          $("#viewTransactionsErrMsg").show();
          return;
        }
  
        // populate div dynamically
        var tableContent = "";
        for (var i = 0; i < data.length; i++) {
          console.log("entered transaction for loop");
          console.log(data[i]);
          tableContent += "<tr>";
          // sample date is 2021-01-01T08:00:00.000Z
          tableContent += "<td>" + data[i].date.split("T")[0] + "</td>";
          tableContent += "<td>" + data[i].id + "</td>";
          // transaction details
          if (data[i].source_account_id == accIdSelected) {
            tableContent +=
              "<td>" + "TO: " + data[i].destination_account_id + "</td>";
            tableContent += "<td>" + data[i].description + "</td>";
            tableContent += "<td>" + "-" + data[i].amount + "</td>";
          } else if (data[i].destination_account_id == accIdSelected) {
            tableContent +=
              "<td>" + "FROM: " + data[i].source_account_id + "</td>";
            tableContent += "<td>" + data[i].description + "</td>";
            tableContent += "<td>" + "+" + data[i].amount + "</td>";
          }
        }
  
        console.log(tableContent);
        console.log($("#transactionsList table tbody").html());
        $("#transactionsList tbody").html(tableContent);
        //   $("#userList").trigger("update");
      })
      .fail(function (data) {
        console.log("failed to retrieve transactions");
        $("#viewTransactionsErrMsg").text("Failed to retrieve transactions!");
        $("#viewTransactionsErrMsg").show();
      });
  }
  
  function searchTransactions() {
    clearFields();
  
    var keyword = $("#search").val();
    var accIdSelected = $("#accId").val();
  
    console.log("Search transactions. Keyword: " + keyword + " Account id: " + accIdSelected);
    $.get("/searchTransactions/", { keyword: keyword, account_id: accIdSelected })
      .done(function (data) {
        console.log("retreive search results");
        console.log(data);
        if (data.length == 0) {
          $("#searchTransactionsErrMsg").text("No records found!");
          $("#searchTransactionsErrMsg").show();
          return;
        }
  
        // populate div dynamically
        var tableContent = "";
        for (var i = 0; i < data.length; i++) {
          tableContent += "<tr>";
          // sample date is 2021-01-01T08:00:00.000Z
          tableContent += "<td>" + data[i].date.split("T")[0] + "</td>";
          tableContent += "<td>" + data[i].id + "</td>";
          // transaction details
          if (data[i].source_account_id == accIdSelected) {
            tableContent +=
              "<td>" + "TO: " + data[i].destination_account_id + "</td>";
            tableContent += "<td>" + data[i].description + "</td>";
            tableContent += "<td>" + "-" + data[i].amount + "</td>";
          } else if (data[i].destination_account_id == accIdSelected) {
            tableContent +=
              "<td>" + "FROM: " + data[i].source_account_id + "</td>";
            tableContent += "<td>" + data[i].description + "</td>";
            tableContent += "<td>" + "+" + data[i].amount + "</td>";
          }
        }
  
        console.log(tableContent);
        console.log($("#transactionsList table tbody").html());
        $("#transactionsList tbody").html(tableContent);
        //   $("#userList").trigger("update");
      })
      .fail(function (data) {
        console.log("Failed to search transactions");
        $("#searchTransactionsErrMsg").text(
          "Failed to search! Please try again!"
        );
        $("#searchTransactionsErrMsg").show();
      });
  }
  
  function clearFields() {
    $("#searchTransactionsErrMsg").text("");
    $("#viewTransactionsErrMsg").text("");
    $("#transactionsList tbody").html("");
  }
  