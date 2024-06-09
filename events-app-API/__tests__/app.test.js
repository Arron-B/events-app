const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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

	test("resolves status 200 and correct data for a user with longer ID", () => {
		return request(app)
			.get("/api/users/auth0Id10")
			.expect(200)
			.then((res) => {
				const user = res.body.user;
				expect(user).toEqual(
					expect.objectContaining({
						user_id: "auth0Id10",
						name: "Diana Prince",
						staff: false,
					})
				);
				expect(typeof user.created_at).toBe("string");
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
					expect(typeof event.date).toBe("string");
					expect(typeof event.time).toBe("string");
					expect(typeof event.location).toBe("string");
					expect(typeof event.created_at).toBe("string");

					if (event.event_id === 1) {
						expect(event.title).toBe("badminton tourney");
						expect(event.organiser).toBe("auth0Id3");
						expect(event.description).toBe(
							"Contenders will progress through group stages and the finalists will win a cash prize of £100 for the winner and £50 for the runner up!"
						);
						expect(event.location).toBe("404 not found ave, A04 1NF");
					}

					if (event.event_id === 25) {
						expect(event.title).toBe("Track and Field Meet");
						expect(event.organiser).toBe("auth0Id5");
						expect(event.description).toBe(
							"Compete in various track and field events."
						);
						expect(event.location).toBe("123 Stadium Rd, M78 9AB");
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
					expect(typeof event.date).toBe("string");
					expect(typeof event.time).toBe("string");
					expect(typeof event.location).toBe("string");
					expect(typeof event.created_at).toBe("string");

					if (event.event_id === 14) {
						expect(event).toEqual(
							expect.objectContaining({
								event_id: 14,
								title: "Softball Game",
								organiser: "auth0Id8",
								description: "Join us for a friendly game of softball.",
								date: expect.any(String),
								time: expect.any(String),
								location: "901 Diamond St, L56 7YZ",
								created_at: expect.any(String),
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
				expect(events).toBeSortedBy("date", { descending: false });
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
						date: expect.any(String),
						time: expect.any(String),
						location: "404 not found ave, A04 1NF",
						created_at: expect.any(String),
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
						date: expect.any(String),
						time: expect.any(String),
						location: "678 Bike Path, I89 0ST",
						created_at: expect.any(String),
					})
				);
			});
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

	test("Sends back empty array for an event with no attendees. Works with multiple digit event_ids.", () => {
		return request(app)
			.get("/api/events/11/attendees")
			.expect(200)
			.then((res) => {
				const attendees = res.body.attendees;
				expect(typeof attendees).toBe("object");
				expect(attendees.length).toBe(0);
			});
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
							date: expect.any(String),
							time: expect.any(String),
							location: "404 not found ave, A04 1NF",
							created_at: expect.any(String),
						},
						{
							event_id: 6,
							title: "Tennis Championship",
							organiser: "auth0Id18",
							description:
								"Participate in our tennis championship for a chance to win great prizes.",
							date: expect.any(String),
							time: expect.any(String),
							location: "789 Court Dr, D56 7IJ",
							created_at: expect.any(String),
						},
						{
							event_id: 7,
							title: "Charity Fun Run",
							organiser: "auth0Id20",
							description:
								"Participate in our charity run to raise funds for a good cause.",
							date: expect.any(String),
							time: expect.any(String),
							location: "101 Riverside Dr, E78 9KL",
							created_at: expect.any(String),
						},
						{
							event_id: 10,
							title: "Swimming Gala",
							organiser: "auth0Id18",
							description:
								"Compete in our swimming gala with various categories.",
							date: expect.any(String),
							time: expect.any(String),
							location: "567 Pool Rd, H67 8QR",
							created_at: expect.any(String),
						},
						{
							event_id: 13,
							title: "Archery Competition",
							organiser: "auth0Id12",
							description: "Show off your archery skills in our competition.",
							date: expect.any(String),
							time: expect.any(String),
							location: "890 Target Ln, K34 5WX",
							created_at: expect.any(String),
						},
						{
							event_id: 15,
							title: "Track and Field Meet",
							organiser: "auth0Id5",
							description: "Compete in various track and field events.",
							date: expect.any(String),
							time: expect.any(String),
							location: "123 Stadium Rd, M78 9AB",
							created_at: expect.any(String),
						},
					])
				);
			});
	});
});
