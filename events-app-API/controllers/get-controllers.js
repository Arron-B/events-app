const {
	fetchAllUsers,
	fetchUserById,
	fetchAllEvents,
	fetchFutureEvents,
	fetchEventById,
	fetchAttendeeNames,
	fetchAttendance,
	fetchAttending,
} = require("../models/index.js");

exports.getEndPoints = (req, res, next) => {
	const endPoints = require("../endpoints.json");

	return res
		.status(200)
		.send({ endPoints })
		.catch((err) => {
			next(err);
		});
};

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

exports.getEventById = (req, res, next) => {
	const { event_id } = req.params;
	fetchEventById(event_id)
		.then((event) => {
			res.status(200).send({ event });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAttendeeNames = (req, res, next) => {
	const { event_id } = req.params;
	fetchAttendeeNames(event_id)
		.then((attendees) => {
			res.status(200).send({ attendees });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAttendance = (req, res, next) => {
	const { event_id } = req.params;
	fetchAttendance(event_id)
		.then((attendance) => {
			res.status(200).send({ attendance });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAttending = (req, res, next) => {
	const { user_id } = req.params;
	fetchAttending(user_id)
		.then((attending) => {
			res.status(200).send({ attending });
		})
		.catch((err) => {
			next(err);
		});
};
