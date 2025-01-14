const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const notificationsModel = require("../../../model/notificationsModel");

// get notifications by 1 user
router.get("/", async (req, res) => {
    try {
        const { user_id, limit = 10 } = req.query;
        if (!user_id) {
            return res.status(400).send("user_id is required");
        }
        let noti = await notificationsModel
            .find({
                user_id: new mongoose.Types.ObjectId(user_id),
            })
            .sort({ created_at: -1 })
            .limit(parseInt(limit));
            
        if (!noti) {
            return res.status(404).send("notifications not found");
        }
        res.send(noti);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving notifications");
    }
});

module.exports = router