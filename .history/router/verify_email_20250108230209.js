const jwt = require('jsonwebtoken');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
// Hàm tạo token xác nhận
function createVerificationToken(userId) {
  const token = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });  // Token hết hạn trong 1 giờ
  return token;
}
