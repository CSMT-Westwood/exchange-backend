/*
API for posts related requests
*/
const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); //get model
const User = require("../models/User");
const loginRequired = require("../verifyToken"); //verifyToken.js
const middlewares = require("../middlewares");
const validation = require("./input_validations");
const postserializer = require("./postserializer");
const postTypeDict = {
    OFFER: 0,
    REQUEST: 1,
    TEXTBOOKS: 0,
    NOTES: 1,
    SKILLS: 2,
    UNFULFILLED: 0,
    PENDING: 1,
    FULFILLED: 2
};

// FOR TESTING PURPOSES // FOR TESTING PURPOSES // FOR TESTING PURPOSES
// Get all posts
router.get("/", async (req, res) => {
    const allPosts = await Post.find();
    const tobeserialized = allPosts.map((val) => {
        return postserializer.serialize(val);
    });
    const serialized = await Promise.all(tobeserialized);
    res.json(serialized);
});
// Delete all posts
router.delete("/", async (req, res) => {
    try {
        const allPosts = await Post.find();
        for (each of allPosts) {
            User.findOne({ _id: each.author }).then((user) => {
                user.posts = [];
                user.save();
            });
        }
        await Post.deleteMany({});
        res.status(418).json({ message: "Collection emptied." });
    } catch (err) {
        res.json({ message: err });
    }
});

// PUBLIC API // PUBLIC API // PUBLIC API // PUBLIC API // PUBLIC API

// Creating a new post
router.post("/new", loginRequired, async (req, res) => {
    // validate input
<<<<<<< HEAD
    req.body.course = req.body.course.split(" ").join("").toLowerCase();
    let courseNumberI = req.body.course.search(/[0-9]/g);
    req.body.course = req.body.course.substr(0, courseNumberI) + " " + req.body.course.substr(courseNumberI);
=======
    if (req.body.course !== undefined) {
        req.body.course = req.body.course.split(" ").join("").toLowerCase();
        console.log(req.body.course);
        let courseNumberI = req.body.course.search(/[0-9]/g);
        req.body.course =
            req.body.course.substr(0, courseNumberI) +
            " " +
            req.body.course.substr(courseNumberI);
    }
>>>>>>> master
    const error = validation.NewPostSchema.validate(req.body).error;
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // create a new post
    // NOT SURE IF THIS IS THE BEST WAY TO DO THIS
    const newPost = new Post({
        typeOfPost: req.body.typeOfPost,
        typeOfItem: req.body.typeOfItem,
        course: req.body.course,
        itemName: req.body.itemName,
        condition: req.body.condition,
        description: req.body.description,
        link: req.body.link,
        fulfilled: req.body.fulfilled,
        author: req.user._id,
        publication_date: Date.now(),
    });

    // save the new object
    try {
        const [postCreated, correspondingUser] = await Promise.all([
            newPost.save(),
            User.findOne({ _id: req.user._id }),
        ]);
        correspondingUser.posts.push(postCreated._id);
        await correspondingUser.save();

        // pop in the author & client info instead of boring IDs
        const result = await postserializer.serialize(newPost);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});

// Search for posts
router.get("/search", async (req, res) => {
    if (Object.keys(req.query).length === 0)
        return res.status(400).json({ message: "Error: No query" });
    // format the course name in the search query
    let typeOfItem = parseInt(req.query.typeOfItem);
    let queryText = req.query.query;
    let tempIndex = queryText.search(/[A-Za-z][0-9]/);
    queryText =
        queryText.substr(0, tempIndex + 1) +
        " " +
        queryText.substr(tempIndex + 1);

    // get the posts
    try {
        let results = await Post.find(
            {
                $text: { $search: queryText },
                typeOfItem: typeOfItem,
            },
            {
                score: { $meta: "textScore" },
            }
        ).sort({ score: { $meta: "textScore" } });

        // pop in the author info
        results = results.map((val) => {
            return postserializer.serialize(val);
        });
        results = await Promise.all(results);

        return res.status(200).json(results);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: "Bad Request!" });
    }
});

// user accepts a post
router.post("/accept", [loginRequired, middlewares.getUserObject], async (req, res) => {
    const currPost = await Post.findOne({_id: req.body._id});
    const postAuthor = await User.findOne({_id: currPost.author});
    const currUser = req.user;

    currPost.fulfilled = postTypeDict.PENDING;
    if (currPost.clients.includes(currUser._id) || 
        currUser.followedPosts.includes(currPost._id)) {
        return res.status(400).json({message: "User already followed the post."});
    }

    // add the user to the list of followers of the post.
    currPost.clients.push(currUser._id);
    // add the post to the list of followed posts of the user.
    currUser.followedPosts.push(currPost._id);

    if (currPost.typeOfPost === postTypeDict.OFFER && 
        currPost.typeOfItem === postTypeDict.NOTES) {
        currUser.rp -= 5;
        postAuthor.rp += 5;
        await Promise.all([
            currUser.save(),
            postAuthor.save(),
            currPost.save()
        ]);
        return res.status(200).json({message: "Show Link"});
    } else {
        return res.status(501).json({message: "not implemented"});
    }

    return res.status(200).json(currPost);
})

module.exports = router;
