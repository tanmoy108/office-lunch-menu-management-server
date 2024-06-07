const express = require("express");
const routes = express.Router();
const SignupController = require("../controller/SignupController");
const LoginController = require("../controller/LoginController");

routes.post("/signup",SignupController.createNewAccount)
.post("/login",LoginController.loginAccount)


exports.routes=routes;