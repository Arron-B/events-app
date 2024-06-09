const {
	getAllUsers,
	getUserById,
	getAllEvents,
	getFutureEvents,
	getEventById,
	getAttendeeNames,
	getAttendance,
	getAttending,
} = require("./controllers/index.js");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/users/:user_id", getUserById);

app.get("/api/users", getAllUsers);

app.get("/api/users/:user_id/attending", getAttending);

app.get("/api/events", getAllEvents);

app.get("/api/events/upcoming", getFutureEvents);

app.get("/api/events/:event_id", getEventById);

app.get("/api/events/:event_id/attendees", getAttendeeNames);

app.get("/api/events/:event_id/attendance", getAttendance);

module.exports = app;
