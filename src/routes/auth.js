const express = require("express");
const {validateSignUpData, validatePassword} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        //Validation of data
        validateSignUpData(req.body);
        const {firstName, lastName, emailId, password, age, gender, photoUrl, about, skills} = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)

        //Creating a new instance of the User model
        const user = new User({
            firstName, 
            lastName, 
            emailId, 
            password: passwordHash, 
            age, 
            gender, 
            photoUrl, 
            about, 
            skills
        });

        const savedUser = await user.save();
        const token = await user.getJWT();
        res.cookie("token", token, { expires : new Date(Date.now() + 100 + 36000000)});
        res.json({message: "User added successfully!", data: savedUser});
    } catch(err) {
        res.status(400).send("Error saving user details:" + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({ emailId: emailId });
        if(!user) {
            throw new Error("Invalid credentials!");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires : new Date(Date.now() + 100 + 36000000)});
            res.send(user);
        } else {
            throw new Error("Invalid credentials!");
        }
    } catch(err) {
        res.status(400).send("Error:" + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout successful!");
});

authRouter.patch("/updatePassword", userAuth, async (req, res) => {
    try {
        const {password} = req.body;
        if (!validatePassword(password)) {
            throw new Error("Please enter a strong password!");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const loggedInUser = req.user;
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
        res.send("Password updated successfully");
    } catch(err) {
        res.status(400).send("Error:" + err.message);
    }
});

module.exports = authRouter;