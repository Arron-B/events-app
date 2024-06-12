const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
	test("resolves with status code 200 and returns an accurate JSON object detailing all end points", () => {
		const endPoints = require("../endpoints.json");
		return request(app)
			.get("/api")
			.expect(200)
			.then((res) => {
				const endPointResponse = JSON.parse(res.text);
				expect(endPointResponse.endPoints).toEqual(endPoints);
			});
	});
});

describe("GET /api/users/:user_id", () => {
	test("resolves status 200 and correct data", () => {
		return request(app)
			.get("/api/users/auth0Id1")
			.expect(200)
			.then((res) => {
				const user = res.body.user;
				expect(user).toEqual(
					expect.objectContaining({
						user_id: "auth0Id1",
						name: "Thomas Anderson",
						staff: false,
					})
				);
				expect(typeof user.created_at).toBe("string");
			});
	});

	test("resolves status 200 and correct data for a user with longer ID and a that is a staff member", () => {
		return request(app)
			.get("/api/users/auth0Id22")
			.expect(200)
			.then((res) => {
				const user = res.body.user;
				expect(user).toEqual(
					expect.objectContaining({
						user_id: "auth0Id22",
						name: "Stephen Strange",
						staff: true,
						created_at: expect.any(String),
					})
				);
			});
	});

	test("resolves status 404 and an appropriate message when given a user_id that does not exist in the database", () => {
		return request(app)
			.get(`/api/users/auth0Id60`)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("No user by this ID");
			});
	});
});

describe("GET /api/users", () => {
	test("resolves status 200 and correct amount of users including first and last user", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then((res) => {
				const users = res.body.users;
				expect(typeof users).toBe("object");
				expect(users.length).toBe(25);
				users.forEach((user) => {
					expect(typeof user.user_id).toBe("string");
					expect(typeof user.name).toBe("string");
					expect(typeof user.staff).toBe("boolean");
					expect(typeof user.created_at).toBe("string");

					if (user.user_id === "auth0Id1") {
						expect(user.name).toBe("Thomas Anderson");
						expect(user.staff).toBe(false);
					}

					if (user.user_id === "auth0Id25") {
						expect(user.name).toBe("Nick Fury");
						expect(user.staff).toBe(false);
					}
				});
			});
	});
});

describe("GET /api/events", () => {
	test("resolves status 200 and correct amount of events including first and last event", () => {
		return request(app)
			.get("/api/events")
			.expect(200)
			.then((res) => {
				const events = res.body.events;
				expect(typeof events).toBe("object");
				expect(events.length).toBe(15);
				events.forEach((event) => {
					expect(typeof event.title).toBe("string");
					expect(typeof event.organiser).toBe("string");
					expect(typeof event.description).toBe("string");
					expect(typeof event.datetime).toBe("string");
					expect(typeof event.location).toBe("string");
					expect(typeof event.created_at).toBe("string");

					if (event.event_id === 1) {
						expect(event.title).toBe("badminton tourney");
						expect(event.organiser).toBe("auth0Id3");
						expect(event.description).toBe(
							"Contenders will progress through group stages and the finalists will win a cash prize of £100 for the winner and £50 for the runner up!"
						);
						expect(event.datetime).toBe("2024-06-20T12:00:00.000Z");
						expect(event.location).toBe("404 not found ave, A04 1NF");
						expect(event.created_at).toBe("2024-04-18T14:50:39.217Z");
					}

					if (event.event_id === 25) {
						expect(event.title).toBe("Track and Field Meet");
						expect(event.organiser).toBe("auth0Id5");
						expect(event.description).toBe(
							"Compete in various track and field events."
						);
						expect(event.datetime).toBe("2024-08-18T09:00:00.000Z");
						expect(event.location).toBe("123 Stadium Rd, M78 9AB");
						expect(event.created_at).toBe("2024-06-08T10:55:30.217Z");
					}
				});
			});
	});
});

