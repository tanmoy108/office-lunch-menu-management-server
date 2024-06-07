const express = require("express");
const routes = express.Router();
const CheckController = require("../controller/CheckController");

routes.post("/:id",CheckController.checkOTP)

exports.routes =routes;