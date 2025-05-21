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
      "https://scontent.fsgn5-13.fna.fbcdn.net/v/t1.15752-9/462562166_1105192867821838_2419752491535810082_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGcYKDFOJt5mvh0lO4vfxb23PK6LaeirNPc8rotp6Ks0-GY8SjRSU7vRHoOJpk-7FkQCw6HcODPW2pw3kDusYW9&_nc_ohc=VUpO90Oi7XIQ7kNvgFMZRep&_nc_zt=23&_nc_ht=scontent.fsgn5-13.fna&oh=03_Q7cD1gGZiFbDRgCBewLP_oKSMkr76Js4hRtXLpvLv7GJw8EO5w&oe=6797867F",
  },
  bio: { type: String, default: "" },
  followers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  following: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  friends: { type: [mongoose.Schema.Types.ObjectId], default: [] },

});

const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;
