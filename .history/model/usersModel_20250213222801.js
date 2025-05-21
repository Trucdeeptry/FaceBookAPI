const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  info: {
    firstName: { type: String, required: true },
    surName: { type: String, required: true },
    gender: { type: Number },
    custom: { type: Number },
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/ggsneaker-js.appspot.com/o/meo.jpg?alt=media&token=12824029-78d8-4c0a-863d-89df435e242d",
  },
  bio: { type: String, default: "" },
  followers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  following: { type: [mongoose.Schema.Types.ObjectId], default: [] },
});

const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;
