const jwt = require("jsonwebtoken");
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const app = express();
require("dotenv").config();
const redis = require("redis");
const client = redis.createClient();
client.on("connect", () => {
  console.log("Connected to Redis");
});
app.use(express.json());

// Hàm tạo token xác nhận
function createVerificationToken(email) {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  client.get(email, (err, reply) => {
    if (err) {
      console.log(err);
    } else {
      // Nếu email đã có thì xoá token cũ đi
      if(reply){
        client.del(email, (err, reply) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Deleted:', reply); // 1 nếu thành công
          }
        });
      }
    }
  });
  client.setex(email, 900, token, (err, reply) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Lỗi lưu token vào Redis", error: err });
    }
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

function sendConfirmationEmail(to, token, message) {
  const type = message.includes("recovery")
    ? "forgot-changepass"
    : "verify-status";
  const mailOptions = {
    from: `"TSocial" <${process.env.GMAIL}>`,
    to: to,
    subject: "[TSocial please verify your email]",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              padding: 20px;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .email-header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333;
              line-height: 1.6;
              background-color: beige
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #4CAF50;
              color: white !important;
              font-size: 16px;
              text-decoration: none;
              border-radius: 4px;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .button:hover {
              background-color: #45a049;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #888;
            }
            .footer a {
              color: #4CAF50;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Welcome to TSocial!</h1>
            </div>
            <div class="email-body">
              <p>Hello,</p>
              <p>${message} and verify your email address, please click the button below:</p>
              <a href="${process.env.URL}/${type}?token=${token}" class="button">Verify Your Email</a>
              <p>If you didn't use TSocial, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>If you have any questions, feel free to <a href="mailto:support@tsocial.com">contact our support team</a>.</p>
              <p>&copy; 2025 TSocial. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
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
  const {
    email,
    message = "Thank you for registering with TSocial. To complete your registration",
  } = req.body;
  try {
    const token = createVerificationToken(email);
    await sendConfirmationEmail(email, token, message);
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Không thể gửi gmail", error: error });
  }
});

router.get("/verify", (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res
      .status(400)
      .json({ message: "Something when wrong. Please contact the developer" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Session has ended. Please try again" });
    }

    const userEmail = decoded.email;
    res.status(200).json({
      message: `Account with email ${userEmail} verified successfully`,
      status: "success",
    });
  });
});

module.exports = router;
