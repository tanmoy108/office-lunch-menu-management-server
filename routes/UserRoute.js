const express = require("express");
const routes = express.Router();
const UserController = require("../controller/UserController")

routes.get("/:id",UserController.getUserInfo);

exports.routes = routes;