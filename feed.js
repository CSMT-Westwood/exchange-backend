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
        let post;
        //get posts by searching preferences
        let preferencePosts = [];
        for (item of user.preferences) {
            post = await Post.find(
                { $text: { $search: item } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });
            preferencePosts.push(post);
        }
        console.log(typeof preferencePosts);
        //get followedPosts
        let followedPosts = [];
        for (item of user.followedPosts) {
            post = await Post.find({ _id: item });
            followedPosts.push(post);
        }
        //get the user's own posts
        let ownPosts = [];
        for (item of user.posts) {
            post = await Post.find({ _id: item });
            ownPosts.push(post);
        }

        //get posts thet the user responded to
        let activities = [];
        for (irem of user.activities) {
            post = await Post.find({ _id: item });
            activities.push(post);
        }

        res.json({ preferencePosts, followedPosts, ownPosts, activities });
    }
);

/****GET  ****/
module.exports = router;
