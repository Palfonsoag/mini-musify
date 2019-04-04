"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema; //crea objeto tipo schema para guardar datos

var ArtistSchema = Schema({
  name: String,
  description: String,
  image: String
});

module.exports = mongoose.model("Artist", ArtistSchema); //exportamos el modelo para que sea usado en por el proyecto
