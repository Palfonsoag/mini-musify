"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema; //crea objeto tipo schema para guardar datos

var AlbumSchema = Schema({
  title: String,
  description: String,
  year: Number,
  image: String,
  artist: { type: Schema.ObjectId, ref: "Artist" }
});

module.exports = mongoose.model("Album", AlbumSchema); //exportamos el modelo para que sea usado en por el proyecto
