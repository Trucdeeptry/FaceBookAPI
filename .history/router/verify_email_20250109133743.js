const jwt = require("jsonwebtoken");
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const app = express();
require("dotenv").config();
app.use(express.json());

// Hàm tạo token xác nhận
function createVerificationToken(email) {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
}
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
});

function sendConfirmationEmail(to, token) {
  const mailOptions = {
    from: '',
    to: to,
    subject: "Email xác nhận đăng ký",
    html: `<p>Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
             <a href="${process.env.URL}/verify?token=${token}">Xác nhận tài khoản</a>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

router.post("/send-verification", async (req, res) => {
  const { email } = req.body;
  try {
    const token = createVerificationToken(email);    
    await sendConfirmationEmail(email, token);
    res.status(200).json({ status: "success", token: token });
  } catch (error) {
    res.status(500).json({ message: "Không thể gửi gmail", error: error });
  }
});

router.get("/verify", (res, req) => {
  const { token } = req.query;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc hết hạn" });
    }

    const userEmail = decoded.email;
    res.status(200).json({
      message: `Tài khoản với email ${userEmail} đã được xác nhận thành công`,
      status: "successs",
    });
  });
});

module.exports = router;
