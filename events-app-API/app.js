const { getAllUsers } = require("./controllers/get-controllers.js");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/getUsers", getAllUsers);

module.exports = app;
