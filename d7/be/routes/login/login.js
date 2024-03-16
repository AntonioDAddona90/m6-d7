const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const AuthorModel = require("../../models/authorModel");
const jwt = require("jsonwebtoken");

login.post("/login", async (req, res) => {
  const user = await AuthorModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send({
      statusCode: 404,
      message: "Email o Password non valida.",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send({
      statusCode: 400,
      message: "Email o Password non valida.",
    });
  }
  const token = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      avatar: user.avatar,
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.header("Authorization", token).status(200).send({
    statusCode: 200,
    message: "Login effettuato con successo",
    token,
  });
});

//! GET /login => restituisce token di accesso
login.get("/login", async (req, res) => {
  try {
    const user = await AuthorModel.findOne({ _id: req.body._id });

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "Email o Password non valida.",
      });
    }

    const safeUser = { ...user.toObject() };
    delete safeUser.password;

    res.status(200).send({
      statusCode: 200,
      message: "Utente collegato trovato",
      safeUser,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

//! GET /me => restitusce l'utente collegato al token di accesso
login.get("/me", async (req, res) => {
  try {
    const user = await AuthorModel.findOne({ _id: req.body._id });
    console.log(user);

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "non ho trovato alcun utente!",
      });
    }

    const safeUser = { ...user.toObject() };
    delete safeUser.password;

    res.status(200).send({
      statusCode: 200,
      message: "Utente collegato trovato",
      safeUser,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

module.exports = login;
