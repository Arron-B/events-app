const {
	insertNewUser,
	insertNewEvent,
	insertAttendee,
	updateUser,
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
	const { user_id } = req.body;
	const { event_id } = req.params;

	insertAttendee(user_id, event_id)
		.then((attendance) => {
			res.status(201).send({ attendance });
		})
		.catch((err) => next(err));
};

exports.patchUser = (req, res, next) => {
	const { user_id } = req.params;
	const { staff, name } = req.body;
	updateUser(user_id, staff, name)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => next(err));
};

exports.patchEvent = (req, res, next) => {
	const { event_id } = req.params;
	const updates = req.body;
	updateEvent(event_id, updates)
		.then((event) => {
			res.status(200).send({ event });
		})
		.catch((err) => next(err));
};
