const express = require("express");
const router = express.Router();
const Post = require("./models/Post"); //get model
const User = require("./models/User");
const loginRequired = require("./verifyToken"); //verifyToken.js

//temp middleware
//get complete user object
async function getUserObject(req, res, next) {
    userID = req.user._id;
    try {
        user = await User.findById(userID);
    } catch (e) {
        return res.status(400).json("user not found");
    }
    req.user = user;
    next();
}
/*****GET FEED******/

//login required
router.get("/", [loginRequired, getUserObject], async (req, res) => {
    console.log(req.user);
    user = req.user;
    //get posts by searching preferences
    let preferencePost = [];
    for (item of user.preferences) {
        preferencePost += await Post.find(
            { $text: { $search: item } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
    }
    //get history
    let historyPost = [];
    for (item of user.viewHistory) {
        historyPost += await Post.find({ _id: item });
    }
    //get the user's own posts
    let ownPost = [];
    for (item of user.authorOf) {
        ownPost += await Post.find({ _id: item });
    }

    res.json({ preferencePost, historyPost, ownPost });
});

module.exports = router;
