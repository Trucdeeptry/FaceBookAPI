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
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function sendConfirmationEmail(to, token) {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: to,
    subject: "Email xác nhận đăng ký",
    html: `<p>Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
             <a href="${process.env}?token=${token}">Xác nhận tài khoản</a>`,
  };
}
