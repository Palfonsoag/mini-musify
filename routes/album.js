"use strict";

var express = require("express");

var AlbumController = require("../controllers/album");

var api = express.Router(); //permite hacer las funciones get,post,put etc
var multiparty = require("connect-multiparty");

var md_auth = require("../middlewares/authenticated"); //carga del middleware para restringir el acceso a la ruta
var md_upload = multiparty({ uploadDir: "./uploads/albums" });

api.get("/album/:id", md_auth.ensureAuth, AlbumController.getAlbum);
api.get(
  "/album-by-artist/:id",
  md_auth.ensureAuth,
  AlbumController.getAlbumPopulated
);
api.post("/save-album", md_auth.ensureAuth, AlbumController.saveAlbum);
api.get("/album-list/:artist?", md_auth.ensureAuth, AlbumController.getAlbums);
api.put("/update-album/:id", md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete(
  "/delete-album/:id",
  md_auth.ensureAuth,
  AlbumController.deleteAlbum
);
api.post(
  "/upload-image-album/:id",
  [md_auth.ensureAuth, md_upload],
  AlbumController.uploadImage
);
api.get(
  "/get-image-album/:imageFile",
  md_auth.ensureAuth,
  AlbumController.getImageFile
);

module.exports = api;
