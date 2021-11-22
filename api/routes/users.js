const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      password: hash,
      comment: req.body.comment,
    });

    user
        .save()
        .then(() => {
          res
              .status(201)
              .json({textMessage: `Użytkownik ${req.body.name} zostal utworzony`});
        })
        .catch(() => res.status(500).json({textMessage: "Blad Servera"}));
  });
});

router.post("/login", (req, res, next) => {
  // szukam Usera
  User.findOne({name: req.body.name})
      .then((user) => {
        if (!user) {
          return res.status(401).json({wiadomosc: "brak authoryzacji"});
        } else {
          bcrypt.compare(req.body.password, user.password).then((result) => {
            if (!result) {
              return res.status(401).json({wiadomosc: "brak authoryzacji"});
            }

            const token = jwt.sign(
                {name: user.name, userId: user._id},
                process.env.SECRET,
                {expiresIn: "8h"}
            );

            res.status(200).json({wiadomosc: "zalogowoano", token: token});
          });
        }
      })
      .catch(() => res.status(500).json({wiadomosc: "Błąd serwera"}));
});

module.exports = router;
