"use strict";

var express = require("express");

var SongController = require("../controllers/song");

var api = express.Router(); //permite hacer las funciones get,post,put etc
var multiparty = require("connect-multiparty");

var md_auth = require("../middlewares/authenticated"); //carga del middleware para restringir el acceso a la ruta
var md_upload = multiparty({ uploadDir: "./uploads/songs" });

api.get("/song/:id", md_auth.ensureAuth, SongController.getSong);
api.post("/save-song", md_auth.ensureAuth, SongController.saveSong);
api.get("/song-list/:album?", md_auth.ensureAuth, SongController.getSongs);
api.put("/update-song/:id", md_auth.ensureAuth, SongController.updateSong);
api.delete("/delete-song/:id", md_auth.ensureAuth, SongController.deleteSong);
api.post(
  "/upload-song-file/:id",
  [md_auth.ensureAuth, md_upload],
  SongController.uploadFile
);
api.get(
  "/get-file-song/:songFile",
  md_auth.ensureAuth,
  SongController.getSongFile
);

module.exports = api;
