"use strict";

var express = require("express");

var ArtistController = require("../controllers/artist");

var api = express.Router(); //permite hacer las funciones get,post,put etc
var multiparty = require("connect-multiparty");

var md_auth = require("../middlewares/authenticated"); //carga del middleware para restringir el acceso a la ruta
var md_upload = multiparty({ uploadDir: "./uploads/artists" });

api.get("/artist/:id", md_auth.ensureAuth, ArtistController.getArtist);
api.post("/save-artist", md_auth.ensureAuth, ArtistController.saveArtist);
api.get("/artist-list/:page?", md_auth.ensureAuth, ArtistController.getArtists);
api.put(
  "/update-artist/:id",
  md_auth.ensureAuth,
  ArtistController.updateArtist
);
api.delete(
  "/delete-artist/:id",
  md_auth.ensureAuth,
  ArtistController.deleteArtist
);
api.post(
  "/upload-image-artist/:id",
  [md_auth.ensureAuth, md_upload],
  ArtistController.uploadImage
);
api.get(
  "/get-image-artist/:imageFile",
  md_auth.ensureAuth,
  ArtistController.getImageFile
);

module.exports = api;
