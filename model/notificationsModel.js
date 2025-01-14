const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    user_sent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
});

const Notification = new mongoose.model("notifications", notificationSchema);

module.exports = Notification;
