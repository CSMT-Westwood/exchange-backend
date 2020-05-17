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
        //*****TODO: Error Handling ****/
        //update avatar url
        // const update = updateUserAvatar(req.params.username, resp.url);
        // console.log(update);
        // if (update === -1)
        //     return res.status(400).json({ message: "Error: updateOne" }); //should never happen
        // if (update === 0)
        //     return res.status(400).json({ message: "user not found" }); //should not happen with user token veri
        // if (update > 1)
        //     return res.status(400).json({ message: "Error: impossible error" }); //should never happen

        return res.status(200).json(resp);
    } catch (error) {
        res.status(400).json(error);
    }
});

//update user avatar url
//return number of user modified
//return -1 if updateOne returns error
function updateUserAvatar(username, url) {
    let value;
    const res = User.findOneAndUpdate(
        { username: username },
        { avatar: url },
        (err, doc, res) => {
            console.log(err);
            console.log(doc);
            console.log(res);
        }
    )
        .then()
        .catch();
    // console.log(res);
    return value;
}

module.exports = router;
