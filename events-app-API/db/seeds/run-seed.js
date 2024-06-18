const seed = require("./seed.js");
const db = require("../connection.js");
const prodData = require("../prod-data/index.js");

const runSeed = () => {
	return seed(prodData).then(() => db.end());
};

runSeed();
