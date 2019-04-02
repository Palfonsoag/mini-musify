"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var api = express.Router();

//rutas del api
api.get("/user-controller-test", UserController.pruebas);
api.post("/register-user", UserController.saveUser);

module.exports = api;
