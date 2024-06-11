const {
	fetchAllUsers,
	fetchUserById,
	fetchAllEvents,
	fetchFutureEvents,
	fetchEventById,
	fetchAttendeeNames,
	fetchAttendance,
	fetchAttending,
} = require("./get-models.js");

const {
	insertNewUser,
	insertNewEvent,
	insertAttendee,
	updateUserStaff,
	updateUserName,
	updateEvent,
} = require("./add-models.js");

const removeAttendanceFromDb = () => {};
const removeEventFromDb = () => {};

module.exports = {
	fetchAllUsers,
	fetchUserById,
	fetchAllEvents,
	fetchFutureEvents,
	fetchEventById,
	fetchAttendeeNames,
	fetchAttendance,
	fetchAttending,
	insertNewUser,
	insertNewEvent,
	insertAttendee,
	updateUserStaff,
	updateUserName,
	updateEvent,
	removeAttendanceFromDb,
	removeEventFromDb,
};
