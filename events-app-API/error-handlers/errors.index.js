const express = require("express");

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "23502") {
		res.status(400).send({ msg: "Bad request" });
	}
	if (err.code === "23503") {
		res.status(404).send({ msg: "A referenced value was not found" });
	}
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad request" });
	}
	if (err.code === "42701") {
		res.status(302).send({ msg: "Found" });
	}
	if (err.code === "23505") {
		res.status(409).send({ msg: "Conflict: Duplicate Entry" });
	} else next(err);
};
