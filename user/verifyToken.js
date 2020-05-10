const jwt = require("jsonwebtoken");

//simplest Access verifying
function verify(req, res, next) {
    const token = req.header("token"); //extract token from request header
    if (!token) return res.status(403).send("Access Denied"); //if there is no token ,return error
    //if token exists:
    const verifiedObj = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verifiedObj) return res.status(400).send("Invalid Token");
    console.log(verifiedObj);
    req.user = verifiedObj;
    next();
}

module.exports = verify;
