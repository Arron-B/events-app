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
