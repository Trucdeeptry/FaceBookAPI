const jwt = require("jsonwebtoken");
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const app = express();
const userModel = require("../model/usersModel");

app.use(express.json());

// Hàm tạo token xác nhận
function createVerificationToken(email) {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
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

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error); // Ném lỗi vào reject của Promise
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
    sendConfirmationEmail(email, token);
    res.status(200).json({ status: "success", token: token });
  } catch (error) {
    res.status(200).json({ message: "Không thể gửi gmail" });
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
