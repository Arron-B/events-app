const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/getUsers", () => {
	test("mock test of first end-point to confirm dev environment is working", () => {
		return request(app).get("/api/getUsers").expect(200);
	});
});
