/*
API for user info
*/
const express = require("express");
const router = express.Router();
const validations = require("../input_validations"); //get validation schemas
const User = require("../models/User"); //get model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //jsonwebtoken
const loggedin = require("../user/verifyToken"); //verifyToken.js

//For debugging purpose, return all users in database
router.get("/", async (req, res) => {
    const AllUsers = await User.find();
    res.send(AllUsers);
});

//find user by username. Needs login token in the header
router.get("/searchUser/:username", loggedin, async (req, res) => {
    const user = await User.find({ username: req.params.username });
    if (user.length == 0) return res.status(400).send("User not found!");
    res.status(200).json(user);
});

/******User Signup API******/
router.post("/signup", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        preferences: req.body.preferences,
        info: req.body.info,
    });
    const error = validations.signUpSchema.validate(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message); //send message if input is invalid
    }
    //Check duplicates in database
    if (await User.findOne({ username: req.body.username }))
        return res.status(400).send("The username already exists.");
    if (await User.findOne({ email: req.body.email }))
        return res.status(400).send("The email has been registered.");

    //Hash Password
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    newUser.password = hashedpassword;

    //Creat a new user
    try {
        const addedUser = await newUser.save();
        res.status(200).json({
            username: addedUser.username,
            email: addedUser.email
        });
    } catch (err) {
        res.json({ message: err });
    }
});

//*****User Login API******/
//body params: name(Email OR Username), password
router.post("/login", async (req, res) => {
    //check format thru validation
    const error = validations.loginSchema.validate(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let UserbyName = await User.findOne({ email: req.body.name }); //try email
    if (!UserbyName) {
        UserbyName = await User.findOne({ username: req.body.name }); //try username
        if (!UserbyName) return res.status(400).send("incorrect, try again."); //if not found, return error
    }

    //check password
    const rightPassword = await bcrypt.compare(
        req.body.password,
        UserbyName.password
    );
    if (!rightPassword) return res.status(400).send("incorrect, try again.");

    //Token
    const token = jwt.sign(
        { _id: UserbyName._id, _username: UserbyName.username },
        process.env.TOKEN_SECRET
    );
    res.header("token", token).json({ token: token }); // issue a token to response header
    // res.status(200).json({ message: "success" });
});

//delete all user by username API, for debugging purposes
router.delete("/deleteUser/:username", async (req, res) => {
    try {
        const removedUser = await User.remove({
            username: req.params.username,
        });
        res.json(removedUser);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
