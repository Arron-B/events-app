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
	return db.query(`SELECT * FROM events;`).then((res) => {
		const allEvents = res.rows;

		return allEvents;
	});
};

exports.fetchFutureEvents = () => {
	return db
		.query(
			`
	SELECT * FROM events
	WHERE date + time > NOW()
	ORDER BY date + time;`
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
	SELECT * FROM events
	WHERE event_id = $1;`,
			[event_id]
		)
		.then((res) => {
			const event = res.rows[0];
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
