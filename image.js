/****a toolkit about image upload and storage*******/

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

//configure cloud credentials
function configImageCloud() {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    });
}

//Avatar image transformation
const avatarConfig = {
    folder: "avatar",
    allowedFormats: ["jpg", "png"],
    transformation: [
        { width: 150, height: 150, crop: "thumb", gravity: "face" },
    ],
};

module.exports.avatarConfig = avatarConfig;
module.exports.configImageCloud = configImageCloud;