describe("GET /api/events/upcoming", () => {
	test("Resolves status 200 and does not list every event", () => {
		return request(app)
			.get("/api/events/upcoming")
			.expect(200)
			.then((res) => {
				const events = res.body.events;
				expect(events.length).toBeLessThan(15);
			});
	});

	test("Events are in correct format and all keys are present", () => {
		return request(app)
			.get("/api/events/upcoming")
			.expect(200)
			.then((res) => {
				const events = res.body.events;
				expect(typeof events).toBe("object");
				events.forEach((event) => {
					expect(typeof event.title).toBe("string");
					expect(typeof event.organiser).toBe("string");
					expect(typeof event.description).toBe("string");
					expect(typeof event.datetime).toBe("string");
					expect(typeof event.location).toBe("string");
					expect(typeof event.created_at).toBe("string");

					if (event.event_id === 14) {
						expect(event).toEqual(
							expect.objectContaining({
								event_id: 14,
								title: "Softball Game",
								organiser: "auth0Id8",
								description: "Join us for a friendly game of softball.",
								datetime: "2024-07-20T14:00:00.000Z",
								location: "901 Diamond St, L56 7YZ",
								created_at: "2024-06-15T17:45:55.217Z",
							})
						);
					}
				});
			});
	});

	test("Events are sorted by date and time in ascending order", () => {
		return request(app)
			.get("/api/events/upcoming")
			.expect(200)
			.then((res) => {
				const events = res.body.events;
				expect(events).toBeSortedBy("datetime", { descending: false });
			});
	});
});

describe("GET /api/events/:event_id", () => {
	test("Resolves with status 200 and sends back correct type and format", () => {
		return request(app)
			.get("/api/events/1")
			.expect(200)
			.then((res) => {
				const event = res.body.event;
				expect(typeof event).toBe("object");
				expect(event).toEqual(
					expect.objectContaining({
						title: "badminton tourney",
						organiser: "auth0Id3",
						description:
							"Contenders will progress through group stages and the finalists will win a cash prize of £100 for the winner and £50 for the runner up!",
						datetime: "2024-06-20T12:00:00.000Z",
						location: "404 not found ave, A04 1NF",
						created_at: "2024-04-18T14:50:39.217Z",
					})
				);
			});
	});

	test("Resolves with status 200 and sends back correct type and format when event_id is more than 1 digit", () => {
		return request(app)
			.get("/api/events/11")
			.expect(200)
			.then((res) => {
				const event = res.body.event;
				expect(typeof event).toBe("object");
				expect(event).toEqual(
					expect.objectContaining({
						title: "Cycling Marathon",
						organiser: "auth0Id20",
						description: "Join our cycling marathon through scenic routes.",
						datetime: "2024-06-22T08:00:00.000Z",
						location: "678 Bike Path, I89 0ST",
						created_at: "2024-05-15T14:00:00.217Z",
					})
				);
			});
	});

	test("Responds with status 404 and appropriate message when there is no event by the given ID", () => {
		return request(app)
			.get("/api/events/89")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("No event by this ID");
			});
	});

	test("Responds with status 400 when an invalid type is given for ID", () => {
		return request(app).get("/api/events/one").expect(400);
	});
});

