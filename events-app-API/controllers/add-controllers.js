const {
	insertNewUser,
	insertNewEvent,
	insertAttendee,
	updateUserStaff,
	updateUserName,
	updateEvent,
} = require("../models/index.js");

exports.addNewUser = (req, res, next) => {
	const { user_id, name, staff } = req.body;

	insertNewUser(user_id, name, staff)
		.then((user) => {
			res.status(201).send({ user });
		})
		.catch((err) => next(err));
};

exports.addNewEvent = (req, res, next) => {
	const { title, organiser, description, datetime, location } = req.body;

	insertNewEvent(title, organiser, description, datetime, location)
		.then((event) => {
			res.status(201).send({ event });
		})
		.catch((err) => next(err));
};

exports.addAttendee = (req, res, next) => {
	const { user_id, event_id } = req.body;

	insertAttendee(user_id, event_id)
		.then((attendance) => {
			res.status(201).send({ attendance });
		})
		.catch((err) => next(err));
};

exports.patchUserStaff = (req, res, next) => {};

exports.patchUserName = (req, res, next) => {};

exports.patchEvent = (req, res, next) => {};
