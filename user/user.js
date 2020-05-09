/*
API for user info
*/
const express = require("express");
const router = express.Router();

const User = require("../models/User"); //get model

router.get("/", (req, res) => {
  res.send("we are at /user/");
});

//find user by username.
router.get("/:username", (req, res) => {
  const users = User.find({ username: req.params.username }).exec();
  users
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post("/signup", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    preferences: req.body.preferences,
    info: req.body.info,
  });

  newUser
    .save()
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

module.exports = router;
