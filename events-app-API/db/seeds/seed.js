const db = require("../connection");
const format = require("pg-format");

const seed = ({ userData }) => {
	return db
		.query(`DROP TABLE IF EXISTS attendance;`)
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS events;`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS users;`);
		})
		.then(() => {
			return db.query(
				`CREATE TABLE users (
                user_id VARCHAR PRIMARY KEY,
                name VARCHAR,
				staff BOOL NOT NULL DEFAULT false,
				created_at TIMESTAMP DEFAULT NOW()
            );`
			);
		})
		.then(() => {
			return db.query(
				`CREATE TABLE events (
                event_id SERIAL PRIMARY KEY,
                title VARCHAR,
                organiser VARCHAR REFERENCES users(user_id) NOT NULL,
				description VARCHAR(1000),
				date DATE NOT NULL,
				time TIME NOT NULL,
				created_at TIMESTAMP DEFAULT NOW()
            );`
			);
		})
		.then(() => {
			return db.query(
				`CREATE TABLE attendance (
                user_id VARCHAR REFERENCES users(user_id) NOT NULL,
				event_id INT REFERENCES events(event_id) NOT NULL
            );`
			);
		})
		.then(() => {
			const insertUsersQueryStr = format(
				"INSERT INTO users ( user_id, name, staff, created_at ) VALUES %L;",
				userData.map(({ user_id, name, staff, created_at }) => [
					user_id,
					name,
					staff,
					created_at,
				])
			);
			return db.query(insertUsersQueryStr);
		});
};

module.exports = seed;
