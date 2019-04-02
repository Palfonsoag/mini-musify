"use strict";
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");

function pruebas(req, res) {
  res.status(200).send({
    message: "Probando ruta del controlador de usuarios"
  });
}

function saveUser(req, res) {
  var user = new User(); //instancia de usuario nueva
  var params = req.body; //recogemos los datos que recibimos por el post del cliente
  console.log(params);
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
            if (params.gethas) {
              //devolver un token de jwt
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

module.exports = {
  pruebas,
  saveUser,
  loginUser
};
