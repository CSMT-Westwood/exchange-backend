const express = require("express");
const router = express.Router();
const image = require("./image");
const cloudinary = require("cloudinary");
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const path = require("path");

image.configImageCloud(); //set cloud credentials

const bufferParser = new DatauriParser();

const storage = multer.memoryStorage({});
const upload = multer({ storage: storage });

router.post("/avatar/", upload.single("image"), async (req, res) => {
    const buffer = req.file.buffer;
    datastring = bufferParser.format(
        //convert buffer to datauri
        path.extname(req.file.originalname).toString(),
        buffer
    );
    try {
        const response = await cloudinary.v2.uploader.upload(
            datastring.content,
            image.avatarConfig,
            (error, result) => {
                res.json(result);
            }
        );
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
