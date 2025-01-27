const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const connectionRequest = require("../models/connectionRequest");

//Cron job will run at 8:30 pm -> explore at crontab.guru website
cron.schedule("30 20 * * *", async () => {
    // console.log("Hello World!" + new Date());
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await connectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];

        console.log("List of emails- ", listOfEmails);

        for(const email of listOfEmails) {
            //call send email method
            console.log("Email sent!")
        }
    } catch(err) {
        console.error(err);
    }
});