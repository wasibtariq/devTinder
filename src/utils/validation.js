const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password, age, gender, photoUrl, about, skills} = req;
    if(!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validatePassword(password)) {
        throw new Error("Please enter a strong password!");
    } 
}

const validateUserProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}

const validatePassword = (password) => {
    return validator.isStrongPassword(password);
}

module.exports = {validateSignUpData, validateUserProfileData, validatePassword};