describe("GET /api/events/:event_id/attendees", () => {
	test("resolves status 200 and correct names and amount of names for an events attendees", () => {
		return request(app)
			.get("/api/events/1/attendees")
			.expect(200)
			.then((res) => {
				const attendees = res.body.attendees;
				expect(typeof attendees).toBe("object");
				expect(attendees.length).toBe(3);
				expect(attendees).toEqual(
					expect.arrayContaining([
						{ name: "Thomas Anderson" },
						{ name: "Pietro Maximoff" },
						{ name: "Nick Fury" },
					])
				);
			});
	});

	test("Send corrects attendees for an event with a 2 digit ID", () => {
		return request(app)
			.get("/api/events/10/attendees")
			.expect(200)
			.then((res) => {
				const attendees = res.body.attendees;
				expect(typeof attendees).toBe("object");
				expect(attendees.length).toBe(4);
				expect(attendees).toEqual(
					expect.arrayContaining([
						{ name: "Thomas Anderson" },
						{ name: "Natasha Romanoff" },
						{ name: "Scott Lang" },
						{ name: "Barry Allen" },
					])
				);
			});
	});

	test("Responds with status 404 and appropriate message when there is no event by the given ID", () => {
		return request(app)
			.get("/api/events/89/attendees")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe(
					"This event has no attendees or does not exist"
				);
			});
	});

	test("Responds with status 404 and appropriate message when the event has no attendees", () => {
		return request(app)
			.get("/api/events/11/attendees")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe(
					"This event has no attendees or does not exist"
				);
			});
	});

	test("Responds with status 400 when an invalid type is given for ID", () => {
		return request(app).get("/api/events/one/attendees").expect(400);
	});
});

describe("GET /api/events/:event_id/attendance", () => {
	test("resolves status 200 and correct count of people attending the event", () => {
		return request(app)
			.get("/api/events/1/attendance")
			.expect(200)
			.then((res) => {
				const attendance = res.body.attendance;
				expect(typeof attendance.attendance).toBe("number");
				expect(attendance.attendance).toBe(3);
			});
	});

	test("returns a count of 0 for an event with no attendees", () => {
		return request(app)
			.get("/api/events/11/attendance")
			.expect(200)
			.then((res) => {
				const attendance = res.body.attendance;
				expect(typeof attendance.attendance).toBe("number");
				expect(attendance.attendance).toBe(0);
			});
	});

	test("Responds with status 400 when an invalid type is given for ID", () => {
		return request(app).get("/api/events/one/attendance").expect(400);
	});
});

describe("GET /api/users/:user_id/attending", () => {
	test("returns status 200 with all events in the correct format and each the user is attending", () => {
		return request(app)
			.get("/api/users/auth0Id1/attending")
			.expect(200)
			.then((res) => {
				const attending = res.body.attending;
				expect(typeof attending).toBe("object");
				expect(attending.length).toBe(6);
				expect(attending).toStrictEqual(
					expect.arrayContaining([
						{
							event_id: 1,
							title: "badminton tourney",
							organiser: "auth0Id3",
							description:
								"Contenders will progress through group stages and the finalists will win a cash prize of £100 for the winner and £50 for the runner up!",
							datetime: "2024-06-20T12:00:00.000Z",
							location: "404 not found ave, A04 1NF",
							created_at: "2024-04-18T14:50:39.217Z",
						},
						{
							event_id: 6,
							title: "Tennis Championship",
							organiser: "auth0Id18",
							description:
								"Participate in our tennis championship for a chance to win great prizes.",
							datetime: "2024-06-15T09:00:00.000Z",
							location: "789 Court Dr, D56 7IJ",
							created_at: "2024-04-30T14:55:29.217Z",
						},
						{
							event_id: 7,
							title: "Charity Fun Run",
							organiser: "auth0Id20",
							description:
								"Participate in our charity run to raise funds for a good cause.",
							datetime: "2024-07-22T08:00:00.000Z",
							location: "101 Riverside Dr, E78 9KL",
							created_at: "2024-05-12T08:45:00.217Z",
						},
						{
							event_id: 10,
							title: "Swimming Gala",
							organiser: "auth0Id18",
							description:
								"Compete in our swimming gala with various categories.",
							datetime: "2024-08-25T09:00:00.000Z",
							location: "567 Pool Rd, H67 8QR",
							created_at: "2024-06-05T11:35:45.217Z",
						},
						{
							event_id: 13,
							title: "Archery Competition",
							organiser: "auth0Id12",
							description: "Show off your archery skills in our competition.",
							datetime: "2024-08-05T15:00:00.000Z",
							location: "890 Target Ln, K34 5WX",
							created_at: "2024-05-29T18:30:45.217Z",
						},
						{
							event_id: 15,
							title: "Track and Field Meet",
							organiser: "auth0Id5",
							description: "Compete in various track and field events.",
							datetime: "2024-08-18T09:00:00.000Z",
							location: "123 Stadium Rd, M78 9AB",
							created_at: "2024-06-08T10:55:30.217Z",
						},
					])
				);
			});
	});

	test("responds with an empty array if the user is not attending any events", () => {
		return request(app)
			.get("/api/users/auth0Id11/attending")
			.expect(200)
			.then((res) => {
				const attending = res.body.attending;
				expect(typeof attending).toBe("object");
				expect(attending.length).toBe(0);
				expect(attending).toStrictEqual(expect.arrayContaining([]));
			});
	});
});

