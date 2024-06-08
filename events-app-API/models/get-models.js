const db = require("../db/connection.js");

exports.fetchAllUsers = () => {
	return db.query(`SELECT * FROM users;`).then((res) => {
		const allUsers = res.rows;

		return allUsers;
	});
};
