const db = require("../connection");
const format = require("pg-format");

const seed = ({ userData }) => {
	return db
		.query(`DROP TABLE IF EXISTS events;`)
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS users;`);
		})
		.then(() => {
			const usersTablePromise = db.query(
				`CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR
            );`
			);

			const eventsTablePromise = db.query(
				`CREATE TABLE events (
                event_id SERIAL PRIMARY KEY,
                event_name VARCHAR,
                event_creator INT REFERENCES users(user_id) NOT NULL
            );`
			);

			return Promise.all([usersTablePromise, eventsTablePromise]);
		})
		.then(() => {
			const insertUsersQueryStr = format(
				"INSERT INTO users ( username ) VALUES %L;",
				userData.map(({ username }) => [username])
			);
			return db.query(insertUsersQueryStr);
		});
};

module.exports = seed;
