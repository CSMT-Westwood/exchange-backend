/*
API for user info
*/
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("we are at /user/");
});

module.exports = router;
