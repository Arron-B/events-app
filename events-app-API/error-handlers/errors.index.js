const express = require("express");

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		console.log("handling custom error");
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "23502") {
		console.log("handling psql error 23502");
		res.status(400).send({ msg: "Bad request" });
	} else next(err);
	if (err.code === "22P02") {
		console.log("handling psql error 22P02");
		res.status(400).send({ msg: "Bad request" });
	} else next(err);
};

// exports.handle500Errors = (err, req, res, next) => {
// 	console.log("unhandled error");
// 	console.log(err, "ERROR: unhandled error, please fix!");
// 	res.status(500).send({ msg: "Internal server error" });
// };
