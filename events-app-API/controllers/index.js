const {
	getEndPoints,
	getAllUsers,
	getUserById,
	getStaffVerification,
	getAllEvents,
	getFutureEvents,
	getEventById,
	getAttendeeNames,
	getAttendance,
	getAttending,
} = require("./get-controllers.js");

const {
	addNewUser,
	addNewEvent,
	addAttendee,
	patchUser,
	patchEvent,
} = require("./add-controllers.js");

const {
	removeAttendanceFromDb,
	removeEventFromDb,
} = require("../models/index.js");

const deleteAttendance = (req, res, next) => {
	const { event_id } = req.params;
	const { user_id } = req.body;
	removeAttendanceFromDb(event_id, user_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};

const deleteEvent = (req, res, next) => {
	const { event_id } = req.params;
	removeEventFromDb(event_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	getEndPoints,
	getAllUsers,
	getUserById,
	getStaffVerification,
	getAllEvents,
	getFutureEvents,
	getEventById,
	getAttendeeNames,
	getAttendance,
	getAttending,
	addNewUser,
	addNewEvent,
	addAttendee,
	patchUser,
	patchEvent,
	deleteAttendance,
	deleteEvent,
};
