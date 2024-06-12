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
	if (!staff && !name) {
		return Promise.reject({
			status: 400,
			msg: "No valid update provided",
		});
	}

	if (
		(staff && typeof staff !== "boolean") ||
		(name && typeof name !== "string")
	) {
		return Promise.reject({
			status: 400,
			msg: "Invalid data type for field",
		});
	}

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
		if (res.rowCount === 0) {
			return Promise.reject({
				status: 404,
				msg: "No user for given ID",
			});
		}
		const updatedUser = res.rows[0];
		return updatedUser;
	});
};

exports.updateEvent = (event_id, fieldsToUpdate) => {
	/////////// Building query string ///////////////////////

	let query = `
        UPDATE events
        SET `;
	const values = [];
	const fields = [];

	let fieldsAndValuesString = ``;

	fields.push(...Object.keys(fieldsToUpdate));

	fields.forEach((key) => values.push(fieldsToUpdate[key]));

	fields.forEach((field, i) => {
		if (i === 0) {
			fieldsAndValuesString += `${field} = $2`;
		} else {
			fieldsAndValuesString += `, ${field} = $${i + 2}`;
		}
	});

	query += fieldsAndValuesString;

	query += `
         WHERE event_id = $1
        RETURNING event_id, title, organiser, description, datetime AT TIME ZONE 'UTC' AS datetime, location, created_at AT TIME ZONE 'UTC' AS created_at;
    `;

	///////////////////// Checking data validity //////////////////////////

	const validFields = ["title", "description", "datetime", "location"];
	let validFieldCount = 0;
	let validValueTypes = true;

	validFields.forEach((field, i) => {
		if (fields.includes(field)) {
			validFieldCount++;
		}
	});

	values.forEach((value) => {
		if (typeof value !== "string") {
			validValueTypes = false;
		}
	});

	if (validFieldCount === 0) {
		return Promise.reject({
			status: 400,
			msg: "No valid fields provided",
		});
	}

	if (validValueTypes === false || isNaN(event_id)) {
		return Promise.reject({
			status: 400,
			msg: "Invalid data type submitted",
		});
	}

	//////////////////////// Querying Database ///////////////////////////////

	return db
		.query(query, [event_id, ...values])

		.then((res) => {
			if (res.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "No event by given ID",
				});
			}
			const event = res.rows[0];
			return event;
		});
};
