"use strict";

var express = require("express");

var ArtistController = require("../controllers/artist");

var api = express.Router(); //permite hacer las funciones get,post,put etc

var md_auth = require("../middlewares/authenticated"); //carga del middleware para restringir el acceso a la ruta

api.get("/artist", md_auth.ensureAuth, ArtistController.getArtist);
api.post("/save-artist", md_auth.ensureAuth, ArtistController.saveArtist);

module.exports = api;
