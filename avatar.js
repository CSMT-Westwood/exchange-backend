const express = require("express");
const router = express.Router();
const image = require("./image");
const cloudinary = require("cloudinary");
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const path = require("path");
const User = require("./models/User"); //get model

image.configImageCloud(); //set cloud credentials
const bufferParser = new DatauriParser();
const storage = multer.memoryStorage({});
const upload = multer({ storage: storage });

router.post("/avatar/:username", upload.single("image"), async (req, res) => {
    //check if user exists
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(401).json({ message: "User not found." });

    const buffer = req.file.buffer;
    datastring = bufferParser.format(
        //convert buffer to datauri
        path.extname(req.file.originalname).toString(),
        buffer
    );

    try {
        let resp;
        const response = await cloudinary.v2.uploader.upload(
            datastring.content,
            image.avatarConfig,
            (err, result) => {
                resp = result;
            }
        );

        //update avatar url
        try {
            const old_image_id = user.avatar_ID;
            if (old_image_id !== null) {
                //delete the old image
                try {
                    const del = await cloudinary.v2.api.delete_resources(
                        old_image_id
                    );
                } catch (err) {
                    return res.status(400).json(err);
                }
            }
            const update = await updateUserAvatar(
                req.params.username,
                resp.url,
                resp.public_id
            ); //update is the unupdated version of the user

            return res.status(200).json({
                username: update.username,
                url: resp.url,
                width: resp.width,
                height: resp.height,
            });
        } catch (error) {
            res.status(400).json(error);
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

//update user avatar url
async function updateUserAvatar(username, url, id) {
    try {
        const res = await User.findOneAndUpdate(
            { username: username },
            { avatar: url, avatar_ID: id }
        );
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports = router;
