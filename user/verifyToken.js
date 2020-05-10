const jwt = require("jsonwebtoken");

//simplest Access verifying
function verify(req, res, next) {
    const token = req.header("token"); //extract token from request header
    if (!token) return res.status(403).send("Access Denied"); //if there is no token ,return error
    //if token exists:
    try {
        var verifiedObj = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {
        return res.status(400).send("Invalid Token!");
    }
    console.log(`User ${verifiedObj._id} has made a request`);
    req.user = verifiedObj;
    next();
}

module.exports = verify;
