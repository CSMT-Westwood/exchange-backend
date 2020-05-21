const Post = require("./models/Post"); //get model
const User = require("./models/User");

//temp middleware
//get complete user object
//has to be placed after verifyToken
async function getUserObject(req, res, next) {
    try {
        userID = req.user._id;
        user = await User.findById(userID);
    } catch (e) {
        return res.status(400).json("user not found");
    }
    req.user = user;
    next();
}

module.exports = { getUserObject };
