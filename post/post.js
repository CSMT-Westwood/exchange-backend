/*
API for posts related requests
*/
const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); //get model
const User = require("../models/User");
const loginRequired = require("../verifyToken"); //verifyToken.js
const validation = require("./input_validations");

// FOR TESTING PURPOSES // FOR TESTING PURPOSES // FOR TESTING PURPOSES
// Get all posts
router.get("/", async (req, res) => {
    const allPosts = await Post.find();
    res.json(allPosts);
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
    if (req.body.course !== undefined) {
        req.body.course = req.body.course.split(" ").join("").toLowerCase();
        console.log(req.body.course);
        let courseNumberI = req.body.course.search(/[0-9]/g);
        req.body.course =
            req.body.course.substr(0, courseNumberI) +
            " " +
            req.body.course.substr(courseNumberI);
    }
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
        res.status(200).json(newPost);
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
        return res.status(200).json(results);
    } catch (e) {
        return res.status(400).json({ message: "Bad Request!" });
    }
});

module.exports = router;