describe("POST /api/users", () => {
	test("resolves with status 201 and returns correct user details.", () => {
		const newUser = {
			user_id: "auth0Id99",
			name: "Mark Grayson",
		};
		return request(app)
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.then((res) => {
				const user = res.body.user;
				expect(user).toEqual(
					expect.objectContaining({
						user_id: "auth0Id99",
						name: "Mark Grayson",
						staff: false,
						created_at: expect.any(String),
					})
				);
			});
	});

	test("Responds with status 400 and an appropriate message when name field is empty", () => {
		const newUser = {
			user_id: "auth0Id99",
			name: "",
		};
		return request(app)
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("A user cannot be added without a name");
			});
	});

	test("Responds with status 400 and an appropriate message when user_id field is empty", () => {
		const newUser = {
			user_id: "",
			name: "Mark Grayson",
		};
		return request(app)
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("A user cannot be added without an ID");
			});
	});

	test("Responds with status 400 when user_id is not a string", () => {
		const newUser = {
			user_id: 9,
			name: "Mark Grayson",
		};
		return request(app)
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("User ID must be a string");
			});
	});

	test("Responds with status 409 and an appropriate message if the user already exists", () => {
		const newUser = {
			user_id: "auth0Id1",
			name: "Mark Grayson",
		};
		return request(app)
			.post("/api/users")
			.send(newUser)
			.expect(409)
			.then((res) => {
				expect(res.body.msg).toBe("Conflict: Duplicate Entry");
			});
	});
});

describe("POST /api/events", () => {
	test("resolves with status 201 and returns correct event details.", () => {
		const newEvent = {
			title: "Powerlifting meet",
			organiser: "auth0Id18",
			description:
				"Compete with others in your weight class to pick up the heaviest things!",
			datetime: "2024-08-29T23:00:00.000Z",
			location: "200 Juicy St, B16 8OI",
		};
		return request(app)
			.post("/api/events")
			.send(newEvent)
			.expect(201)
			.then((res) => {
				const event = res.body.event;

				expect(event).toEqual(
					expect.objectContaining({
						event_id: 16,
						title: "Powerlifting meet",
						organiser: "auth0Id18",
						description:
							"Compete with others in your weight class to pick up the heaviest things!",
						datetime: "2024-08-29T23:00:00.000Z",
						location: "200 Juicy St, B16 8OI",
						created_at: expect.any(String),
					})
				);
			});
	});

	test("Responds with status 400 and an appropriate message when a field is empty", () => {
		const newEvent = {
			title: "",
			organiser: "auth0Id18",
			description:
				"Compete with others in your weight class to pick up the heaviest things!",
			datetime: "2024-08-29T23:00:00.000Z",
			location: "200 Juicy St, B16 8OI",
		};
		const newEvent2 = {
			title: "event of some kind",
			organiser: "auth0Id18",
			description: "",
			datetime: "2024-08-29T23:00:00.000Z",
			location: "200 Juicy St, B16 8OI",
		};
		return request(app)
			.post("/api/events")
			.send(newEvent)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Empty or missing field");
				return request(app)
					.post("/api/events")
					.send(newEvent2)
					.expect(400)
					.then((res) => {
						expect(res.body.msg).toBe("Empty or missing field");
					});
			});
	});

	test("Responds with status 400 and an appropriate message when a field is missing", () => {
		const newEvent = {
			title: "arfertasdtggd",
			description:
				"Compete with others in your weight class to pick up the heaviest things!",
			datetime: "2024-08-29T23:00:00.000Z",
			location: "200 Juicy St, B16 8OI",
		};
		const newEvent2 = {
			title: "event of some kind",
			organiser: "auth0Id18",
			description: "askejriodj ioajoid joifdj soia",
			location: "200 Juicy St, B16 8OI",
		};
		return request(app)
			.post("/api/events")
			.send(newEvent)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Empty or missing field");
				return request(app)
					.post("/api/events")
					.send(newEvent2)
					.expect(400)
					.then((res) => {
						expect(res.body.msg).toBe("Empty or missing field");
					});
			});
	});
});

