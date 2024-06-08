const db = require("../db/connection.js");

exports.fetchAllUsers = () => {
	console.log("entering model");

	return db.query(`SELECT * FROM users;`).then((res) => {
		const allUsers = res.rows;
		console.log(allUsers[0]);

		return allUsers;
	});
};
