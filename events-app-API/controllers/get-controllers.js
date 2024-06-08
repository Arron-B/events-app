const { fetchAllUsers } = require("../models/get-models");

exports.getAllUsers = (req, res, next) => {
	console.log("entering controller");
	fetchAllUsers()
		.then((users) => {
			console.log("back to controller");
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};
