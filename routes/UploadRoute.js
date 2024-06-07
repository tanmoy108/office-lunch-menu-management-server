const express = require("express");
const routes = express.Router();
const UploadController = require("../controller/UploadController");

routes.get("/", UploadController.uploadFiles);

exports.routes = routes;
