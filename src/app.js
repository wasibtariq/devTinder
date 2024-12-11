const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
    console.log("Database connection established!");
    app.listen(4000, () => {
        console.log("Server is listening");
    });
}).catch((err) => {
    console.error("Error connecting database!");
});

// //Demo API's
// //API to get a user by email
// app.get("/user", async (req, res) => {
//     try {
//         const users = await User.find({ emailId: req.body.emailId });
//         if(users.length === 0) {
//             res.status(404).send("User not found");
//         } else {
//             res.send(users);
//         }
//     } catch(err) {
//         res.status(400).send("Error finding user details:" + err.message);
//     }
// })

// //Feed API to get all users
// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({});
//         if(users.length === 0) {
//             res.status(404).send("User not found");
//         } else {
//             res.send(users);
//         }
//     } catch(err) {
//         res.status(400).send("Error finding users details:" + err.message);
//     }
// })

// //API to Delete user by id
// app.delete("/user", async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.body.userId);
//         res.send("User deleted succussfully!")
//     } catch(err) {
//         res.status(400).send("Error deleting a user:" + err.message);
//     }
// })

// //API to update user by id
// app.patch("/user/:userId", async (req, res) => {
//     try {
//         const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//         const isUpdatedAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
//         if(!isUpdatedAllowed) {
//             throw new Error("Update not allowed!");
//         }
//         if(req.body.skills.length > 10) {
//             throw new Error("Skills cannot be more than 10.")
//         }
//         const user = await User.findByIdAndUpdate({ _id: req.params.userId }, req.body, {
//             returnDocument: "after",
//             runValidators: true
//         });
//         res.send("User updated successfully: " + user);
//     } catch(err) {
//         res.status(400).send("Error updating a user:" + err.message);
//     }
// })
