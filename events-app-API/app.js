const express = require("express");
const {
	getAllUsers,
	getUserById,
	getAllEvents,
	getFutureEvents,
	getEventById,
	getAttendeeNames,
	getAttendance,
	getAttending,
	addNewUser,
	addNewEvent,
	addAttendee,
	patchUser,
	patchEvent,
	deleteAttendance,
	deleteEvent,
} = require("./controllers/index.js");

const {
	handleCustomErrors,
	handlePsqlErrors,
	handle500Errors,
} = require("./error-handlers/errors.index.js");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

//////////// Read Endpoints //////////////

app.get("/api/users/:user_id", getUserById);

app.get("/api/users", getAllUsers);

app.get("/api/users/:user_id/attending", getAttending);

app.get("/api/events", getAllEvents);

app.get("/api/events/upcoming", getFutureEvents);

app.get("/api/events/:event_id", getEventById);

app.get("/api/events/:event_id/attendees", getAttendeeNames);

app.get("/api/events/:event_id/attendance", getAttendance);

//////////// Create Endpoints //////////////

app.post("/api/users", addNewUser);

app.post("/api/events", addNewEvent);

app.post("/api/events/:event_id", addAttendee);

//////////// Update Endpoints //////////////

app.patch("/api/users/:user_id", patchUser);

app.patch("/api/events/:event_id", patchEvent);

//////////// Delete Endpoints //////////////

app.delete("/api/events/:event_id/attendee", deleteAttendance);

app.delete("/api/events/:event_id", deleteEvent);

//////////// Error Handlers //////////////

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
