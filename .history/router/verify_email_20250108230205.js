const jwt = require('jsonwebtoken');

Xử lý việc gửi email xác nhận hoàn toàn trên Front-End (FE) là không khả thi do các lý do bảo mật và tính bảo mật của các dịch vụ email. Các lý do chính bao gồm:

Bảo mật thông tin nhạy cảm: Việc trực tiếp gửi email từ Front-End yêu cầu bạn phải lưu trữ thông tin nhạy cảm như mật khẩu hoặc API key của dịch vụ email (ví dụ: SendGrid, Gmail). Việc này có thể dẫn đến nguy cơ lộ thông tin nếu mã nguồn của bạn bị lộ.

Hạn chế quyền truy cập vào email server: Các dịch vụ gửi email, như Gmail, SendGrid, hoặc Amazon SES, yêu cầu bảo mật API và không cho phép trực tiếp gửi email từ Front-End mà không có sự xác thực qua Backend (server).

Quá trình gửi email yêu cầu quyền kiểm soát và xác thực người dùng: Để gửi email xác nhận người dùng, bạn cần kiểm tra xem người dùng có phải là người thực sự gửi yêu cầu hay không, và điều này chỉ có thể thực hiện một cách an toàn qua Backend.

Giải pháp an toàn:
Mặc dù không thể gửi email xác nhận trực tiếp từ Front-End, bạn có thể gửi yêu cầu đến Backend để xử lý việc gửi email. Dưới đây là một cách thực hiện:

1. Gửi yêu cầu từ Front-End đến Backend để gửi email
Frontend: Khi người dùng điền thông tin và yêu cầu xác nhận (ví dụ: nhấn nút đăng ký), Front-End sẽ gửi một yêu cầu HTTP (POST request) tới Backend.

Backend: Backend sẽ xử lý yêu cầu, tạo token xác nhận (JWT hoặc mã xác nhận), và gửi email qua dịch vụ gửi email (như NodeMailer, SendGrid).

Ví dụ chi tiết
Frontend (Vue.js / JavaScript)
javascript
Copy code
// Gửi yêu cầu đăng ký hoặc xác nhận từ FE đến BE
function sendVerificationRequest(userEmail) {
  const data = {
    email: userEmail,
  };

  fetch('https://your-backend.com/api/send-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Email đã được gửi', data);
  })
  .catch((error) => {
    console.error('Có lỗi xảy ra:', error);
  });
}
Backend (Node.js + Express + NodeMailer)
Cài đặt NodeMailer:
bash
Copy code
npm install nodemailer
Cấu hình và xử lý yêu cầu gửi email:
javascript
Copy code
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
