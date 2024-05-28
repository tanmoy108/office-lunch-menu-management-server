const express = require("express");
const routes = express.Router();
const MenuController = require("../controller/MenuController");

routes.get("/", MenuController.fetchItems)
    .get("/:id", MenuController.getItem)
    .post("/", MenuController.insertItems)
    .delete("/:id",MenuController.removeItem)
    .patch("/:id",MenuController.updateItem)

exports.routes = routes;