describe("POST /api/events/:event_id/attending", () => {
	test("resolves with status 201 and returns correct attendance details.", () => {
		const newAttendance = {
			user_id: "auth0Id2",
		};
		return request(app)
			.post("/api/events/1")
			.send(newAttendance)
			.expect(201)
			.then((res) => {
				const attendance = res.body.attendance;
				expect(attendance).toEqual(
					expect.objectContaining({
						user_id: "auth0Id2",
						event_id: 1,
					})
				);
			});
	});

	test("Responds with status 400 if user_id is missing", () => {
		const newAttendance = {};
		return request(app).post("/api/events/1").send(newAttendance).expect(400);
	});

	test("Responds with status 400 if event_id is not a number", () => {
		const newAttendance = {
			user_id: 1,
		};
		return request(app).post("/api/events/one").send(newAttendance).expect(400);
	});

	test("Responds with status 409 if the user is already set to attend the event", () => {
		const newAttendance = {
			user_id: "auth0Id2",
		};
		return request(app)
			.post("/api/events/14")
			.send(newAttendance)
			.expect(409)
			.then((res) => {
				expect(res.body.msg).toBe("Conflict: Duplicate Entry");
			});
	});

	test("Responds with status 404 if non-existent event_id or user_id is entered", () => {
		const newAttendance = {
			user_id: "auth0Id78",
		};
		return request(app)
			.post("/api/events/1")
			.send(newAttendance)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("A referenced value was not found");
				return request(app)
					.post("/api/events/80")
					.send({ user_id: "auth0Id2" })
					.expect(404)
					.then((res) => {
						expect(res.body.msg).toBe("A referenced value was not found");
					});
			});
	});
});

describe("PATCH /api/users/:user_id", () => {
	test("resolves with status 200 and returns an updated user with altered staff column", () => {
		const patchUser = { staff: true };

		return request(app)
			.patch("/api/users/auth0Id1")
			.expect(200)
			.send(patchUser)
			.then((res) => {
				const updatedUser = res.body.user;
				expect(updatedUser).toEqual(
					expect.objectContaining({
						user_id: "auth0Id1",
						name: "Thomas Anderson",
						staff: true,
						created_at: expect.any(String),
					})
				);
			});
	});

	test("resolves with status 200 and returns an updated user with name column", () => {
		const patchUser = { name: "Michael Jordan" };

		return request(app)
			.patch("/api/users/auth0Id19")
			.expect(200)
			.send(patchUser)
			.then((res) => {
				const updatedUser = res.body.user;
				expect(updatedUser).toEqual(
					expect.objectContaining({
						user_id: "auth0Id19",
						name: "Michael Jordan",
						staff: false,
						created_at: expect.any(String),
					})
				);
			});
	});

	test("Responds with error 404 when given a user_id that doesn't exist", () => {
		const patchUser = { name: "Michael Jordan" };

		return request(app)
			.patch("/api/users/auth0Id94")
			.expect(404)
			.send(patchUser)
			.then((res) => {
				expect(res.body.msg).toBe("No user for given ID");
			});
	});

	test("Responds with error 400 when not given a valid field to update", () => {
		const patchUser = {
			invalidField: "The database should work how I want it to!",
		};

		return request(app)
			.patch("/api/users/auth0Id2")
			.expect(400)
			.send(patchUser)
			.then((res) => {
				expect(res.body.msg).toBe("No valid update provided");
			});
	});

	test("Responds with error 400 when given an invalid date type for name field", () => {
		const patchUser = {
			name: 12,
		};

		return request(app)
			.patch("/api/users/auth0Id2")
			.expect(400)
			.send(patchUser)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid data type for field");
			});
	});

	test("Responds with error 400 when given an invalid date type for staff field", () => {
		const patchUser = {
			staff: "true",
		};

		return request(app)
			.patch("/api/users/auth0Id2")
			.expect(400)
			.send(patchUser)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid data type for field");
			});
	});
});

