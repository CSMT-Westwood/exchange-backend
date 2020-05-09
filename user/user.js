/*
API for user info
*/
const express = require('express');
const router = express.Router();

const User = require('../models/User') //get model

router.get('/', (req, res) => {
    res.send("we are at /user/");
});


router.post('/signup', (req,res)=>{
    console.log(req.body);
    
    
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        preferences: req.body.preferences,
        info: req.body.info
    });
    
        newUser.save();
        res.sendStatus(200);
    
});

module.exports = router;
