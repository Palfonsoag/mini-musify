"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema; //crea objeto tipo schema para guardar datos

var SongSchema = Schema({
  number: String,
  name: String,
  duration: String,
  file: Number,
  album: { type: Schema.ObjectId, ref: "Album" }
});

module.exports = mongoose.model("Song", SongSchema); //exportamos el modelo para que sea usado en por el proyecto