describe("PATCH /api/events/:event_id", () => {
	test("resolves with status 200 and returns an updated event with 1 altered column", () => {
		const patchEvent = {
			title: "badminton tourney",
			description:
				"Contenders will progress through group stages and the finalists will win a cash prize of £100 for the winner and £50 for the runner up!",
			location: "404 not found ave, A04 1NF",
			datetime: "2024-06-20T15:00:00.000Z",
		};

		return request(app)
			.patch("/api/events/1")
			.expect(200)
			.send(patchEvent)
			.then((res) => {
				const updatedEvent = res.body.event;
				expect(updatedEvent).toEqual(
					expect.objectContaining({
						event_id: 1,
						title: "badminton tourney",
						organiser: "auth0Id3",
						description:
							"Contenders will progress through group stages and the finalists will win a cash prize of £100 for the winner and £50 for the runner up!",
						datetime: "2024-06-20T15:00:00.000Z",
						location: "404 not found ave, A04 1NF",
						created_at: expect.any(String),
					})
				);
			});
	});

	test("Successfully updates an event with multiple altered columns", () => {
		const patchEvent = {
			title: "Athletics meet",
			description: "Compete in various athletics events.",
			location: "123 Stadium Rd, M78 9AB",
			datetime: "2024-08-17T10:00:00.000Z",
		};

		return request(app)
			.patch("/api/events/15")
			.expect(200)
			.send(patchEvent)
			.then((res) => {
				const updatedEvent = res.body.event;
				expect(updatedEvent).toEqual(
					expect.objectContaining({
						event_id: 15,
						title: "Athletics meet",
						organiser: "auth0Id5",
						description: "Compete in various athletics events.",
						datetime: "2024-08-17T10:00:00.000Z",
						location: "123 Stadium Rd, M78 9AB",
						created_at: expect.any(String),
					})
				);
			});
	});

	test("Successfully updates an event when given 1 field", () => {
		const patchEvent = {
			title: "Athletics meet",
		};

		return request(app)
			.patch("/api/events/15")
			.expect(200)
			.send(patchEvent)
			.then((res) => {
				const updatedEvent = res.body.event;
				expect(updatedEvent).toEqual(
					expect.objectContaining({
						event_id: 15,
						title: "Athletics meet",
						organiser: "auth0Id5",
						description: "Compete in various track and field events.",
						datetime: "2024-08-18T09:00:00.000Z",
						location: "123 Stadium Rd, M78 9AB",
						created_at: expect.any(String),
					})
				);
			});
	});

	////////////////////////////////////////////////////////////////////////////////////

	test("Responds with error 404 when given an event_id that doesn't exist", () => {
		const patchEvent = { title: "Silent Disco" };

		return request(app)
			.patch("/api/events/58")
			.expect(404)
			.send(patchEvent)
			.then((res) => {
				expect(res.body.msg).toBe("No event by given ID");
			});
	});

	test("Responds with error 400 when not given a valid field to update", () => {
		const patchEvent = {
			invalidField: "The database should work how I want it to!",
		};

		return request(app)
			.patch("/api/events/15")
			.expect(400)
			.send(patchEvent)
			.then((res) => {
				expect(res.body.msg).toBe("No valid fields provided");
			});
	});

	test("Responds with error 400 when given an invalid date type for a field", () => {
		const patchEvent = {
			title: 20,
		};

		return request(app)
			.patch("/api/events/15")
			.expect(400)
			.send(patchEvent)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid data type submitted");
			});
	});

	test("Responds with error 400 when given an event_id that is not a number", () => {
		const patchEvent = {
			title: "Fancy dress party",
		};

		return request(app)
			.patch("/api/events/five")
			.expect(400)
			.send(patchEvent)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid data type submitted");
			});
	});
});

