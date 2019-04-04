"use strict";

var path = require("path"); //
var fs = require("fs"); // librerias que permiten trabajar con el sistema de ficheros

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getArtist(req, res) {
  res.status(200).send({ message: "Metodo getArtist" });
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

module.exports = {
  getArtist,
  saveArtist
};
