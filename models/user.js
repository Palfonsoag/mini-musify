"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema; //crea objeto tipo schema para guardar datos

var UserSchema = Schema({
  name: String,
  surname: String,
  password: String,
  role: String,
  image: String
});

module.exports = mongoose.model("User", UserSchema); //exportamos el modelo para que sea usado en por el proyecto
