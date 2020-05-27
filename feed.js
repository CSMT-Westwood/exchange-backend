const express = require("express");
const router = express.Router();
const Post = require("./models/Post"); //get model
const User = require("./models/User");
const loginRequired = require("./verifyToken"); //verifyToken.js
const middlewares = require("./middlewares");
const serializer = require("./post/postserializer");


async function serializePosts(posts) {
    //populate post Objects with clients and author info
    let res = (posts.map(post => {
        return serializer.serialize(post);
    }));
    res = await Promise.all(res);
    return res;
}

/*****GET FEED******/
//login required
router.get(
    "/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        user = req.user;
        let posts = [];
        //get posts by searching preferences
        let preferencePosts = [];
        for (item of user.preferences) {
            posts = posts.concat((Post.find(
                { $text: { $search: item } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } })));
        }
        preferencePosts = (await Promise.all(posts)).flat();
        posts = [];
        //get followedPosts
        let followedPosts = [];
        for (item of user.followedPosts) {
            posts.push(Post.findOne({ _id: item }));
        }
        followedPosts = (await Promise.all(posts)).filter((v) => v !== null);
        posts = [];
        //get the user's own posts
        let ownPosts = [];
        console.log(user.posts);
        for (item of user.posts) {
            posts.push(Post.findOne({ _id: item }));
        }

        ownPosts = (await Promise.all(posts)).filter((v) => v !== null);

        posts = [];

        //populate post Objects with clients and author info
        preferencePosts = await serializePosts(preferencePosts);
        followedPosts = await serializePosts(followedPosts);
        ownPosts = await serializePosts(ownPosts);

        res.json({ preferencePosts, followedPosts, ownPosts });
    }
);

/****GET USER's POSTS ****/

router.get(
    "/myPosts/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        //get the user's own posts
        let posts = [];
        let ownPosts = {};
        ownPosts.unfulfilled = [];
        ownPosts.pending = [];
        ownPosts.fulfilled = [];
        //get unfulfilled
        for (item of user.posts) {
            posts.push(Post.findOne({ _id: item, fulfilled: 0 }));
        }

        ownPosts.unfulfilled = (await Promise.all(posts)).filter((v) => v !== null);
        posts = [];

        //get pending
        for (item of user.posts) {
            posts.push(Post.findOne({ _id: item, fulfilled: 1 }));
        }
        ownPosts.pending = (await Promise.all(posts)).filter((v) => v !== null);
        posts = [];

        //get fulfilled
        for (item of user.posts) {
            posts.push(Post.findOne({ _id: item, fulfilled: 2 }));
        }
        ownPosts.fulfilled = (await Promise.all(posts)).filter((v) => v !== null);

        ownPosts.unfulfilled = await serializePosts(ownPosts.unfulfilled);
        ownPosts.pending = await serializePosts(ownPosts.pending);
        ownPosts.fulfilled = await serializePosts(ownPosts.fulfilled);
        return res.json(ownPosts);
    }
);

/****GET POSTS that user responded to****/
/*
router.get(
    "/activities/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        //get the user's own posts
        let posts = [];
        let activities = {};
        activities.unfulfilled = [];
        activities.pending = [];
        activities.fulfilled = [];
        //get unfulfilled
        for (item of user.activities) {
            posts.push(Post.findOne({ _id: item, fulfilled: 0 }));
        }
        activities.unfulfilled = (await (Promise.all(posts))).filter((v) => v !== null);
        posts = [];
        //get pending
        for (item of user.activities) {
            posts.push(Post.findOne({ _id: item, fulfilled: 1 }));
        }
        activities.pending = (await Promise.all(posts)).filter((v) => v !== null);

        posts = [];
        //get fulfilled
        for (item of user.activities) {
            post.push(Post.findOne({ _id: item, fulfilled: 2 }));
        }
        activities.fulfilled = (await Promise.all(posts)).filter((v) => v !== null);

        activities.unfulfilled = await serializePosts(activities.unfulfilled);
        activities.pending = await serializePosts(activities.pending);
        activities.fulfilled = await serializePosts(activities.fulfilled);

        return res.json(activities);
    }
);
*/
/****GET Followed POSTS****/

router.get(
    "/followedPosts/",
    [loginRequired, middlewares.getUserObject],
    async (req, res) => {
        //get the user's own posts
        let posts = [];
        let followedPosts = {};
        followedPosts.unfulfilled = [];
        followedPosts.pending = [];
        followedPosts.fulfilled = [];
        //get unfulfilled
        for (item of user.followedPosts) {
            posts.push(Post.findOne({ _id: item, fulfilled: 0 }));
        }
        followedPosts.unfulfilled = (await Promise.all(posts)).filter((v) => v !== null);
        posts = [];
        //get pending
        for (item of user.followedPosts) {
            posts.push(Post.findOne({ _id: item, fulfilled: 1 }));
        }
        followedPosts.pending = (await Promise.all(posts)).filter((v) => v !== null);
        posts = [];
        //get fulfilled
        for (item of user.followedPosts) {
            post.push(Post.findOne({ _id: item, fulfilled: 2 }));
        }
        followedPosts.fulfilled = (await Promise.all(posts)).filter((v) => v !== null);

        followedPosts.unfulfilled = await serializePosts(followedPosts.unfulfilled);
        followedPosts.pending = await serializePosts(followedPosts.pending);
        followedPosts.fulfilled = await serializePosts(followedPosts.fulfilled);
        return res.json(followedPosts);
    }
);
module.exports = router;
