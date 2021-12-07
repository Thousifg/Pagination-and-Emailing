const express = require("express");

const usertController = require("./controller/user.controller");

const app = express();

app.use(express.json());

app.use("/users", usertController);

module.exports = app;
