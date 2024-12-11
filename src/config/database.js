const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://wasibtariq:wd8lS8Se9mScwYDy@w-cluster.uxzod.mongodb.net/devTinder");
}

module.exports = connectDB;
