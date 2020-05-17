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
const avatarTrans = {
    folder: "avatar",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
};

module.exports.avatarTrans = avatarTrans;
module.exports.configImageCloud = configImageCloud;
