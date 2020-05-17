const express = require("express");
const router = express.Router();
//const parser = require("./image");
const cloudinary = require("cloudinary");
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const bufferParser = new DatauriParser();

const storage = multer.memoryStorage({});
const upload = multer({ storage: storage });

router.post("/avatar/", upload.single("image"), (req, res) => {
    const buffer = req.file.buffer;
    datastring = bufferParser.format(
        path.extname(req.file.originalname).toString(),
        buffer
    );

    const response = cloudinary.v2.uploader.upload(
        datastring.content,
        { folder: "avatar" },
        (error, result) => {
            if (!error) {
                res.json(result);
            }
            res.json(error);
        }
    );
});
// cloudinary.v2.uploader.upload(req.file.path);

// const image = {};
// image.url = req.file.url;
// image.id = req.file.public_id;
// console.log(image);
// console.log(req);
// res.json(image);
// });

// router.post("/avatar/", parser.avatarParser().single("image"), (req, res) => {
//     // res.json(req.file);
//     console.log(req.file);
//     // cloudinary.v2.uploader.upload(req.file.buffer).then((result) => {
//     //     const image = result.url;
//     //     res.json("url", image);
//     // });
//     res.json(req.file);
// });
module.exports = router;
