const Post = require("./models/Post"); //get model
const User = require("./models/User");

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

module.exports = { getUserObject };
