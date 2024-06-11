const db = require("../db/connection.js");

exports.insertNewUser = (user_id, name, staff) => {
	return db
		.query(
			`INSERT INTO users (user_id, name, staff)
            VALUES ($1, $2, $3)
            RETURNING *;`,
			[user_id, name, staff]
		)
		.then((res) => {
			const user = res.rows[0];
			return user;
		});
};

exports.insertNewEvent = (
	title,
	organiser,
	description,
	datetime,
	location
) => {
	return db
		.query(
			`INSERT INTO events (title,
	            organiser,
                description,
                datetime,
                location)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING event_id, title, organiser, description, datetime AT TIME ZONE 'UTC' AS datetime, location, created_at AT TIME ZONE 'UTC' AS created_at;`,
			[title, organiser, description, datetime, location]
		)
		.then((res) => {
			const event = res.rows[0];
			return event;
		});
};

exports.insertAttendee = () => {};

exports.updateUserStaff = () => {};

exports.updateUserName = () => {};

exports.updateEvent = () => {};
