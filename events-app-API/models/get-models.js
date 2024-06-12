const db = require("../db/connection.js");

exports.fetchUserById = (user_id) => {
	return db
		.query(
			`SELECT * FROM users
			WHERE user_id = $1;`,
			[user_id]
		)
		.then((res) => {
			const user = res.rows[0];
			if (!user) {
				return Promise.reject({
					status: 404,
					msg: "No user by this ID",
				});
			}
			return user;
		});
};

exports.fetchAllUsers = () => {
	return db.query(`SELECT * FROM users;`).then((res) => {
		const allUsers = res.rows;

		return allUsers;
	});
};

exports.fetchAllEvents = () => {
	return db
		.query(
			`SELECT event_id, title, organiser, description, datetime AT TIME ZONE 'UTC' AS datetime, location, created_at AT TIME ZONE 'UTC' AS created_at FROM events;`
		)
		.then((res) => {
			const allEvents = res.rows;

			return allEvents;
		});
};

exports.fetchFutureEvents = () => {
	return db
		.query(
			`
	SELECT event_id, title, organiser, description, datetime AT TIME ZONE 'UTC' AS datetime, location, created_at AT TIME ZONE 'UTC' AS created_at FROM events
	WHERE datetime > NOW()
	ORDER BY datetime;`
		)
		.then((res) => {
			const futureEvents = res.rows;
			return futureEvents;
		});
};

exports.fetchEventById = (event_id) => {
	return db
		.query(
			`
	SELECT event_id, title, organiser, description, datetime AT TIME ZONE 'UTC' AS datetime, location, created_at AT TIME ZONE 'UTC' AS created_at FROM events
	WHERE event_id = $1;`,
			[event_id]
		)
		.then((res) => {
			const event = res.rows[0];

			if (!event) {
				return Promise.reject({
					status: 404,
					msg: "No event by this ID",
				});
			}

			return event;
		});
};

exports.fetchAttendeeNames = (event_id) => {
	return db
		.query(
			`SELECT u.name FROM users u
			LEFT JOIN attendance a
			ON u.user_id = a.user_id
			WHERE a.event_id = $1;`,
			[event_id]
		)
		.then((res) => {
			if (res.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "This event has no attendees or does not exist",
				});
			}

			const attendees = res.rows;
			return attendees;
		});
};

exports.fetchAttendance = (event_id) => {
	return db
		.query(
			`SELECT COUNT(*)::INT AS attendance FROM attendance
			WHERE event_id = $1;`,
			[event_id]
		)
		.then((res) => {
			const attendance = res.rows[0];
			return attendance;
		});
};

exports.fetchAttending = (user_id) => {
	return db
		.query(
			`SELECT e.event_id, e.title, e.organiser, e.description, e.datetime AT TIME ZONE 'UTC' AS datetime, e.location, e.created_at AT TIME ZONE 'UTC' AS created_at FROM events e
			INNER JOIN attendance a
			ON a.event_id = e.event_id
			WHERE a.user_id = $1;`,
			[user_id]
		)
		.then((res) => {
			const attending = res.rows;
			return attending;
		});
};
