"use strict";

var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
var jwt = require("../services/jwt");
var fs = require("fs");
var path = require("path");

function pruebas(req, res) {
  res.status(200).send({
    message: "Probando ruta del controlador de usuarios"
  });
}

function saveUser(req, res) {
  var user = new User(); //instancia de usuario nueva
  var params = req.body; //recogemos los datos que recibimos por el post del cliente
  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = "ROLE_USER";
  user.image = "null";

  if (params.password) {
    bcrypt.hash(params.password, null, null, function(err, hash) {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: "Error al guardar el usuario" });
          } else {
            if (!userStored) {
              res.status(400).send({ message: "No se registro el usuario" });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res
          .status(200)
          .send({ message: "Introduce todos los datos solicitados" });
      }
    });
  } else {
    res.status(200).send({ message: "Introduce la contrasena" });
  }
}

function loginUser(req, res) {
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: "error en la peticion" });
    } else {
      if (!user) {
        res.status(400).send({ message: "El usuario no existe" });
      } else {
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            if (params.gethash) {
              //devolver un token de jwt
              res.status(200).send({ token: jwt.createToken(user) });
            } else {
              res.status(200).send({ user });
            }
            //retorna datos del usuario
          } else {
            res
              .status(400)
              .send({ message: "El usuario no ha podido loguearse" });
          }
        });
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;
  User.findOneAndUpdate({ _id: userId }, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: "error al actualizar el usuari" });
    } else {
      if (!userUpdated) {
        res.status(404).send({ message: "El usuario no existe" });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
}

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = "not_uploaded";
  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("/");
    file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      User.findOneAndUpdate(
        { _id: userId },
        { image: file_name },
        (err, userUpdated) => {
          if (err) {
            res.status(500).send({ message: "error al actualizar el usuari" });
          } else {
            if (!userUpdated) {
              res.status(404).send({ message: "El usuario no existe" });
            } else {
              res.status(200).send({ image: file_name, user: userUpdated });
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
  fs.exists("./uploads/users/" + imageFile, function(exists) {
    if (exists) {
      res.sendFile(path.resolve("./uploads/users/" + imageFile));
    } else {
      res.status(200).send({ message: "Imagen no existe..." });
    }
  });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
