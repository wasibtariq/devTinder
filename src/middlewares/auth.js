const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Middleware for handling auth for all requests
const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).send("Invalid token!");
        }
        const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodeObj;
        const user = await User.findById(_id);
        if(!user) {
           throw new Error("User not found!");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = { userAuth }