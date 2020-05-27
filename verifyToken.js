const jwt = require("jsonwebtoken");

//simplest Access verifying
function verify(req, res, next) {
    const token = req.header("token"); //extract token from request header
    if (!token) return res.status(401).json({message: "You need to log in first!"}); //if there is no token ,return error
    //if token exists:
    try {
        var verifiedObj = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(`User ${verifiedObj._id} has made a request`);
        req.user = verifiedObj;
        next();
    } catch (e) {
        return res.status(401).json({message: "Invalid Token!"});
    }
}

module.exports = verify;
