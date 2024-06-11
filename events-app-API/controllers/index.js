const {
	getAllUsers,
	getUserById,
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

const deleteAttendance = (req, res, next) => {};

const deleteEvent = (req, res, next) => {};

module.exports = {
	getAllUsers,
	getUserById,
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
