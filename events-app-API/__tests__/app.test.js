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
