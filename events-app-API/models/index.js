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
	if (!user_id) {
		return Promise.reject({
			status: 400,
			msg: "No user_id provided",
		});
	}

	return db
		.query(
			`
		DELETE FROM attendance
		WHERE event_id = $1 AND user_id = $2;
        `,
			[event_id, user_id]
		)
		.then((res) => {
			if (res.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "Not Found",
				});
			}
		});
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
		})
		.then((res) => {
			if (res.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "Not Found",
				});
			}
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
