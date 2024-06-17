const express = require("express");
const routes = express.Router();
const VerifyTokenController = require("../controller/VerifyTokenController");

routes.get("/", VerifyTokenController.verifyToken, (req, res) => {
  console.log("aa",req.user)
  res.status(200).json(req.user);
});
exports.routes = routes;