describe("DELETE /api/events/:event_id/attendee", () => {
	test("resolves with status 204 and removes attendance entry from database", () => {
		return db
			.query(
				`
            SELECT * FROM attendance
            WHERE event_id = 2 AND user_id = 'auth0Id14';
            `
			)
			.then((res) => {
				expect(res.rowCount).toBe(1);
				const userId = { user_id: "auth0Id14" };
				return request(app)
					.delete("/api/events/2/attendee")
					.expect(204)
					.send(userId);
			})
			.then(() => {
				return db.query(`
            SELECT * FROM attendance
            WHERE event_id = 2 AND user_id = 'auth0Id14';
            `);
			})
			.then((res) => {
				expect(res.rowCount).toBe(0);
			});
	});

	test("Responds with status 404 when given an event_id that doesn't exist", () => {
		const userId = { user_id: "auth0Id14" };
		return request(app)
			.delete("/api/events/88/attendee")
			.expect(404)
			.send(userId);
	});

	test("Responds with status 404 when given a user_id that doesn't exist", () => {
		const userId = { user_id: "auth0Id98" };
		return request(app)
			.delete("/api/events/1/attendee")
			.expect(404)
			.send(userId);
	});

	test("Responds with status 400 when given no user_id", () => {
		const userId = {};
		return request(app)
			.delete("/api/events/1/attendee")
			.expect(400)
			.send(userId)
			.then((res) => {
				expect(res.body.msg).toBe("No user_id provided");
			});
	});

	test("Responds with status 400 when given event_id is not a number", () => {
		const userId = { user_id: "auth0Id14" };
		return request(app)
			.delete("/api/events/two/attendee")
			.expect(400)
			.send(userId);
	});
});

describe("DELETE /api/events/:event_id", () => {
	test("resolves with status 204 and removes event from database along with all attendance entries for the event", () => {
		return db
			.query(
				`
            SELECT * FROM events
            WHERE event_id = 1;
            `
			)
			.then((res) => {
				expect(res.rowCount).toBe(1);
			})
			.then(() => {
				return db
					.query(
						`
            SELECT * FROM attendance
            WHERE event_id = 1;
            `
					)
					.then((res) => {
						expect(res.rowCount).toBe(3);
						return request(app).delete("/api/events/1").expect(204);
					});
			})
			.then(() => {
				return db.query(`
            SELECT * FROM events
            WHERE event_id = 1;
            `);
			})
			.then((res) => {
				expect(res.rowCount).toBe(0);
				return db
					.query(
						`
            SELECT * FROM attendance
            WHERE event_id = 1;
            `
					)
					.then((res) => {
						expect(res.rowCount).toBe(0);
					});
			});
	});

	test("Responds with status 404 when given an event_id that doesn't exist", () => {
		return request(app).delete("/api/events/88").expect(404);
	});

	test("Responds with status 400 when given an event_id that is not a number", () => {
		return request(app).delete("/api/events/seven").expect(400);
	});
});
