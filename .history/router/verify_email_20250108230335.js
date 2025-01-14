const jwt = require('jsonwebtoken');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use();

// Hàm tạo token xác nhận
function createVerificationToken(userId) {
  const token = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });  // Token hết hạn trong 1 giờ
  return token;
}
