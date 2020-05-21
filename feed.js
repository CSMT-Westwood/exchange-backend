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
        user = req.user;
        let post;
        //get posts by searching preferences
        let preferencePosts = [];
        for (item of user.preferences) {
            post = await Post.find(
                { $text: { $search: item } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });
            preferencePosts.concat(post);
        }

        //get followedPosts
        let followedPosts = [];
        for (item of user.followedPosts) {
            post = await Post.findOne({ _id: item });
            if (post !== null) {
                followedPosts.push(post);
            }
        }
        //get the user's own posts
        let ownPosts = [];
        for (item of user.posts) {
            post = await Post.findOne({ _id: item });
            if (post !== null) ownPosts.push(post);
        }

        //get posts that the user responded to
        let activities = [];
        for (item of user.activities) {
            post = await Post.findOne({ _id: item });
            if (post !== null) activities.push(post);
        }

        res.json({ preferencePosts, followedPosts, ownPosts, activities });
    }
);

/****GET USER's POSTS ****/

router.get(
    "/myPosts/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        //get the user's own posts
        let post;
        let ownPosts = {};
        ownPosts.unfulfilled = [];
        ownPosts.pending = [];
        ownPosts.fulfilled = [];
        //get unfulfilled
        for (item of user.posts) {
            post = await Post.findOne({ _id: item, fulfilled: 0 });
            if (post !== null) {
                ownPosts.unfulfilled.push(post);
            }
        }
        //get pending
        for (item of user.posts) {
            post = await Post.findOne({ _id: item, fulfilled: 1 });
            if (post !== null) {
                ownPosts.pending.push(post);
            }
        }
        //get fulfilled
        for (item of user.posts) {
            post = await Post.findOne({ _id: item, fulfilled: 2 });
            if (post !== null) {
                ownPosts.fulfilled.push(post);
            }
        }

        return res.json(ownPosts);
    }
);

/****GET POSTS that user responded to****/

router.get(
    "/activities/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        //get the user's own posts
        let post;
        let activities = {};
        activities.unfulfilled = [];
        activities.pending = [];
        activities.fulfilled = [];
        //get unfulfilled
        for (item of user.activities) {
            post = await Post.findOne({ _id: item, fulfilled: 0 });
            if (post !== null) {
                activities.unfulfilled.push(post);
            }
        }
        //get pending
        for (item of user.activities) {
            post = await Post.findOne({ _id: item, fulfilled: 1 });
            if (post !== null) {
                activities.pending.push(post);
            }
        }
        //get fulfilled
        for (item of user.activities) {
            post = await Post.findOne({ _id: item, fulfilled: 2 });
            if (post !== null) {
                activities.fulfilled.push(post);
            }
        }

        return res.json(activities);
    }
);

/****GET Followed POSTS****/

router.get(
    "/followedPosts/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        //get the user's own posts
        let post;
        let followedPosts = {};
        followedPosts.unfulfilled = [];
        followedPosts.pending = [];
        followedPosts.fulfilled = [];
        //get unfulfilled
        for (item of user.followedPosts) {
            post = await Post.findOne({ _id: item, fulfilled: 0 });
            if (post !== null) {
                followedPosts.unfulfilled.push(post);
            }
        }
        //get pending
        for (item of user.followedPosts) {
            post = await Post.findOne({ _id: item, fulfilled: 1 });
            if (post !== null) {
                followedPosts.pending.push(post);
            }
        }
        //get fulfilled
        for (item of user.followedPosts) {
            post = await Post.findOne({ _id: item, fulfilled: 2 });
            if (post !== null) {
                followedPosts.fulfilled.push(post);
            }
        }

        return res.json(followedPosts);
    }
);
module.exports = router;
