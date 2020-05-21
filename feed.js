const express = require("express");
const router = express.Router();
const Post = require("./models/Post"); //get model
const User = require("./models/User");
const loginRequired = require("./verifyToken"); //verifyToken.js
const middlewares = require("./middlewares");

/*****GET FEED******/
//login required
router.get(
    "/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        console.log(req.user);
        user = req.user;
        //get posts by searching preferences
        let preferencePosts = [];
        for (item of user.preferences) {
            preferencePosts += await Post.find(
                { $text: { $search: item } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });
        }
        //get followedPosts
        let followedPosts = [];
        for (item of user.followedPosts) {
            followedPosts += await Post.find({ _id: item });
        }
        //get the user's own posts
        let ownPosts = [];
        for (item of user.posts) {
            ownPosts += await Post.find({ _id: item });
        }

        //get posts thet the user responded to
        let activities = [];
        for (irem of user.activities) {
            activities += await Post.find({ _id: item });
        }

        res.json({ preferencePosts, followedPosts, ownPosts, activities });
    }
);

/****GET  ****/
module.exports = router;
