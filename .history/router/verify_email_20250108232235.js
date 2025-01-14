const jwt = require("jsonwebtoken");
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
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
             <a href="${process.env.URL}/verify?token=${token}">Xác nhận tài khoản</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Lỗi khi gửi email:', error);
    } else {
      console.log('Email đã được gửi:', info.response);
    }
  });
}

router.post('/send-verification', (req, res) => {
    const { email, userId } = req.body;
    const token = createVerificationToken(userId);
  
    sendConfirmationEmail(email, token);
  
    // Trả về phản hồi cho Frontend
    res.status(200).json({ message: 'Email xác nhận đã được gửi!' });
})