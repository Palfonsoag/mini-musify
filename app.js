"use strict";

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

//cargar rutas
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configurar cabeceras

// rutas base
app.get("/pruebas", function(req, res) {
  res.status(200).send({ message: "url to test // Hi, I am Pedro Garcia" });
});

module.exports = app;
