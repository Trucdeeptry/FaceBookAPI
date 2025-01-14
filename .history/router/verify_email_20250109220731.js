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
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "phantruc438@gmail.com",
    pass: "kyhrintpyxxochfb",
  },
});

function sendConfirmationEmail(to, token) {
  const mailOptions = {
    from: `"TSocial" <${process.env.GMAIL}>`,
    to: to,
    subject: "[TSocial please verify your email]",
    html: `<p>Please click this link to verify your email:</p>
             <a href="${process.env.URL}/verify?email=${to}&token=${token}">Verify Account</a>`,
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
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Không thể gửi gmail", error: error, status: 'failed' });
  }
});

router.get("/verify", (req, res) => {
  const { token } = req.query;  
  if (!token) {
    return res.status(400).json({ message: "Không tìm thấy token", status: 'failed'});
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc hết hạn",status: 'failed' });
    }

    const userEmail = decoded.email;
    res.status(200).json({
      message: `Tài khoản với email ${userEmail} đã được xác nhận thành công`,
      status: "success",
    });
  });
});

module.exports = router;
