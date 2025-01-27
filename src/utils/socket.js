const socket = require("socket.io");
const crypto = require("crypto");
const {Chat} = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
   return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })
    
    io.on("connection", (socket) => {
        //handle events

        socket.on("joinChat", ({userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({firstName, userId, targetUserId, text}) => {
            //Save msg to the db
            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(firstName, text);

                //check if userId and targetUserId are friends

                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]}
                })
                if(!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text
                })
                await chat.save();
                io.to(roomId).emit("messageReceived", {firstName, text});
            } catch(err) {
                console.error(err);
            }
        });
        socket.on("disconnect", () => {
        });
    })
}

module.exports = initializeSocket;
