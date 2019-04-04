"use strict";

var path = require("path"); //
var fs = require("fs"); // librerias que permiten trabajar con el sistema de ficheros
var mongoosePaginate = require("mongoose-pagination");

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getArtist(req, res) {
  var artistId = req.params.id;
  Artist.findOne({ _id: artistId }, (err, artist) => {
    if (err) {
      res.status(500).send({ message: "error en la peticion" });
    } else {
      if (!artist) {
        res.status(404).send({ message: "el artista no ha sido encontrado" });
      } else {
        res.status(200).send({ artist });
      }
    }
  });
}

function getArtists(req, res) {
  var page;
  if (req.params.page) {
    page = req.params.page;
  } else {
    page = 1;
  }

  var itemsPerPage = 3;

  Artist.find()
    .sort("name")
    .paginate(page, itemsPerPage, (err, artists, total) => {
      if (err) {
        res.status(500).send({ message: "error en la peticion" });
      } else {
        if (!artists) {
          res.status(404).send({ message: "No hay Artistas" });
        } else {
          return res.status(200).send({ totalItems: total, artists });
        }
      }
    });
}

function saveArtist(req, res) {
  var artist = new Artist();
  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = null;
  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({ message: "error al guardar el artista" });
    } else {
      if (!artistStored) {
        res.status(404).send({ message: "el artista no ha sido guardado" });
      } else {
        res.status(200).send({ artist: artistStored });
      }
    }
  });
}

function updateArtist(req, res) {
  var artistId = req.params.id;
  var update = req.body;

  Artist.findOneAndUpdate({ _id: artistId }, update, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({ message: "error al actualizar el Artista" });
    } else {
      if (!artistUpdated) {
        res.status(404).send({ message: "El Artista no existe" });
      } else {
        res.status(200).send({ artist: artistUpdated });
      }
    }
  });
}

function deleteArtist(req, res) {
  var artistId = req.params.id;
  Artist.findOneAndDelete({ _id: artistId }, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({ message: "error al eliminar el Artista" });
    } else {
      if (!artistRemoved) {
        res.status(404).send({ message: "El Artista no ha sido eliminado" });
      } else {
        Album.find({ artist: artistRemoved._id }).remove(
          (err, albumRemoved) => {
            if (err) {
              res
                .status(500)
                .send({ message: "error al eliminar el album del artista" });
            } else {
              if (!albumRemoved) {
                res
                  .status(404)
                  .send({ message: "El Album  no ha sido eliminado" });
              } else {
                Song.find({ album: albumRemoved._id }).remove(
                  (err, songRemoved) => {
                    if (err) {
                      res.status(500).send({
                        message: "error al eliminar el cancion del album"
                      });
                    } else {
                      if (!songRemoved) {
                        res.status(404).send({
                          message: "La cancion  no ha sido eliminada"
                        });
                      } else {
                        res.status(200).send({ artist: artistRemoved });
                      }
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  });
}

function uploadImage(req, res) {
  var artistId = req.params.id;
  var file_name = "not_uploaded";
  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("/");
    file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      Artist.findOneAndUpdate(
        { _id: artistId },
        { image: file_name },
        (err, artistUpdated) => {
          if (err) {
            res.status(500).send({ message: "error al actualizar el artista" });
          } else {
            if (!artistUpdated) {
              res.status(404).send({ message: "El artista no existe" });
            } else {
              res.status(200).send({ artist: artistUpdated });
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

  fs.exists("./uploads/artists/" + imageFile, function(exists) {
    if (exists) {
      res.sendFile(path.resolve("./uploads/artists/" + imageFile));
    } else {
      res.status(200).send({ message: "Imagen no existe..." });
    }
  });
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
