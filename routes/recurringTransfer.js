var express = require("express");
var router = express.Router();
var mySQL = require("mysql");
const AWS = require("aws-sdk");
const cron = require("node-cron");
const { text } = require("express");
function recurringTransferHelper(mySQLObj, req, res, next) {
	var pool = mySQLObj.createPool({
		connectionLimit: 1000,
		host: "cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com",
		user: "admin",
		password: "Techietribe",
		multipleStatements: true,
	});
	var source_id = req.body.account_id_1;
	var dest_id = req.body.destination_id;
	var destination_id = req.body.destination_id;
	var amount = req.body.amount;
	var description = req.body.description;
	var recur_after = req.body.recur_after;
	var next_transfer_date = req.body.next_transfer_date;

	console.log("++++++++++++++++++++++++++++++++++++++");
	// var description = req.body.description;
	// var payee_name = req.body.payee_name;
	// var RoutingNo = req.body.RoutingNo;
	//"next_transfer_date,"+
	transactionId = Math.floor(100000000 + Math.random() * 900000000);
	routingNo = "BSPM123";
	RoutingNo = "BSPM123";
	routingNo_internal = "BSPM123";
	let datetime = new Date();
	var today = datetime.toISOString().split("T")[0];
	console.log("datetime:", today);
	console.log("today:" + today);
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

	var sql4 =
		" UPDATE `Bank`.Recurring SET next_transfer_date = ? where recur_after = ? and next_transfer_date = ? and dest_id = ?;";
	var sql5 =
		"select id,balance FROM `Bank`.Account where id=?;select balance from `Bank`.Account where id=?";
	var sql6 = 
	"INSERT into `Bank`.Transaction(id,source_account_id,description,amount,date,destination_account_id,RoutingNo) values (?,?,?,?,?,?,?);UPDATE `Bank`.Account SET balance =? where id =?;UPDATE `Bank`.Account SET balance =? where id =?";

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
							new Date().getTime() + parseInt(next) * 24 * 60 * 60 * 1000
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
										datetime,
										receiver,
										RoutingNo,									
										difference,
										source_id,
										addition,
										receiver,				
									],
									function (err6, result6) {
										if (err6) {
											console.log("Internal transfer sucessfull");
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
