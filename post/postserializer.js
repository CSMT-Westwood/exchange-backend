const User = require("../models/User");
const Post = require("../models/Post");

const serialize = async (obj) => {
    obj = obj.toObject();
    findAuthor = User.findOne({ _id: obj.author }).select("username rp email avatar").lean();
    findClients = obj.clients.map((val, i) => {
        return User.findOne({ _id: val }).select("username rp email avatar").lean();
    })
    const [author, ...clients] = await Promise.all([findAuthor, ...findClients]);
    obj.author = author;
    obj.clients = clients;
    return obj;
}

module.exports = { serialize } 