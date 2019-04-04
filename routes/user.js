"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multiparty = require("connect-multiparty");

var md_upload = multiparty({ uploadDir: "./uploads/users" });
//rutas del api
api.get("/user-controller-test", md_auth.ensureAuth, UserController.pruebas);
api.put("/update-user/:id", md_auth.ensureAuth, UserController.updateUser);
api.post("/register-user", UserController.saveUser);
api.post("/login", UserController.loginUser);
api.post(
  "/upload-image-user/:id",
  [md_auth.ensureAuth, md_upload],
  UserController.uploadImage
);
api.get(
  "/get-image-user/:imageFile",
  md_auth.ensureAuth,
  UserController.getImageFile
);

module.exports = api;
