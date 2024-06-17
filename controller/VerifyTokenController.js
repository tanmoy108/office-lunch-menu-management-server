const jwt = require('jsonwebtoken');
const SECRET_KEY = "shtanmoy";

console.log(SECRET_KEY)
exports.verifyToken =(req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json("Access token is required");
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};