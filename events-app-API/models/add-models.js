const db = require("../db/connection.js");

exports.insertNewUser = (user_id, name, staff) => {
	if (!name) {
		return Promise.reject({
			status: 400,
			msg: "A user cannot be added without a name",
		});
	}

	if (!user_id) {
		return Promise.reject({
			status: 400,
			msg: "A user cannot be added without an ID",
		});
	}

	if (typeof user_id !== "string") {
		return Promise.reject({
			status: 400,
			msg: "User ID must be a string",
		});
	}

	return db
		.query(
			`INSERT INTO users (user_id, name, staff)
            VALUES ($1, $2, $3)
            RETURNING *;`,
			[user_id, name, staff || false]
		)
		.then((res) => {
			user = res.rows[0];
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
	if (!title || !organiser || !description || !datetime || !location) {
		console.log("A field is missing");
		return Promise.reject({
			status: 400,
			msg: "Empty or missing field",
		});
	}

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

exports.insertAttendee = (user_id, event_id) => {
	return db
		.query(
			`INSERT INTO attendance (user_id, event_id)
            VALUES ($1, $2)
            RETURNING *;`,
			[user_id, event_id]
		)
		.then((res) => {
			const attendance = res.rows[0];
			return attendance;
		});
};

exports.updateUser = (user_id, staff, name) => {
	let query = ``;

	if (staff) {
		query = `
        UPDATE users
        SET staff = $1
        WHERE user_id = $2
        RETURNING user_id, name, staff, created_at AT TIME ZONE 'UTC' AS created_at;
        `;
	}

	if (name) {
		query = `
        UPDATE users
        SET name = $1
        WHERE user_id = $2
        RETURNING user_id, name, staff, created_at AT TIME ZONE 'UTC' AS created_at;
        `;
	}

	return db.query(query, [staff || name, user_id]).then((res) => {
		const updatedUser = res.rows[0];
		return updatedUser;
	});
};

exports.updateEvent = (event_id, title, description, datetime, location) => {
	return db
		.query(
			`
    UPDATE events
SET title = $2, description = $3, datetime = $4, location = $5
WHERE event_id = $1
RETURNING event_id, title, organiser, description, datetime AT TIME ZONE 'UTC' AS datetime, location, created_at AT TIME ZONE 'UTC' AS created_at;
    `,
			[event_id, title, description, datetime, location]
		)
		.then((res) => {
			const event = res.rows[0];
			return event;
		});
};
