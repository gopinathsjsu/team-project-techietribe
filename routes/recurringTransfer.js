var express = require("express");
var router = express.Router();
var mySQL = require("mysql");
const AWS = require("aws-sdk");
const cron = require("node-cron");
const { text } = require("express");
// Using node - cron for scheduling the payment
var counter = 0;
var sql2 = "select *  FROM `Bank`.Recurring where next_transfer_date =?;";
	
var sql1 =
		"INSERT into `Bank`.Recurring  (" +
		"sender_id," +
		"dest_id," +
		"routingNo," +
		"description," +
		"next_transfer_date," +
		"recur_after," +
		"amount" +
		") values (?,?,?,?,?,?,?);";

var sql4 ="UPDATE `Bank`.Recurring SET next_transfer_date = ? where recur_after = ? and next_transfer_date = ? and dest_id = ?;";
var sql5 ="Select id,balance FROM `Bank`.Account where id=?;select balance from `Bank`.Account where id=?";
var sql6 = "INSERT into `Bank`.Transaction(id,source_account_id,description,amount,date,destination_account_id,RoutingNo) values (?,?,?,?,?,?,?);UPDATE `Bank`.Account SET balance =? where id =?;UPDATE `Bank`.Account SET balance =? where id =?";
		
var RoutingNo = "BSPM123";
function recurringTransferHelper(mySQLObj, req, res, next) {
	var pool = mySQLObj.createPool({
		connectionLimit: 1000,
		host: process.env["RDS_HOST"],
		user: process.env["RDS_USER"],
		password: process.env["RDS_PASSWORD"],
		multipleStatements: true
	});
	var source_id = req.body.account_id_1;
	var dest_id = req.body.destination_id;
	var destination_id = req.body.destination_id;
	var amount = req.body.amount;
	var description = req.body.description;
	var recur_after = req.body.recur_after;
	var next_transfer_date = req.body.next_transfer_date;

	console.log("++++++++++++++++++++++++++++++++++++++");

	transactionId = Math.floor(100000000 + Math.random() * 900000000);
	routingNo = "BSPM123";
	RoutingNo = "BSPM123";
	routingNo_internal = "BSPM123";
	let datetime = new Date();

	var today = datetime.getFullYear() + "-"
	+ ((datetime.getMonth()+1) < 10 ? ("0" + parseInt(datetime.getMonth()+1)):parseInt(datetime.getMonth()+1)) + "-" 
	+ ((datetime.getDate() < 10) ? ("0" + datetime.getDate()): datetime.getDate())
	//var today = datetime.toISOString().split("T")[0];
	console.log("datetime:", datetime);
	console.log("today:" + today);
	
	cron.schedule('* * * * *', () => {
		
		counter += 1;
		var transID = transactionId + counter
		console.log(today)
		console.log(transID)
		//inc_date = today
		var inc_day = new Date(new Date().getTime() + ((counter) * 24 * 60 * 60 * 1000))
		var stringDate = inc_day.getFullYear() + "-"
						+ ((inc_day.getMonth()+1) < 10 ? ("0" + parseInt(inc_day.getMonth()+1)):parseInt(inc_day.getMonth()+1)) + "-" 
						+ ((inc_day.getDate() < 10) ? ("0" + inc_day.getDate()): inc_day.getDate());
		console.log('running a task every minute. Counter: ' + counter);
		console.log("incremented day :" + stringDate)

		pool.getConnection(function(err, connection) {
			if(err) throw err;
			connection.query(
				// Get the details of customers whose recurring transaction date is today (stringDate)
				sql2,
				[stringDate],
				function(err, result){
					if(err) {
						console.log("Failure");
						throw err;
					}else{
						var resultSet = JSON.parse(JSON.stringify(result));
						
						// For every person, perform transaction and update next_recurring date
						for(var i = 0; i < resultSet.length; i++){
							console.log("Info of Customer no: " + i + "\n" + JSON.stringify(resultSet[i]));
							//console.log(result[i].recur_after);
							var next = resultSet[i].recur_after;
							var receiver = resultSet[i].dest_id;
							var desc = resultSet[i].description;
							var sender = resultSet[i].sender_id;
							var nextdate = new Date(
								new Date().getTime() + (parseInt(next) * 24 * 60 * 60 * 1000)
							)
							console.log("sender:::"+sender)
							console.log("reciever :::"+receiver)
							var nextStringDate = nextdate.getFullYear() + "-"
								+ ((nextdate.getMonth()+1) < 10 ? ("0" + parseInt(nextdate.getMonth()+1)):parseInt(nextdate.getMonth()+1)) + "-" 
								+ ((nextdate.getDate() < 10) ? ("0" + nextdate.getDate()): nextdate.getDate());
							console.log(" nextStringDate:::"+nextStringDate+ " nextdate:::"+nextdate)
							// Update the balance
							connection.query(
								sql5,
								[receiver, sender],
								function (err5, result5) {
									if (err5) {
										console.log("failed to get the user info acc id and dest id");
									}else {
										var result5 = JSON.parse(JSON.stringify(result5));
										console.log("result 5 :::"+JSON.stringify(result5));
										var check_dest_id = result5[0][0].id;
										var check_dest_balance = result5[0][0].balance;
										var check_source_balance = result5[1][0].balance;							
										var difference = parseInt(check_source_balance) - parseInt(amount);
										var addition = check_dest_balance + parseInt(amount);
										console.log("check_dest_balance:", check_dest_balance+"check_source_balance:"+check_source_balance)
										console.log("difference:"+ difference +"   "+" addition :"+ addition+"check destination id"+check_dest_id+"amount:"+amount)
										
										connection.query(sql6,[
											transID,
											sender,
											desc,
											amount,
											stringDate,
											receiver,
											RoutingNo,									
											difference,
											sender,
											addition,
											receiver,				
										],
										function (err6, result6) {
											if (err6) {
												console.log("Internal transfer sucessfull - (recurring)");
											}else {
												var result6 = JSON.parse(JSON.stringify(result6));				
												console.log(result6);
											}
										});		
									}
								}
							);
							// Update the recurring transaction table
							connection.query(
								sql4,
								[nextStringDate, next, stringDate, receiver],
								function (err3, result2) {
									if (err3) {
										console.log("failed to update the recurring table to next recurring date");
									} else {
										var result2 = JSON.parse(JSON.stringify(result2));
										console.log(result2);
									}
								}
							);	
						}
					}
				}
			)
		});
		
	});

	pool.getConnection(function (err, connection) {
		if (err) throw err;
		connection.query(
		sql1,
		[
			source_id,
			dest_id,
			routingNo,
			description,
			next_transfer_date,
			recur_after,
			amount,
		],
		function (err3, result) {
			if (err3) {
			console.log(err3);
			} else {
			console.log("Recurring payment set Successfully");
			}
		}
		);
		connection.query(sql2,
			[today],
			function (err2, result) {
				if (err2) {
					console.log("failed to get the recurring table");
				} else {
					var result = JSON.parse(JSON.stringify(result));
					console.log(result);
					for (var i = 0; i < result.length; i++) {
						console.log(result[i].recur_after);
						var next = result[i].recur_after;
						var receiver = result[i].dest_id;
						var desc = result[i].description
						var nextdate = new Date(
							new Date().getTime() + (parseInt(next) * 24 * 60 * 60 * 1000)
						)
						.toISOString()
						.split("T")[0];
						console.log("next:" + next, "nextdate:" + nextdate);
						connection.query(sql5,[
								receiver, 
								source_id		
							],
							function (err5, result5) {
								if (err5) {
									console.log("failed to get the user info acc id and dest id");
								}else {
									var result5 = JSON.parse(JSON.stringify(result5));
									console.log(result5);
									var check_dest_id = result5[0][0].id;
									var check_dest_balance = result5[0][0].balance;
									var check_source_balance = result5[1][0].balance;							
									var difference = parseInt(check_source_balance) - parseInt(amount);
									var addition = check_dest_balance + parseInt(amount);
									console.log("check_dest_balance:", check_dest_balance+"check_source_balance:"+check_source_balance)
									console.log("difference:"+ difference +"   "+" addition :"+ addition+"check destination id"+check_dest_id+"amount:"+amount)
									
									connection.query(sql6,[
										transactionId,
										source_id,
										desc,
										amount,
										today,
										destination_id,
										RoutingNo,									
										difference,
										source_id,
										addition,
										destination_id,				
									],
									function (err6, result6) {
										if (err6) {
											console.log("Internal transfer sucessfull - for recurring");
										}else {
											var result6 = JSON.parse(JSON.stringify(result6));				
											console.log(result6);
										}
									});		
								}
							});
						connection.query(
							sql4,
							[nextdate, next, today, receiver],
							function (err3, result2) {
								if (err3) {
									console.log("failed to update the recurring table to next recurring date");
								} else {
									var result2 = JSON.parse(JSON.stringify(result2));
									console.log(result2);
								}
							}
						);						
					}
				}	
			});
			res
				.status(200)
				.send(
				JSON.stringify(
					{ message: "Recurring payment set Successfully" },
					null,
					"\t"
				)
				);
				
			next();
	});
}
function recurringTransfer(req, res, next) {
  recurringTransferHelper(mySQL, req, res, next);
}
router.post("/", recurringTransfer);

module.exports = router;
module.exports.recurringTransferHelper = recurringTransferHelper;
