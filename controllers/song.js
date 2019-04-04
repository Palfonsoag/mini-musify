"use strict";

var path = require("path"); //
var fs = require("fs"); // librerias que permiten trabajar con el sistema de ficheros
var mongoosePaginate = require("mongoose-pagination");

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getSong(req, res) {
  var songId = req.params.id;
  Song.findOne({ _id: songId })
    .populate({ path: "album" })
    .exec((err, song) => {
      if (err) {
        res.status(500).send({ message: "error  en la peticion" });
      } else {
        if (!song) {
          res.status(404).send({ message: "la cancion no existe" });
        } else {
          res.status(200).send({ song });
        }
      }
    });
}

function getSongs(req, res) {
  var albumId = req.params.album;
  var find;
  if (!albumId) {
    find = Song.find({}).sort("name");
  } else {
    find = Song.find({ album: albumId }).sort("number");
  }

  find
    .populate({
      path: "album",
      populate: {
        path: "artist",
        model: "Artist"
      }
    })
    .exec((err, songs) => {
      if (err) {
        res.status(500).send({ message: "error en la peticion" });
      } else {
        if (!songs) {
          res.status(404).send({ message: "No hay canciones" });
        } else {
          res.status(200).send({ songs });
        }
      }
    });
}

function saveSong(req, res) {
  var song = new Song();
  var params = req.body;

  song.number = params.number;
  song.duration = params.duration;
  song.name = params.name;
  song.file = null;
  song.album = params.album;
  song.save((err, songStored) => {
    if (err) {
      res.status(500).send({ message: "error al guardar la cancion" });
    } else {
      if (!songStored) {
        res.status(404).send({ message: "la cancion no ha sido guardada" });
      } else {
        res.status(200).send({ song: songStored });
      }
    }
  });
}

function updateSong(req, res) {
  var songId = req.params.id;
  var update = req.body;

  Song.findOneAndUpdate({ _id: songId }, update, (err, songUpdated) => {
    if (err) {
      res.status(500).send({ message: "error al actualizar la cancion" });
    } else {
      if (!songUpdated) {
        res.status(404).send({ message: "La cancion no existe" });
      } else {
        res.status(200).send({ song: songUpdated });
      }
    }
  });
}

function deleteSong(req, res) {
  var songId = req.params.id;
  Song.findOneAndDelete({ _id: songId }, (err, songRemoved) => {
    if (err) {
      res.status(500).send({ message: "error al eliminar la cancion" });
    } else {
      if (!songRemoved) {
        res.status(404).send({ message: "la cancion no ha sido eliminada" });
      } else {
        res.status(200).send({ song: songRemoved });
      }
    }
  });
}

function uploadFile(req, res) {
  var songId = req.params.id;
  var file_name = "not_uploaded";
  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split("/");
    file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "mp3" || file_ext == "ogg") {
      Song.findOneAndUpdate(
        { _id: songId },
        { file: file_name },
        (err, songUpdated) => {
          if (err) {
            res.status(500).send({ message: "error al actualizar la cancion" });
          } else {
            if (!songUpdated) {
              res.status(404).send({ message: "la cancion no existe" });
            } else {
              res.status(200).send({ file: file_name, song: songUpdated });
            }
          }
        }
      );
    } else {
      res.status(200).send({ message: "extension del archivo no valida" });
    }
  } else {
    res.status(200).send({ message: "Imagen no subida..." });
  }
}

function getSongFile(req, res) {
  var songFile = req.params.songFile;

  fs.exists("./uploads/songs/" + songFile, function(exists) {
    if (exists) {
      res.sendFile(path.resolve("./uploads/songs/" + songFile));
    } else {
      res.status(200).send({ message: "Cancion no existe..." });
    }
  });
}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};
