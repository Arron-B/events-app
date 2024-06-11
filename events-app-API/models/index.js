const db = require("../db/connection.js");

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
	updateUser,
	updateEvent,
} = require("./add-models.js");

const removeAttendanceFromDb = (event_id, user_id) => {
	return db.query(
		`
		DELETE FROM attendance
		WHERE event_id = $1 AND user_id = $2;
        `,
		[event_id, user_id]
	);
};
const removeEventFromDb = (event_id) => {
	return db
		.query(
			`
		DELETE FROM attendance
		WHERE event_id = $1;
	`,
			[event_id]
		)
		.then(() => {
			return db.query(
				`
		DELETE FROM events
		WHERE event_id = $1;
        `,
				[event_id]
			);
		});
};

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
	updateUser,
	updateEvent,
	removeAttendanceFromDb,
	removeEventFromDb,
};
