const jwt = require("jsonwebtoken");
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

// Hàm tạo token xác nhận
function createVerificationToken(userId) {
  const token = jwt.sign({ userId }, "your-secret-key", { expiresIn: "1h" });
  return token;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword",
  },
});
