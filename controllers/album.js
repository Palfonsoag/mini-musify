"use strict";

var path = require("path"); //
var fs = require("fs"); // librerias que permiten trabajar con el sistema de ficheros
var mongoosePaginate = require("mongoose-pagination");

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getAlbum(req, res) {
  var albumId = req.params.id;
  Album.findOne({ _id: albumId }, (err, album) => {
    if (err) {
      res.status(500).send({ message: "error en la peticion" });
    } else {
      if (!album) {
        res.status(404).send({ message: "el album no ha sido encontrado" });
      } else {
        res.status(200).send({ album });
      }
    }
  });
}

function getAlbumPopulated(req, res) {
  var albumId = req.params.id;
  Album.findOne({ _id: albumId })
    .populate({ path: "artist" })
    .exec((err, album) => {
      if (err) {
        res.status(500).send({ message: "error al guardar el artista" });
      } else {
        if (!album) {
          res.status(404).send({ message: "el album no ha sido guardado" });
        } else {
          res.status(200).send({ album: album });
        }
      }
    });
}

function saveAlbum(req, res) {
  var album = new Album();
  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = null;
  album.artist = params.artist;
  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({ message: "error al guardar el album" });
    } else {
      if (!albumStored) {
        res.status(404).send({ message: "el album no ha sido guardado" });
      } else {
        res.status(200).send({ album: albumStored });
      }
    }
  });
}

function getAlbums(req, res) {
  var artistId = req.params.artist;
  var find;
  if (!artistId) {
    find = Album.find({}).sort("title");
  } else {
    find = Album.find({ artist: artistId }).sort("year");
  }

  find.populate({ path: "artist" }).exec((err, albums) => {
    if (err) {
      res.status(500).send({ message: "error en la peticion" });
    } else {
      if (!albums) {
        res.status(404).send({ message: "No hay albums" });
      } else {
        res.status(200).send({ albums });
      }
    }
  });
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

  Album.findOneAndUpdate({ _id: albumId }, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ message: "error al actualizar el Album" });
    } else {
      if (!albumUpdated) {
        res.status(404).send({ message: "El Album no existe" });
      } else {
        res.status(200).send({ album: albumUpdated });
      }
    }
  });
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;
  Album.findOneAndDelete({ _id: albumId }, (err, albumRemoved) => {
    if (err) {
      res.status(500).send({ message: "error al eliminar el Album" });
    } else {
      if (!albumRemoved) {
        res.status(404).send({ message: "El Album no ha sido eliminado" });
      } else {
        Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
          if (err) {
            res
              .status(500)
              .send({ message: "error al eliminar  la cancion del album" });
          } else {
            if (!songRemoved) {
              res
                .status(404)
                .send({ message: "La cancion  no ha sido eliminada" });
            } else {
              res.status(200).send({ album: albumRemoved });
            }
          }
        });
      }
    }
  });
}

function uploadImage(req, res) {
  var albumId = req.params.id;
  var file_name = "not_uploaded";
  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("/");
    file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      Album.findOneAndUpdate(
        { _id: albumId },
        { image: file_name },
        (err, albumUpdated) => {
          if (err) {
            res.status(500).send({ message: "error al actualizar el Album" });
          } else {
            if (!albumUpdated) {
              res.status(404).send({ message: "El Album no existe" });
            } else {
              res.status(200).send({ album: albumUpdated });
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

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;

  fs.exists("./uploads/albums/" + imageFile, function(exists) {
    if (exists) {
      res.sendFile(path.resolve("./uploads/albums/" + imageFile));
    } else {
      res.status(200).send({ message: "Imagen no existe..." });
    }
  });
}

module.exports = {
  getAlbum,
  saveAlbum,
  uploadImage,
  getImageFile,
  getAlbumPopulated,
  getAlbums,
  deleteAlbum,
  updateAlbum
};
