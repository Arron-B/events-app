const db = require("../connection");
const format = require("pg-format");

const seed = ({ userData, eventData, attendanceData }) => {
	return db
		.query(`SET TIME ZONE 'UTC';`)
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS attendance;`);
		})

		.then(() => {
			return db.query(`DROP TABLE IF EXISTS events;`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS users;`);
		})
		.then(() => {
			return db.query(
				`CREATE TABLE users (
                user_id VARCHAR PRIMARY KEY UNIQUE,
                name VARCHAR,
				staff BOOL NOT NULL DEFAULT false,
				 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
				datetime TIMESTAMP NOT NULL,
				location VARCHAR NOT NULL,
				created_at TIMESTAMP DEFAULT NOW()
            );`
			);
		})
		.then(() => {
			return db.query(
				`CREATE TABLE attendance (
                user_id VARCHAR REFERENCES users(user_id) NOT NULL,
				event_id INT REFERENCES events(event_id) NOT NULL,
				UNIQUE (user_id, event_id)
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
		})
		.then(() => {
			const insertEventQueryStr = format(
				"INSERT INTO events ( title, organiser, description, datetime, location, created_at ) VALUES %L;",
				eventData.map(
					({
						title,
						organiser,
						description,
						datetime,
						location,
						created_at,
					}) => [title, organiser, description, datetime, location, created_at]
				)
			);
			return db.query(insertEventQueryStr);
		})
		.then(() => {
			const insertAttendanceQueryStr = format(
				"INSERT INTO attendance ( user_id, event_id ) VALUES %L;",
				attendanceData.map(({ user_id, event_id }) => [user_id, event_id])
			);
			return db.query(insertAttendanceQueryStr);
		});
};

module.exports = seed;
