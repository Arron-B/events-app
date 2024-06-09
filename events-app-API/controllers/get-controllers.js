const {
	fetchAllUsers,
	fetchUserById,
	fetchAllEvents,
	fetchFutureEvents,
} = require("../models/get-models");

exports.getUserById = (req, res, next) => {
	const { user_id } = req.params;
	fetchUserById(user_id)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAllUsers = (req, res, next) => {
	fetchAllUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAllEvents = (req, res, next) => {
	fetchAllEvents()
		.then((events) => {
			res.status(200).send({ events });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getFutureEvents = (req, res, next) => {
	fetchFutureEvents()
		.then((events) => {
			res.status(200).send({ events });
		})
		.catch((err) => {
			next(err);
		});
};
