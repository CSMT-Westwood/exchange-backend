/*
API for user info
*/
const express = require("express");
const router = express.Router();
const validations = require("./input_validations"); //get validation schemas
const User = require("../models/User"); //get model
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //jsonwebtoken
const loginRequired = require("../verifyToken"); //verifyToken.js

//For debugging purpose, return all users in database
router.get("/", async (req, res) => {
    const AllUsers = await User.find();
    res.json(AllUsers);
});

//find user by username. Needs login token in the header
router.get("/searchUser/:username", loginRequired, async (req, res) => {
    const user = await User.find({ username: req.params.username });
    if (user.length == 0) return res.status(404).json({message: "User not found."});
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
        return res.status(400).json({message: error.details[0].message}); //send message if input is invalid
    }
    //Check duplicates in database
    if (await User.findOne({ username: req.body.username }))
        return res.status(409).json({message: "The username already exists."});
    if (await User.findOne({ email: req.body.email }))
        return res.status(409).json({message: "The email has been registered."});

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
        res.status(400).json({ message: err });
    }
});

//*****User Login API******/
//body params: name(Email OR Username), password
router.post("/login", async (req, res) => {
    //check format thru validation
    const error = validations.loginSchema.validate(req.body).error;
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    let UserbyName = await User.findOne({ email: req.body.username }); //try email
    if (!UserbyName) {
        UserbyName = await User.findOne({ username: req.body.username }); //try username
        if (!UserbyName) return res.status(401).json({message: "User not found."}); //if not found, return error
    }

    //check password
    const rightPassword = await bcrypt.compare(
        req.body.password,
        UserbyName.password
    );
    if (!rightPassword) return res.status(401).json({message: "Invalid password."});

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


// GET USER'S POSTS // GET USER'S POSTS // GET USER'S POSTS // GET USER'S POSTS
router.get("/posts", loginRequired, async (req, res) => {
    const postPromises = [];
    try {
        const user = await User.findOne({_id: req.user._id});
        for (each of user.posts) {
            postPromises.push(Post.findOne({_id: each}).select("-author -__v") );
        }
    } catch (e) {
        console.log(e);
        res.status(401).json({message: e});
    }

    try {
        const posts = await Promise.all(postPromises);
        res.status(200).json(posts);
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "Cannot find the post."});
    }
})

module.exports = router;
